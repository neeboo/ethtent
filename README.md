# Ethtent 

an intent-solver infrastructure for automated defi earning

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

Demo2: Buy ETH (mainnet) with DAI (polygon) every hour 

Demo3: Buy ETH (mainnet) with DAI (linea) every hour 

Presentation:https://docs.google.com/presentation/d/1fnSVpnyF03PFtBpjgA0ILBuaSA0kTizPsnBEFGJhp9k/edit#slide=id.g27d935277de_0_22   


