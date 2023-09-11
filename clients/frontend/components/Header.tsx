'use client';
import React, { forwardRef, useState } from 'react';
import NextLink from 'next/link';
import { SignIdentity } from '@dfinity/agent';
import { useNetwork, useSwitchNetwork } from 'wagmi';
import * as Radix from '@radix-ui/react-select';
import { styled } from '@stitches/react';

const Wrapper = styled('div', {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

const SelTrigger = styled('button', {
  position: 'relative',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  boxSizing: 'border-box',
  background: '#000',
  minWidth: 100,
  padding: 8,
  fontSize: 16,
  fontFamily: 'sans-serif',
  border: '1px solid #1b1b1b',
  borderRadius: 20,
  outline: 'none',
  color: '#fff',
  variants: {
    error: {
      true: {
        borderColor: '#df6c75',
      },
    },
  },
});

const Dropdown = styled('div', {
  position: 'relative',
  boxSizing: 'border-box',
  color: '#fff',
  padding: '16px 8px',
  fontFamily: 'sans-serif',
  fontSize: 16,
  background: '#000',
  border: '1px solid #1b1b1b',
  borderRadius: 4,
  boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px',
  pointerEvents: 'all',
});

const Viewport = styled(Radix.Viewport, {
  display: 'flex',
  flexDirection: 'column',
  rowGap: 8,
});

const Item = styled(Radix.Item, {
  padding: '8px',
  outline: 'none',
  transition: 'background ease 300ms',
  borderRadius: 4,
  '&:focus': {
    background: '#35363a',
  },
});

const Chev = styled('svg', {
  transition: 'transform 300ms',
  variants: {
    direction: {
      up: {
        transform: 'rotate(-90deg)',
        '[data-state=open] > &': { transform: 'rotate(90deg)' },
      },
      down: {
        transform: 'rotate(90deg)',
        '[data-state=open] > &': { transform: 'rotate(-90deg)' },
      },
      left: {
        transform: 'rotate(180deg)',
        '[data-state=open] > &': { transform: 'rotate(0deg)' },
      },
      right: {
        transform: 'rotate(0deg)',
        '[data-state=open] > &': { transform: 'rotate(180deg)' },
      },
    },
  },
  defaultVariants: {
    direction: 'right',
  },
});

const Chevron = forwardRef(({ width = 8, ...props }: ChevronTypes, ref) => (
  <Chev {...ref} viewBox="0 0 8 13" fill="none" style={{ width: width, height: 'auto' }} {...props}>
    <path d="M1.41.815 0 2.225l4.58 4.59L0 11.405l1.41 1.41 6-6-6-6Z" fill="#fff" />
  </Chev>
));

Chevron.displayName = 'Chevron';

type ChevronTypes = {
  direction?: 'up' | 'down' | 'left' | 'right';
  width?: number;
  props?: any;
};

const Header = ({
  onConnect,
  loading,
  buttonText,
  isSignedIn = false,
  logout,
  onSwitchNetwork,
}: {
  onConnect: () => Promise<void | SignIdentity>;
  loading: boolean;
  buttonText?: string;
  isSignedIn: boolean;
  logout: () => Promise<void>;
  onSwitchNetwork?: (e: number) => Promise<void>;
}) => {
  return (
    <header className="bg-blue-500 py-4">
      <nav className="container mx-auto flex justify-between items-center text-white">
        <div className="w-max">
          <h1 className="font-bold text-xl">
            <NextLink href="/" className="hover:text-gray-300">
              Ethtent
            </NextLink>
          </h1>
          <div>
            <NextLink href="/" className="mr-4 hover:text-gray-300">
              Home
            </NextLink>
            <NextLink href="/browse" className="mr-4 hover:text-gray-300">
              Browse
            </NextLink>
            <NextLink href="/aboutus" className="hover:text-gray-300">
              About
            </NextLink>
          </div>
        </div>
        <div className="w-max">
          {isSignedIn ? <ChainSwitcher onSwitchNetwork={onSwitchNetwork} /> : null}
          <button className="bg-black text-white w-40 h-10 rounded-2xl" onClick={onConnect}>
            {loading ? 'Signing In ...' : buttonText ?? 'Connect'}
          </button>
          {isSignedIn ? (
            <span style={{ display: 'inline-block', marginLeft: 16 }}>
              <button className="bg-black text-white w-20 h-10 rounded-2xl" onClick={logout}>
                logout
              </button>
            </span>
          ) : null}
        </div>
      </nav>
    </header>
  );
};

const ChainSwitcher = ({ onSwitchNetwork }: { onSwitchNetwork?: (e: number) => Promise<void> }) => {
  const { chain } = useNetwork();
  const { chains, error, isLoading: switchLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  // const options = chains.map(x => (
  //   <option disabled={!switchNetwork || x.id === chain?.id} key={x.id} value={x.id}>
  //     {`${x.name}` + switchLoading && pendingChainId === x.id && ' (switching)'}
  //   </option>
  // ));
  const [toggled, setToggled] = useState('closed');
  return (
    <div
      style={{
        // background: 'linear-gradient(to right,#a6cad6,#d39c93)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
      }}
    >
      <form style={{ width: '100%', maxWidth: 420 }}>
        <Wrapper>
          <Radix.Root
            dir="ltr"
            // open={true}
            defaultValue={chain ? chain?.id.toString() : '5'}
            onOpenChange={e => {
              setToggled(e === true ? 'open' : 'closed');
            }}
            onValueChange={e => {
              switchNetwork!(Number.parseInt(e));
              onSwitchNetwork!(Number.parseInt(e));
            }}
          >
            <Radix.Trigger asChild data-state={toggled}>
              <SelTrigger error={!!error}>
                <span>
                  <Radix.Value />
                </span>
                <Radix.Icon asChild>
                  <Chevron direction="down" />
                </Radix.Icon>
              </SelTrigger>
            </Radix.Trigger>
            <Radix.Content asChild>
              <Dropdown>
                <Viewport>
                  {chains.map((item, i) => {
                    return (
                      <Item key={i} value={item.id.toString()}>
                        <Radix.ItemText> {item.name} </Radix.ItemText>
                      </Item>
                    );
                  })}
                </Viewport>
              </Dropdown>
            </Radix.Content>
          </Radix.Root>
        </Wrapper>
      </form>
    </div>
  );
};

export default Header;
