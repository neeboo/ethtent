# Ethtent - an intent-solver infrastructure for automated defi earning

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


##  Motivation

We stand at the cusp of a transformative moment in the Web3 financial landscape. For this hackathon, we're transcending conventional "intent-centric" approaches to dig deeper into substantial use-cases. Our focus is on Dollar-Cost Averaging (DCA), a proven and reliable strategy in traditional financial markets that is notably absent in the Web3 ecosystem. 

The key to this gap lies in Account Abstraction (AA). By synergistically combining AA with intent-centric design in an innovative wallet solution, we aim to provide a user experience that is both seamless and secure. This will facilitate the execution of recurrent on-chain purchases, all while empowering users to maintain full control over their assets. This is not merely a project; it is a bold step toward the future of decentralized finance.

## Problem Statement

Dollar-Cost Averaging (DCA) is an effective investment strategy to build wealth over the long term. It has been proven working well with crypto assets like BTC and ETH. Exchanges like Binance, Coinbase and OKX etc already provide DCA feature, and it’s used by many users.  

![eth](https://github.com/neeboo/ethtent/blob/main/contract/image/1694487210251.jpg)


Can defi users also buy tokens recurringly over time in a more decentralized way?	

Intents empower users to specify their desired on-chain results and delegate the complex technical processes to third-party solvers. These solvers directly interact with networks and protocols on the user's behalf. Ultimately, this layer of abstraction will enhance the user experience of Web3 applications, making them feel as seamless as conventional apps. It effectively diminishes the existing technical learning curve, facilitating the onboarding of numerous new users.


## Our Solution (Summary + Intent background) 


![eth](https://github.com/neeboo/ethtent/blob/main/contract/image/1694487388390.jpg)


Continuous Intents, Express a desire to take a repeated action

Ethtent Tech Stack
Diagram (Shisi)

Stack used (for each tracks)	


Live Demo Video 

Future Work

Auction layer to settle bids between multiple solvers. Consider to build on an rollup powered by AltLayer which is usable and gassless, while it’s still decentralized enough.  
