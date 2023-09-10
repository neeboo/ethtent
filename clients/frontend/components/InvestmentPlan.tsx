import React, { useEffect, useState } from "react";
import { InvestPlanType } from "@/types/InvestPlanType";


const InvestmentPlan: React.FC<InvestPlanType> = (prop) => {

    const [dateNow, setDateNow] = useState("");

    function getDateNow() {
        let date = new Date();
        setDateNow(date.toDateString());
    }

    useEffect(() => {
        getDateNow();
    }, []);

    function pauseInvestment() {
        console.log("pauseInvestment");
    }


    return (
        <div className="w-[500px] h-[200px] shadow-lg grid grid-rows-4 gap-1 p-3">
            <div className="row-span-1 grid grid-cols-3 space-x-1">

                <div className="col-span-2">
                    <div className=" text-black text-lg font-normal">Portfolio USDT - ETH 1</div>
                    <div className=" text-black text-xs font-normal">{prop.amount} USDT - Per Month</div>
                </div>
                <div>
                    <button className=" w-40 bg-red-600 rounded-xl text-white hover:bg-red-500" onClick={pauseInvestment} >Stop</button>
                </div>
            </div>

            <div className="row-span-2 grid grid-cols-2">
                <div className="">
                    <div className=" text-red-400 text-lg font-normal">Total Revenue</div>
                    <div>= {prop.revenue} {prop.currency}</div>
                    <div className="">
                        <div className=" text-black text-xs font-normal mb-1">= {prop.revenue} {prop.currency}</div>
                        <div className="w-[30%] bg-zinc-300 rounded-sm text-center">
                            <div className=" text-black text-xs font-normal">ONE-TIME</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row-span-1 grid grid-cols-2">
                <div className="col-span-1">
                    <div className=" text-black text-xs font-normal">Next Auto-Invest Date</div>
                    <div className=" text-black text-xs font-normal">{dateNow}</div>
                </div>
                <div>
                    <div className=" text-stone-400 text-opacity-90 text-xs font-normal">Unrealized Gain & Loss</div>
                    <div className="text-black text-xs font-normal">{prop.gainLoss} {prop.currency}</div>
                </div>
            </div>


        </div>
    )
}

export default InvestmentPlan;