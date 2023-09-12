'use client';
import InvestmentPlan from '@/components/InvestmentPlan';
import { UserIntents } from '@/services/idls/eth_tents';
import { InvestPlanType } from '@/types/InvestPlanType';

function getVaultFromDaiContract(addr: string) {
  switch (addr.toLowerCase()) {
    case '0xDDD657ebc496DDB74Fb96F21C861bd9A1807f68e'.toLowerCase(): {
      return {
        vault: '0x3Fe2f27E3831eF836137A38e7895B6DdB48E4D1C',
        rpc: 'https://rpc.ankr.com/polygon_mumbai',
        chainId: 80001,
        name: 'polygon',
        explorer: 'https://mumbai.polygonscan.com/tx/',
      };
    }
    case '0x99f3eB619d84337070f41D15b95A2Dffad76F550'.toLowerCase(): {
      return {
        vault: '0xB45966E75317c30610223ed5D26851a80C4F5420',
        rpc: 'https://rpc.testnet.mantle.xyz/',
        chainId: 5001,
        name: 'mantle',
        explorer: 'https://explorer.testnet.mantle.xyz/tx/',
      };
    }
    case '0x6DAB7981876a351A0b4E9A299ECD2F5c8462eDA6'.toLowerCase(): {
      return {
        vault: '0xFFc8B7feE0ad0Dc3e64b75ac85000aE28057f52A',
        rpc: 'https://rpc.goerli.linea.build/',
        chainId: 59140,
        name: 'linea',
        explorer: 'https://explorer.goerli.linea.build/tx/',
      };
    }
    default:
      return {
        vault: '0xB45966E75317c30610223ed5D26851a80C4F5420',
        rpc: 'https://rpc.testnet.mantle.xyz/',
        chainId: 5001,
        name: 'mantle',
        explorer: 'https://explorer.testnet.mantle.xyz/tx/',
      };
  }
}

const InvestmentPlanView = ({ newData }: { newData?: UserIntents }) => {
  let testprop: InvestPlanType = {
    amount: newData?.intent_item.amount.toString() ?? '0',
    revenue: '-',
    currency: newData?.intent_item.tokenOutSymbol ?? 'USD',
    total: 110,
    date: '2023-09-10',
    gainLoss: 10,
    tx_hash: newData?.tx_hash[0],
    intent_id: newData?.intent_id[0],
    explorer: newData?.intent_item.tokenIn ? getVaultFromDaiContract(newData?.intent_item.tokenIn!).explorer : '',
  };

  return (
    <section className="my-4">
      <h1 className="text-black font-bold text-4xl m-2">Investment Plan</h1>
      {newData ? <InvestmentPlan {...testprop} /> : <>No New Data</>}
    </section>
  );
};

export default InvestmentPlanView;
