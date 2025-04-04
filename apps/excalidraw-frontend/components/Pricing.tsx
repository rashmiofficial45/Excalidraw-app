import React from 'react';
import { Check } from 'lucide-react';
import { Button } from './ui/button';

const Pricing = () => {
    const plans = [
        {
            name: "Free",
            price: "$0",
            description: "Perfect for individual users and casual use",
            features: [
                "Unlimited public drawings",
                "Basic drawing tools",
                "PNG exports",
                "Up to 3 collaborators"
            ],
            buttonText: "Start for Free",
            buttonVariant: "outline"
        },
        {
            name: "Pro",
            price: "$12",
            period: "/month per user",
            description: "For professionals and small teams",
            features: [
                "Unlimited private drawings",
                "Advanced drawing tools",
                "All export formats",
                "Up to 10 collaborators",
                "Version history",
                "Template library"
            ],
            buttonText: "Start Pro Trial",
            buttonVariant: "default",
            highlighted: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "For organizations with advanced needs",
            features: [
                "Everything in Pro",
                "Unlimited collaborators",
                "SSO authentication",
                "Dedicated support",
                "Advanced security features",
                "Custom integrations"
            ],
            buttonText: "Contact Sales",
            buttonVariant: "outline"
        }
    ];

    return (
        <section id="pricing" className="bg-gray-50 py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                            Choose the plan that works best for you and your team.
                        </p>
                    </div>
                </div>

                <div className="mt-12 grid gap-6 lg:grid-cols-3">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`rounded-xl border ${plan.highlighted ? 'border-brand-500 bg-white shadow-lg' : 'bg-white'} p-6`}
                        >
                            {plan.highlighted && (
                                <div className="mb-4 rounded-full bg-brand-50 py-1 px-3 text-xs font-semibold text-brand-600 inline-block">
                                    Most Popular
                                </div>
                            )}
                            <h3 className="text-2xl font-bold">{plan.name}</h3>
                            <div className="mt-2 mb-4">
                                <span className="text-3xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-gray-500">{plan.period}</span>}
                            </div>
                            <p className="text-gray-500 mb-6">{plan.description}</p>
                            <Button
                                variant={plan.buttonVariant as "default" | "outline"}
                                className={`w-full ${plan.highlighted ? 'bg-gray-500 hover:bg-gray-600' : ''}`}
                            >
                                {plan.buttonText}
                            </Button>
                            <ul className="mt-6 space-y-2">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center">
                                        <Check className="mr-2 h-4 w-4 text-brand-500" />
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center text-gray-500">
                    All plans include basic support. Need something special? <a href="#" className="text-brand-500 underline">Contact us</a>.
                </div>
            </div>
        </section>
    );
};

export default Pricing;