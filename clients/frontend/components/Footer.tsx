'use client';
import React from 'react';
import NextLink from 'next/link';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-500 py-4">
      <nav className="container mx-auto flex justify-center items-center text-white">
        <div className="w-max flex justify-between">
          <h1 className="font-bold text-xl">
            <NextLink href="/" className="hover:text-gray-300">
              Ethtent
            </NextLink>
          </h1>
          <span className="inline-block mx-4">|</span>
          <h1 className="font-bold text-xl">an intent-centric defi tool for DCA trading</h1>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
