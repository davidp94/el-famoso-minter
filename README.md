# El famoso minter
This project lets you :
- Deploy a ERC20 Mintable token on Ropsten
- Expose an API in order to send tokens to any ethereum address

## Get started


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
npm install
```

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
