'use client';
import InvestmentPlan from '@/components/InvestmentPlan';
import { InvestPlanType } from '@/types/InvestPlanType';

const InvestmentPlanView: React.FC = () => {
  let testprop: InvestPlanType = {
    amount: 100,
    revenue: 10,
    currency: 'USD',
    total: 110,
    date: '2023-09-10',
    gainLoss: 10,
  };

  return (
    <section className="my-4">
      <h1 className="text-black font-bold text-4xl m-2">Investment Plan</h1>
      <InvestmentPlan {...testprop} />
    </section>
  );
};

export default InvestmentPlanView;
