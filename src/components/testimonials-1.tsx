import Image from 'next/image'

const testimonials = [
    {
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&h=250&auto=format&fit=crop', // Natural man
        name: 'Tanvir Ahmed',
        role: 'Founder of ShopEase BD',
        quote: 'StackMajix helped us scale our delivery platform during the peak festive season. Their technical support and 24/7 availability were lifesavers for our local business.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&h=250&auto=format&fit=crop', // Professional man
        name: 'David Miller',
        role: 'Tech Lead at RetailHub',
        quote: 'We needed a reliable partner for our cloud transition. They didn\'t just perform the migration; they optimized our entire workflow for performance.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=250&h=250&auto=format&fit=crop', // Normal man
        name: 'James Wilson',
        role: 'Operations Manager',
        quote: 'The software they developed for our inventory tracking has been zero-bug for over 6 months now. It\'s exactly what we needed for our warehouse teams.',
    },
    {
        avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=250&h=250&auto=format&fit=crop', // Close-up man
        name: 'Robert Smith',
        role: 'Software Architect',
        quote: 'Their code quality is cleaner than anything we\'ve seen from other external partners. They follow best practices religiously and it shows in the final product.',
    },
]

export default function Testimonials() {
    return (
        <section className="bg-zinc-50 dark:bg-zinc-950/50 @container py-24 md:py-32 border-t border-zinc-100 dark:border-zinc-900">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center space-y-4">
                    <h2 className="text-balance text-4xl font-semibold md:text-5xl tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">
                        Trusted by Industry Leaders
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto font-outfit">
                        We've collaborated with fa  st-growing startups and established enterprises to build software that moves the needle.
                    </p>
                </div>
                <div className="@xl:grid-cols-2 mt-16 grid gap-6">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 space-y-6 rounded-3xl p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:border-zinc-200 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none hover:-translate-y-1">
                            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-outfit italic">
                                "{testimonial.quote}"
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-zinc-100 dark:border-zinc-800">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        className="object-cover"
                                        fill
                                    />
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-base font-semibold text-zinc-900 dark:text-zinc-50 font-outfit leading-tight">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-500 font-outfit">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
