'use client';
import React from 'react';
import NextLink from 'next/link';
import { SignIdentity } from '@dfinity/agent';

const Header = ({
  onConnect,
  loading,
  buttonText,
  isSignedIn = false,
  logout,
}: {
  onConnect: () => Promise<void | SignIdentity>;
  loading: boolean;
  buttonText?: string;
  isSignedIn: boolean;
  logout: () => Promise<void>;
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

export default Header;
