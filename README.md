# Ethtent 

an intent-solver infrastructure prototype for automated defi earning

# Demo Video [here](https://www.youtube.com/watch?v=qYa4qzUO-w8)

## Project Desciption 

We build an intent-solver infrastructure for automated defi trading. One of the use cases is buying or selling tokens on defi recurringly over time. 

Dollar-Cost Averaging (DCA) is an effective investment strategy to build wealth over the long term. It has been proven for crypto assets like BTC and ETH, but users can only use DCA in central exchanges like Binance, Coinbase and OKX etc today. 

In our design, a user signs her intent of “Buy ETH every week with DAI at market price”.  3rd party services, aka “solvers”, monitor the intent pool and create transactions to fill the user’s intent to make DAI <> ETH swap.  

If the user's DAI balance is sufficient,  one single signed intent for DCA can be monitored by solvers, leading to a continuous series of transactions over time. This allows the user to achieve their desired outcome without the need for direct interaction with EVM or a particular protocol.
Solvers can also perform cross-chain asset swaps “Buy ETH on Mainnet every week with DAI on Mantle”, so users don’t need to worry about chain details. 

In additional, batch transactions of different users is supported which can lead to gas saving. 

## Ethtent System flow diagram

![eth](https://github.com/neeboo/ethtent/blob/main/contract/image/ethtent.png)
![eth](https://github.com/neeboo/ethtent/blob/main/contract/image/contract.jpg)


## How it’s made

We deploy our contracts on Ethereum, Mantle, Polygon, and Linea. Axelar is used for cross-chain assets tx

Ethten:  https://eth-intents.vercel.app/ 
Github: https://github.com/neeboo/ethtent 

Demo1: Mantle xDAI -> Goerli wETH every hour 
- intent TX:
https://explorer.testnet.mantle.xyz/tx/0x922844a5a0d009116ca239a392de2dad42d4841d989839eccd7ef5f7ee29ee75 
- Axelar gateway:
https://testnet.axelarscan.io/transfer/0x922844a5a0d009116ca239a392de2dad42d4841d989839eccd7ef5f7ee29ee75 
- DCA cross-chain tx:
https://goerli.etherscan.io/tx/0x38d92ee8ab951591fdee50b79e51b24fee0f33eda8653739ea66cf49f12697d2

Demo2: Linea xDAI -> Goerli wETH every hour 
- intent TX:
https://goerli.lineascan.build/tx/0xcc2b4aec6a38bf1237c6872ae0ae8da5a7cec68ebab0d0725c272df5c1203713
- Axelar gateway:
https://testnet.axelarscan.io/transfer/0xcc2b4aec6a38bf1237c6872ae0ae8da5a7cec68ebab0d0725c272df5c1203713
- DCA cross-chain tx:
https://goerli.etherscan.io/tx/0x118f89d653b58a811f94b3f2299dc1d7419da839e93b5d5fcefdbef56bb594a9
https://goerli.etherscan.io/tx/0x4da7cc9ee8e14eef8ab2093ea55f153ed979551169cd0fd88cab2cd6ebb36a40

Demo3: Polygon xDAI -> Goerli wETH every hour 
- intent TX:
https://mumbai.polygonscan.com/tx/0x6933c395db0023eef46db3f47a7afe79ea743eb9f18e9e9b1ff4153c2255480b
- Axelar gateway:
https://testnet.axelarscan.io/transfer/0x6933c395db0023eef46db3f47a7afe79ea743eb9f18e9e9b1ff4153c2255480b
- DCA cross-chain tx:
https://goerli.etherscan.io/tx/0x1f35c4379996cbb65c113ac4abe155cb8b147e487e175fa3daba3f7bb4fb7e5b




Presentation:

https://docs.google.com/presentation/d/1fnSVpnyF03PFtBpjgA0ILBuaSA0kTizPsnBEFGJhp9k/edit#slide=id.g27d935277de_0_22   


