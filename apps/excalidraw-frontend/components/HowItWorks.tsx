import React from 'react';

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Create your drawing",
            description: "Start with a blank canvas or choose from our templates. Use our intuitive tools to sketch your ideas."
        },
        {
            number: "02",
            title: "Invite your team",
            description: "Share your drawing with team members and collaborators with a simple link."
        },
        {
            number: "03",
            title: "Collaborate in real-time",
            description: "Work together simultaneously, see changes as they happen, and communicate through built-in chat."
        },
        {
            number: "04",
            title: "Export and share",
            description: "Export your finished work in multiple formats or share directly with stakeholders."
        }
    ];

    return (
        <section id="how-it-works" className="bg-gray-50 py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                            How It Works
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                            Our platform makes collaborative drawing simple and intuitive.
                        </p>
                    </div>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            <div className="absolute -left-4 top-0 text-6xl font-bold text-gray-100">
                                {step.number}
                            </div>
                            <div className="relative z-10 space-y-2 pl-2">
                                <h3 className="text-xl font-bold">{step.title}</h3>
                                <p className="text-gray-500">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 flex justify-center">
                    <div className="relative h-[300px] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-lg">
                        {/* This would be where you could add an animation or interactive demo */}
                        <div className="h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDgwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHJlY3Qgd2lkdGg9IjgwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IndoaXRlIi8+CiAgPHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjgwMCIgaGVpZ2h0PSI0MCIgZmlsbD0iI2YxZjVmOSIvPgogIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIyMDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWY5Ii8+CiAgPGNpcmNsZSBjeD0iNDAwIiBjeT0iMTUwIiByPSI4MCIgc3Ryb2tlPSIjM0Q3RENBIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cmVjdCB4PSI1MDAiIHk9IjEwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHN0cm9rZT0iI0ZGRDE2NiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgPGxpbmUgeDE9IjQ4MCIgeTE9IjE1MCIgeDI9IjUwMCIgeTI9IjE1MCIgc3Ryb2tlPSIjM0Q3RENBIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8Y2lyY2xlIGN4PSI2NTAiIGN5PSI4MCIgcj0iMzAiIHN0cm9rZT0iIzNEN0RDQSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSJyZ2JhKDYxLCAxMjUsIDIwMiwgMC4yKSIvPgogIDx0ZXh0IHg9IjIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzNEN0RDQSI+Q29sbGFib3JhdGUgaW4gcmVhbC10aW1lPC90ZXh0PgogIDx0ZXh0IHg9IjQwIiB5PSI4MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjM0Q3RENBIj5Ub29sczwvdGV4dD4KICA8dGV4dCB4PSI0MCIgeT0iMTIwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzRDdEQ0EiPlNoYXBlczwvdGV4dD4KICA8dGV4dCB4PSI0MCIgeT0iMTYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiMzRDdEQ0EiPkxpbmVzPC90ZXh0PgogIDx0ZXh0IHg9IjQwIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzNEN0RDQSI+VGV4dDwvdGV4dD4KPC9zdmc+')] shadow-inner" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;