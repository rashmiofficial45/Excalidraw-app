"use client"
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <div className="text-xl font-bold text-brand-500">Excalidraw</div>
                </div>

                <div className="hidden md:flex items-center gap-6">
                    <a href="#features" className="text-sm font-medium hover:text-brand-500">Features</a>
                    <a href="#how-it-works" className="text-sm font-medium hover:text-brand-500">How It Works</a>
                    <a href="#testimonials" className="text-sm font-medium hover:text-brand-500">Testimonials</a>
                    <a href="#pricing" className="text-sm font-medium hover:text-brand-500">Pricing</a>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href={"/signin"}>
                        <Button variant="outline" className="text-sm">Sign In</Button>
                    </Link>
                    <Link href={"/signup"}>
                        <Button className="bg-gray-500 hover:bg-gray-600">Try Now</Button>
                    </Link>
                </div>

                <button
                    className="md:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden absolute w-full bg-white border-b border-gray-200">
                    <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
                        <a href="#features" className="text-sm font-medium hover:text-brand-500 py-2">Features</a>
                        <a href="#how-it-works" className="text-sm font-medium hover:text-brand-500 py-2">How It Works</a>
                        <a href="#testimonials" className="text-sm font-medium hover:text-brand-500 py-2">Testimonials</a>
                        <a href="#pricing" className="text-sm font-medium hover:text-brand-500 py-2">Pricing</a>
                        <div className="flex flex-col gap-2 pt-2">
                            <Link href={"/signin"}>
                                <Button variant="ghost" className="text-sm">Sign In</Button>
                            </Link>
                            <Link href={"/signup"}>
                                <Button className="bg-gray-500 hover:bg-gray-600">Try Now</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;