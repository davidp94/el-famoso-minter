const express = require('express');
const app = express();
const assert = require('assert');
const fs = require('fs');

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx')
const expressQueue = require('express-queue');

const queueMw = expressQueue({ activeLimit: 1, queuedLimit: -1 });


app.get('/', (req, res) => {
    res.send('!')
});

const CONFIG = JSON.parse(fs.readFileSync('config.json', 'utf8'));
const ABI_MINTABLETOKEN = JSON.parse(fs.readFileSync('MintableToken.abi.json', 'utf8'));

const MINTER_CONTRACT_ADDRESS = CONFIG.MINTER_CONTRACT_ADDRESS || process.env.MINTER_CONTRACT_ADDRESS;
const MINTER_PRIVATE_KEY = CONFIG.MINTER_PRIVATE_KEY || process.env.MINTER_PRIVATE_KEY;
const ETHEREUM_JSONRPC_API_ENDPOINT = CONFIG.ETHEREUM_JSONRPC_API_ENDPOINT || process.env.ETHEREUM_JSONRPC_API_ENDPOINT;
const MINTER_ADDRESS = CONFIG.MINTER_ADDRESS || process.env.MINTER_ADDRESS;

assert(MINTER_CONTRACT_ADDRESS, "Missing MINTER_CONTRACT_ADDRESS");
assert(MINTER_PRIVATE_KEY, "Missing MINTER_PRIVATE_KEY");
assert(MINTER_ADDRESS, "Missing MINTER_ADDRESS");
assert(ETHEREUM_JSONRPC_API_ENDPOINT, "Missing ETHEREUM_JSONRPC_API_ENDPOINT");

const web3 = new Web3(new Web3.providers.HttpProvider(ETHEREUM_JSONRPC_API_ENDPOINT));
const mintableTokenContract = new web3.eth.Contract(ABI_MINTABLETOKEN, MINTER_CONTRACT_ADDRESS);
const privateKey = Buffer.from(MINTER_PRIVATE_KEY, 'hex')

app.get('/send/:recipientAddress/:quantity', async (req, res) => {
    const recipientAddress = web3.utils.toChecksumAddress(req.params.recipientAddress);
    const quantity = parseInt(req.params.quantity) || 0;
    const txData = mintableTokenContract.methods.mint(recipientAddress, quantity).encodeABI();
    const txGasLimit = 40000; // await mintableTokenContract.methods.mint(recipientAddress, quantity).estimateGas();

    // console.log('------------------------------------');
    // console.log(`txGasLimit ${txGasLimit}`);
    // console.log('------------------------------------');

    const txParams = {
        nonce: web3.utils.toHex(await web3.eth.getTransactionCount(MINTER_ADDRESS)),
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        gasLimit: web3.utils.toHex(txGasLimit),
        to: MINTER_CONTRACT_ADDRESS,
        value: '0x00',
        data: txData,
        // EIP 155 chainId - mainnet: 1, ropsten: 3
        chainId: 3
    };

    // console.log(txParams);

    const tx = new EthereumTx(txParams)
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    const receipt = await web3.eth.sendSignedTransaction(`0x${serializedTx.toString('hex')}`);

    return res.json(receipt);
});

app.get('/balance/:address', queueMw, async (req, res) => {
    return res.json({
        'balance': await mintableTokenContract.methods.balanceOf(web3.utils.toChecksumAddress(req.params.address)).call()
    })
});

app.listen(3000, function () {
    console.log('El famoso minter running listening on port 3000!')
    // console.log('------------------------------------');
    // console.log(`Configuration ${JSON.stringify(CONFIG, null, 4)}`);
    // console.log('------------------------------------');
})