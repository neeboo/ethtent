'use client';
import InvestmentPlan from '@/components/InvestmentPlan';
import { UserIntents } from '@/services/idls/eth_tents';
import { InvestPlanType } from '@/types/InvestPlanType';

const InvestmentPlanView = ({ newData }: { newData?: UserIntents }) => {
  let testprop: InvestPlanType = {
    amount: newData?.intent_item.amount.toString() ?? '0',
    revenue: '-',
    currency: newData?.intent_item.tokenOutSymbol ?? 'USD',
    total: 110,
    date: '2023-09-10',
    gainLoss: 10,
  };

  return (
    <section className="my-4">
      <h1 className="text-black font-bold text-4xl m-2">Investment Plan</h1>
      {newData ? <InvestmentPlan {...testprop} /> : <>No New Data</>}
    </section>
  );
};

export default InvestmentPlanView;
