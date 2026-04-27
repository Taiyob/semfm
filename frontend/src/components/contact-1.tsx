import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export default function Contact() {
    return (
        <section className="bg-zinc-50 dark:bg-zinc-950/50 @container py-24 md:py-32 border-t border-zinc-100 dark:border-zinc-900">
            <div className="mx-auto max-w-5xl px-6">
                <div className="text-center md:text-left space-y-4">
                    <h2 className="text-balance text-4xl font-semibold md:text-5xl tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">
                        Let's Build Your Vision Together
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl font-outfit">
                        Ready to turn your ideas into a high-performance reality? Reach out today and start your journey towards digital excellence.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-5 mt-16">
                    <div className="lg:col-span-2 space-y-10">
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                    <Mail className="size-5 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-zinc-900 dark:text-zinc-50 text-sm font-semibold font-outfit">Email Us</p>
                                    <Link
                                        href="mailto:stackmajix@gmail.com"
                                        className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block leading-none">
                                        stackmajix@gmail.com
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                    <Phone className="size-5 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-zinc-900 dark:text-zinc-50 text-sm font-semibold font-outfit">Call Us</p>
                                    <Link
                                        href="tel:01307164307"
                                        className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors block leading-none">
                                        01307164307
                                    </Link>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="size-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center">
                                    <MapPin className="size-5 text-zinc-600 dark:text-zinc-400" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-zinc-900 dark:text-zinc-50 text-sm font-semibold font-outfit">Availability</p>
                                    <p className="text-zinc-500 dark:text-zinc-400 leading-none">Global Distributed Team (Remote First)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Card className="lg:col-span-3 p-8 border-zinc-100 dark:border-zinc-900 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm shadow-xl shadow-zinc-200/20 dark:shadow-none">
                        <form action="" className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Name</Label>
                                    <Input
                                        id="name"
                                        placeholder="Enter your name"
                                        className="bg-transparent border-zinc-200 dark:border-zinc-800 focus:ring-zinc-500"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="you@company.com"
                                        className="bg-transparent border-zinc-200 dark:border-zinc-800 focus:ring-zinc-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="subject" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Subject</Label>
                                <Input
                                    id="subject"
                                    placeholder="How can we help you?"
                                    className="bg-transparent border-zinc-200 dark:border-zinc-800 focus:ring-zinc-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Message</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Tell us about your project or inquiry..."
                                    rows={5}
                                    className="bg-transparent border-zinc-200 dark:border-zinc-800 focus:ring-zinc-500 min-h-[120px]"
                                    required
                                />
                            </div>

                            <Button className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 h-12 text-base font-semibold">
                                Send Message
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </section>
    )
}
