import InvestmentPlanView from "@/components/InvestmentPlanView"
import TableInvest from "@/components/TableInvest"
import Headers from "@/components/Header"
import Footer from "@/components/Footer"

export default function Home() {

  return (
    <>
      <Headers />
      <main className='min-h-[1280px] mx-auto w-[1080px]'>

        <InvestmentPlanView />

        <TableInvest />
      </main>
      <Footer />
    </>

  )
}
