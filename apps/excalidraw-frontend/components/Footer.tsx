import React from 'react';
import { Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="container px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    <div>
                        <h3 className="text-lg font-medium">Excalidraw</h3>
                        <p className="mt-2 text-sm text-gray-500">
                            A virtual collaborative whiteboard for sketching diagrams with ease.
                        </p>
                        <div className="mt-4 flex space-x-4">
                            <a href="#" className="text-gray-500 hover:text-brand-500">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-brand-500">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            <a href="#" className="text-gray-500 hover:text-brand-500">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Product</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                            <li>
                                <a href="#features" className="text-gray-500 hover:text-brand-500">Features</a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-gray-500 hover:text-brand-500">Pricing</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Roadmap</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Templates</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Resources</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Blog</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Tutorials</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Support</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Documentation</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-medium">Company</h3>
                        <ul className="mt-2 space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">About</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Careers</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Privacy</a>
                            </li>
                            <li>
                                <a href="#" className="text-gray-500 hover:text-brand-500">Terms</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-500">
                    <p>
                        © {new Date().getFullYear()} Excalidraw. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;