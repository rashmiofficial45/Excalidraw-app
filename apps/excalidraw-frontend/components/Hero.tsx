import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const Hero = () => {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-white to-blue-50">
            <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                    <div className="flex flex-col justify-center space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none gradient-text">
                                Draw Together. Collaborate Seamlessly.
                            </h1>
                            <p className="max-w-[600px] text-gray-500 md:text-xl">
                                Create beautiful sketches, diagrams, and wireframes with our intuitive drawing platform.
                                Collaborate in real-time with your team, anywhere, anytime.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Button className="bg-gray-500 hover:bg-gray-600">
                                Start Drawing <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                            <Button variant="outline">See Examples</Button>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <CheckIcon className="h-4 w-4 text-brand-500" />
                                <span>Free tier available</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <CheckIcon className="h-4 w-4 text-brand-500" />
                                <span>No credit card required</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center justify-center">
                        <div className="h-[350px] w-[450px] overflow-hidden rounded-xl bg-white shadow-xl animate-float">
                            <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjM1MCIgdmlld0JveD0iMCAwIDUwMCAzNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjUwMCIgaGVpZ2h0PSIzNTAiIGZpbGw9IndoaXRlIi8+CiAgPGNpcmNsZSBjeD0iMTAwIiBjeT0iMTAwIiByPSI1MCIgc3Ryb2tlPSIjM0Q3RENBIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cmVjdCB4PSIyMDAiIHk9IjUwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgc3Ryb2tlPSIjRkZEMTY2IiBzdHJva2Utd2lkdGg9IjIiLz4KICA8bGluZSB4MT0iMTUwIiB5MT0iMTAwIiB4Mj0iMjAwIiB5Mj0iMTAwIiBzdHJva2U9IiMzRDdEQ0EiIHN0cm9rZS13aWR0aD0iMiIvPgogIDxsaW5lIHgxPSIxMDAiIHkxPSIyMDAiIHgyPSIzMDAiIHkyPSIyNTAiIHN0cm9rZT0iIzNEN0RDQSIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGNpcmNsZSBjeD0iMzAwIiBjeT0iMjUwIiByPSI1MCIgc3Ryb2tlPSIjRkZEMTY2IiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9InJnYmEoMjU1LCAyMDksIDEwMiwgMC4yKSIvPgogIDx0ZXh0IHg9IjM4MCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzRDdEQ0EiPlByb3RvdHlwZTwvdGV4dD4KICA8dGV4dCB4PSIzODAiIHk9IjE0MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjM0Q3RENBIj5EaWFncmFtczwvdGV4dD4KICA8dGV4dCB4PSIzODAiIHk9IjE2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjM0Q3RENBIj5XaXJlZnJhbWVzPC90ZXh0Pgo8L3N2Zz4=')]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// Simple check icon component
const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
    );
};

export default Hero;