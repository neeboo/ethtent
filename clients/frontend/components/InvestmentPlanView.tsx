
import InvestmentPlan from '@/components/InvestmentPlan'
import { InvestPlanType } from '@/types/InvestPlanType'

const InvestmentPlanView: React.FC = () => {
    let testprop: InvestPlanType = {
        amount: 100,
        revenue: 10,
        currency: 'USD',
        total: 110,
        date: '2023-09-10',
        gainLoss: 10,
    }

    return (


        <section className='h-min-[1000px]'>
            <h1 className='text-black'>Investment Plan</h1>
            <InvestmentPlan {...testprop} />
        </section>



    )
}

export default InvestmentPlanView