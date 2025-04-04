import React from 'react';
import {
    Users,
    Pencil,
    Share2,
    Download,
    CloudLightning,
    Layers
} from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: <Pencil className="h-10 w-10 text-brand-500" />,
            title: "Intuitive Drawing Tools",
            description: "Simple yet powerful drawing tools that make creating sketches and diagrams effortless."
        },
        {
            icon: <Users className="h-10 w-10 text-brand-500" />,
            title: "Real-time Collaboration",
            description: "Work together with your team in real-time, seeing changes as they happen."
        },
        {
            icon: <Share2 className="h-10 w-10 text-brand-500" />,
            title: "Easy Sharing",
            description: "Share your drawings with anyone via a simple link, with customizable permissions."
        },
        {
            icon: <Download className="h-10 w-10 text-brand-500" />,
            title: "Export Options",
            description: "Export your work in multiple formats including PNG, SVG, and PDF."
        },
        {
            icon: <CloudLightning className="h-10 w-10 text-brand-500" />,
            title: "Cloud Saving",
            description: "Your work is automatically saved to the cloud, accessible from any device."
        },
        {
            icon: <Layers className="h-10 w-10 text-brand-500" />,
            title: "Smart Objects",
            description: "Create and manipulate smart objects that maintain their properties."
        }
    ];

    return (
        <section id="features" className="bg-white py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                            Powerful Features
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                            Everything you need to create stunning visual content with your team.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
                    {features.map((feature, index) => (
                        <div key={index} className="feature-card">
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold">{feature.title}</h3>
                            <p className="text-gray-500">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;