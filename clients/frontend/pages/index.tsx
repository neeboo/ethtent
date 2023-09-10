import InvestmentPlanView from "@/components/InvestmentPlanView"
import TableInvest from "@/components/TableInvest"
import Headers from "@/components/Header"

export default function Home() {

  return (
    <>
      <Headers />
      <main className='bg-white'>

        <InvestmentPlanView />

        <TableInvest />
      </main>
    </>

  )
}
