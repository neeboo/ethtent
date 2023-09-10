import React from 'react'
import NextLink from 'next/link'

const Header: React.FC = () => {
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
                    <button className='bg-black text-white w-40 h-10 rounded-2xl'>connect</button>
                </div>
            </nav>
        </header>
    )
}

export default Header
