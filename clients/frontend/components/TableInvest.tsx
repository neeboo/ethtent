import React, { useState } from 'react';
import DialogDemo from './CreateAPlanModal';
const TableInvest: React.FC = () => {
    const tradeData = [
        {
            id: 1,
            name: 'ETH',
            available: true,
            history: [
                { id: 1, label: '5YR', value: '113.36%' },
                { id: 2, label: '3YR', value: '70.36%' },
                { id: 3, label: '7D', value: '-50.33%' },
            ],
        },
        {
            id: 2,
            name: 'BTC',
            available: false,
            history: [
                { id: 1, label: '5YR', value: '100.36%' },
                { id: 2, label: '3YR', value: '30.36%' },
            ],
        },
    ];

    // State to hold the currently selected history value for each trade
    const [selectedHistory, setSelectedHistory] = useState<Record<number, string>>({});
    const [currentTrade, setCurrentTrade] = useState<boolean>(false);


    const handleClick = (tradeId: number, historyValue: string) => {
        setSelectedHistory({ ...selectedHistory, [tradeId]: historyValue });
    };

    const openDialog = (trade: boolean) => {
        setCurrentTrade(trade);
    }

    return (
        <>
            <h1 className='text-black font-bold text-4xl my-2'>Table of Choice</h1>
            <div className="grid grid-cols-8 h-[50px] bg-neutral-200 p-3 font-semibold text-xl">
                <div className="col-span-1">
                    <h1>Product</h1>
                </div>
                <div className="col-span-7">
                    History ROI
                </div>
            </div>

            {tradeData.map((trade) => (
                <div key={trade.id} className="grid grid-cols-8 items-center h-[60px] bg-neutral-100 gap-2 p-3">
                    <div className="text-md font-normal text-black col-span-1">
                        {trade.name}
                    </div>

                    <div className="col-span-6 grid grid-cols-8 items-center gap-1">
                        <span className={`text-xs font-bold ${parseFloat(selectedHistory[trade.id] || trade.history[0]?.value) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {selectedHistory[trade.id] || trade.history[0]?.value}
                        </span>

                        <div className="grid grid-cols-[repeat(6,auto)] gap-2">
                            {trade.history.map((historyItem) => (
                                <div key={historyItem.id} className="flex items-center justify-center w-[60px] h-[20px] bg-zinc-300 rounded-sm cursor-pointer"
                                    onClick={() => handleClick(trade.id, historyItem.value)}
                                >
                                    <span className="text-xs font-normal text-black">
                                        {historyItem.label}
                                    </span>
                                </div>
                            ))}
                        </div>


                    </div>
                    <DialogDemo available={trade.available} openDialog={openDialog} />
                </div>
            ))}
        </>
    );
};

export default TableInvest;
