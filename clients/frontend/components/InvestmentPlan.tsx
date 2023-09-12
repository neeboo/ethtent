'use client';
import React, { useEffect, useState, useRef } from 'react';
import { InvestPlanType } from '@/types/InvestPlanType';
import { _createActor } from '@/services/baseConnection';
import { idlFactory as ethTentsIDL } from '@/services/idls/eth_tents.idl';
import { IntentItem, UserIntents, _SERVICE as ethTentsService } from '@/services/idls/eth_tents';
import { loadIdentity } from './CreateAPlanModal';

export const useInterval = (cb: Function, time = 1000) => {
  const cbRef = useRef<Function>();
  useEffect(() => {
    cbRef.current = cb;
  });
  useEffect(() => {
    const callback = () => {
      cbRef.current?.();
    };
    const timer = setInterval(() => {
      callback();
    }, time);
    return () => clearInterval(timer);
  }, []);
};

const InvestmentPlan: React.FC<InvestPlanType> = prop => {
  const [dateNow, setDateNow] = useState('');
  const [txHash, setTxHash] = useState<string | undefined>(undefined);

  function getDateNow() {
    let date = new Date();
    setDateNow(date.toDateString());
  }

  useEffect(() => {
    getDateNow();
  }, []);

  useInterval(async () => {
    await getIntentDetail(prop.intent_id!);
  }, 1000);

  async function getIntentDetail(id: string) {
    const { actor } = await _createActor<ethTentsService>(ethTentsIDL, 'ra6hu-lqaaa-aaaah-adpra-cai', loadIdentity()!, 'https://icp-api.io');
    const detail = await actor.get_intent_by_id(id);
    if (detail.length > 0 && detail[0]!.tx_hash) {
      setTxHash(detail[0]!.tx_hash[0]);
    }
  }

  function pauseInvestment() {
    console.log('pauseInvestment');
  }

  return (
    <div className="w-[500px] h-[200px] shadow-lg grid grid-rows-4 gap-1 p-3">
      <div className="row-span-1 grid grid-cols-3 space-x-1">
        <div className="col-span-2">
          <div className=" text-black text-lg font-normal">Portfolio XDai - ETH 1</div>
          <div className=" text-black text-xs font-normal">{prop.amount} XDai - Per Hour</div>
        </div>
        <div>
          <button className=" w-40 bg-red-600 rounded-xl text-white hover:bg-red-500" onClick={pauseInvestment}>
            Stop
          </button>
          {txHash ? (
            <a style={{ wordBreak: 'break-all' }} href={`https://explorer.testnet.mantle.xyz/tx/${txHash}`}>
              {txHash}
            </a>
          ) : (
            'Queueing'
          )}
        </div>
      </div>

      <div className="row-span-2 grid grid-cols-2">
        <div className="">
          <div className=" text-red-400 text-lg font-normal">Total Revenue</div>
          <div>
            = {prop.revenue} {prop.currency}
          </div>
          <div className="">
            <div className=" text-black text-xs font-normal mb-1">
              = {prop.revenue} {prop.currency}
            </div>
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
          <div className="text-black text-xs font-normal">
            {prop.gainLoss} {prop.currency}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentPlan;
