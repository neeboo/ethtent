# Ethtent System flow diagram

```markdown
![eth](https://github.com/neeboo/ethtent/blob/main/contract/image/ethtent.png)
```


# Ethtent solidity contract 

If you need to test, you have the following dependencies:

```shell

    npm init -y 
    npm install --save-dev hardhat 
    npm i @axelar-network/axelar-gmp-sdk-solidity
    npm i --save-dev @nomiclabs/hardhat-ethers 
    npm i eth-sig-util 
    npm i -g @remix-project/remixd  
    npm i @uniswap/v2-periphery 
    npm i @uniswap/v2-core
    npm i @openzeppelin/contracts	

```

## polygon TestNet Deploy Address

We have deployed on 3 test chains, among which polygon and linea have completed contract verification


```shell

Polygon 
https://mumbai.polygonscan.com/

| name   | address 
| ----   | ------------------------------------------ | 
| Ethtent| 0x3Fe2f27E3831eF836137A38e7895B6DdB48E4D1C | 
| dai    | 0xDDD657ebc496DDB74Fb96F21C861bd9A1807f68e |              
| aUsdc  | 0x2c852e740b62308c46dd29b982fbb650d063bd07 | 
| ----   | ------------------------------------------ | 

Mantle 
https://explorer.testnet.mantle.xyz/

| name   | address 
| ----   | ------------------------------------------ | 
| Ethtent| 0xB45966E75317c30610223ed5D26851a80C4F5420 | 
| dai    | 0x99f3eB619d84337070f41D15b95A2Dffad76F550 |              
| aUsdc  | 0x254d06f33bDc5b8ee05b2ea472107E300226659A | 
| ----   | ------------------------------------------ | 

Linea 
https://goerli.lineascan.build/

| name   | address 
| ----   | ------------------------------------------ | 
| Ethtent| 0xFFc8B7feE0ad0Dc3e64b75ac85000aE28057f52A | 
| dai    | 0x6DAB7981876a351A0b4E9A299ECD2F5c8462eDA6 |              
| aUsdc  | 0x254d06f33bdc5b8ee05b2ea472107e300226659a | 
| ----   | ------------------------------------------ | 


```

