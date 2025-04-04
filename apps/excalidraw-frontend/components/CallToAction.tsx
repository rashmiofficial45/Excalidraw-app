import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

const CallToAction = () => {
    return (
        <section className="bg-gray-900 text-white py-16">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Ready to Start Creating?
                    </h2>
                    <p className="mt-4 text-xl text-gray-300 max-w-xl">
                        Join thousands of teams who are already using our platform to bring their ideas to life.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row gap-4">
                        <Button className="cursor-pointer bg-brand-500 hover:bg-brand-600 text-white">
                            Get Started for Free <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" className="cursor-pointer bg-slate-700 border-white text-white hover:bg-white/10 hover:text-zinc-200">
                            Schedule a Demo
                        </Button>
                    </div>
                    <p className="mt-6 text-sm text-gray-400">
                        No credit card required. Cancel anytime.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CallToAction;