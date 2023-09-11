'use client';
import { StrictMode, useState } from 'react';
// import { Provider } from 'react-redux'
import Image from 'next/image';
import InvestmentPlanView from '@/components/InvestmentPlanView';
import TableInvest from '@/components/TableInvest';
import Headers from '@/components/Header';
import Footer from '@/components/Footer';
import { MMAuthProvider, useMMAuth } from '@/services/mm/mm';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import { Button } from '@/components/ui/button';
import { UserIntents } from '@/services/idls/eth_tents';

export default function Home() {
  const { isConnected, identity, isLoading, login, logout, address } = useMMAuth();
  const [newData, setNewData] = useState<UserIntents | undefined>(undefined);

  return (
    <>
      <Headers
        onConnect={async () => {
          await login();
        }}
        loading={isLoading}
        buttonText={identity !== undefined && address !== undefined ? handleAddress(address!) : isLoading ? 'Signing In ...' : 'Connect'}
        logout={logout}
        isSignedIn={identity !== undefined && address !== undefined}
        onSwitchNetwork={async chainId => {
          console.log(chainId);
        }}
      />

      <main className="min-h-[1280px] mx-auto w-[1080px]">
        <Image src="/static/logo.jpg" alt="Picture of the author" width={200} height={200} className="mx-auto m-2" />
        <InvestmentPlanView newData={newData} />
        <TableInvest
          identity={identity}
          onAddedData={e => {
            setNewData(e);
          }}
        />
      </main>
      <Footer />
    </>
  );
}

function handleAddress(add: string) {
  const pre = add.substring(2, 4);
  const post = add.substring(add.length - 4, add.length);
  return `0x${pre}...${post}`;
}
