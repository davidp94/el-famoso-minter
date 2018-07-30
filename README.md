# El famoso minter
This project lets you :
- Deploy a ERC20 Mintable token on Ropsten
- Expose an API in order to send tokens to any ethereum address

## Get started

## Copy the Git repo

```
git clone https://github.com/davidp94/el-famoso-minter
```

```
cd el-famoso-minter
```

```
npm install
```

## Generate the admin ethereum address of your token contract

https://iancoleman.io/bip39/?
Select ETH and 12 words
Get the BIP44 first address `m/44'/60'/0'/0/0`

### Generate a Mnemonic

### Add some ethers to your admin ethereum address

Use for example a faucet: http://faucet.ropsten.be:3001/

### Generate an Infura API key

https://infura.io/register

### Deploy your ERC20

Deploy your new token using this command

```
cd dependencies/openzeppelin-solidity/
INFURA_API_KEY="YOUR_API_KEY" MNEMONIC="YOUR_MNEMONIC" truffle deploy --network="ropsten"
```
Note : replace `YOUR_API_KEY` by your Infura API key, and `YOUR_MNEMONIC` by your mnemonic of your HD wallet.

### Configuration

Create a config.json containing the following data:
```
{
    "ETHEREUM_JSONRPC_API_ENDPOINT": "https://ropsten.infura.io/API_KEY",
    "MINTER_CONTRACT_ADDRESS": "",
    "MINTER_PRIVATE_KEY": "",
    "MINTER_ADDRESS": ""
}
```

### Run the server

```
node .
```


### API Documentation

- Send token to a recipient

GET `/send/:recipientAddress/:quantity`

Mint and send an amount of `quantity` to `recipientAddress`.

You will receive the transaction receipt and can see the transaction on etherscan.

- Get balance of token of an address

GET `/balance/:address`
