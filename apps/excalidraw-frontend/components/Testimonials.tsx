import React from 'react';
import { Star } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            quote: "This tool has completely transformed how our design team collaborates. The real-time features are game-changing.",
            author: "Sarah Johnson",
            role: "Design Director, Acme Inc.",
            avatar: "https://i.pravatar.cc/100?img=1",
            stars: 5
        },
        {
            quote: "We've tried many drawing tools, but this one strikes the perfect balance between simplicity and power.",
            author: "Michael Chen",
            role: "Product Manager, TechCorp",
            avatar: "https://i.pravatar.cc/100?img=3",
            stars: 5
        },
        {
            quote: "The export options and sharing features have made client presentations so much smoother. Highly recommend!",
            author: "Elena Rodriguez",
            role: "UX Consultant",
            avatar: "https://i.pravatar.cc/100?img=5",
            stars: 4
        }
    ];

    return (
        <section id="testimonials" className="bg-white py-12 md:py-24">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl gradient-text">
                            What Our Users Say
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed">
                            Join thousands of satisfied teams already using our platform.
                        </p>
                    </div>
                </div>

                <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div key={index} className="testimonial-card">
                            <div className="flex mb-4">
                                {[...Array(testimonial.stars)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-current text-amber-400" />
                                ))}
                                {[...Array(5 - testimonial.stars)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 text-gray-200" />
                                ))}
                            </div>
                            <blockquote className="mb-4">
                                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
                            </blockquote>
                            <div className="flex items-center">
                                <div className="mr-4">
                                    <img
                                        src={testimonial.avatar}
                                        alt={testimonial.author}
                                        className="h-10 w-10 rounded-full object-cover"
                                    />
                                </div>
                                <div>
                                    <p className="font-semibold">{testimonial.author}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <div className="bg-gray-100 rounded-xl p-8 max-w-2xl text-center">
                        <p className="text-xl font-medium">
                            Join 10,000+ users and teams already using our platform
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;