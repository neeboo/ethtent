'use client';
import { StrictMode } from 'react';
// import { Provider } from 'react-redux'
import InvestmentPlanView from '@/components/InvestmentPlanView';
import TableInvest from '@/components/TableInvest';
import Headers from '@/components/Header';
import Footer from '@/components/Footer';
import { MMAuthProvider, useMMAuth } from '@/services/mm/mm';

export default function Home() {
  const { isConnected, identity, isLoading, login, logout, address } = useMMAuth();

  return (
    <>
      <Headers
        onConnect={async () => {
          await login();
        }}
        loading={isLoading}
        buttonText={identity !== undefined && address !== undefined ? handleAddress(address!) : 'Connect'}
        logout={logout}
        isSignedIn={identity !== undefined && address !== undefined}
      />
      <main className="min-h-[1280px] mx-auto w-[1080px]">
        <InvestmentPlanView />
        <TableInvest />
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
