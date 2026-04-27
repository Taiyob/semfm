import { Card } from '@/components/ui/card'
import { Shield, Search, Layout, Code2, Rocket } from 'lucide-react'
import { Vercel } from '@/components/ui/svgs/vercel'
import { Supabase } from '@/components/ui/svgs/supabase'
import { Linear } from '@/components/ui/svgs/linear'
import { Slack } from '@/components/ui/svgs/slack'
import { Firebase } from '@/components/ui/svgs/firebase'
import { ClerkIconDark as Clerk } from '@/components/ui/svgs/clerk'

export default function ProcessSection() {
    return (
        <section className="bg-white dark:bg-zinc-950 @container py-24 md:py-32 border-t border-zinc-100 dark:border-zinc-900">
            <div className="mx-auto max-w-4xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-balance text-4xl font-semibold md:text-5xl tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">
                        Our Strategic Development Process
                    </h2>
                    <p className="text-zinc-600 dark:text-zinc-400 mt-6 text-lg leading-relaxed max-w-2xl mx-auto">
                        We don't just write code; we partner with you to understand your business requirements and engineer solutions that scale in the real world.
                    </p>
                </div>
                <div className="@xl:grid-cols-2 mt-12 grid gap-4 *:p-8">
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Search className="size-5 text-zinc-900 dark:text-zinc-100" />
                                <h3 className="text-zinc-900 dark:text-zinc-50 font-semibold tracking-tight text-xl">Discovery & Requirements</h3>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                We begin by deeply understanding your business logic and technical requirements to ensure a solid foundation for the project.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="**:fill-foreground flex h-44 flex-col justify-between pt-8 opacity-60">
                            <div className="relative flex h-10 items-center gap-12 px-6">
                                <div className="bg-zinc-200 dark:bg-zinc-800 absolute inset-0 my-auto h-px"></div>

                                <div className="bg-white dark:bg-zinc-900 shadow-black/5 ring-zinc-200 dark:ring-zinc-800 relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Vercel className="size-3.5" />
                                </div>
                                <div className="bg-white dark:bg-zinc-900 shadow-black/5 ring-zinc-200 dark:ring-zinc-800 relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Slack className="size-3.5" />
                                </div>
                            </div>
                            <div className="pl-17 relative flex h-10 items-center justify-between gap-12 pr-6">
                                <div className="bg-zinc-200 dark:bg-zinc-800 absolute inset-0 my-auto h-px"></div>

                                <div className="bg-white dark:bg-zinc-900 shadow-black/5 ring-zinc-200 dark:ring-zinc-800 relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Clerk className="size-3.5" />
                                </div>
                                <div className="bg-white dark:bg-zinc-900 shadow-black/5 ring-zinc-200 dark:ring-zinc-800 relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Linear className="size-3.5" />
                                </div>
                            </div>
                            <div className="relative flex h-10 items-center gap-20 px-8">
                                <div className="bg-zinc-200 dark:bg-zinc-800 absolute inset-0 my-auto h-px"></div>

                                <div className="bg-white dark:bg-zinc-900 shadow-black/5 ring-zinc-200 dark:ring-zinc-800 relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Supabase className="size-3.5" />
                                </div>
                                <div className="bg-white dark:bg-zinc-900 shadow-black/5 ring-zinc-200 dark:ring-zinc-800 relative flex h-8 items-center rounded-full px-3 shadow-sm ring">
                                    <Firebase className="size-3.5" />
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Layout className="size-5 text-zinc-900 dark:text-zinc-100" />
                                <h3 className="text-zinc-900 dark:text-zinc-50 font-semibold tracking-tight text-xl">Architecture & System Design</h3>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                Our engineers architect high-performance, scalable systems and intuitive UI/UX workflows tailored to your ecosystem.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="relative h-44 translate-y-6 opacity-40">
                            <div className="bg-zinc-900/15 dark:bg-white/15 absolute inset-0 mx-auto w-px"></div>
                            <div className="absolute -inset-x-16 top-6 aspect-square rounded-full border border-zinc-200 dark:border-zinc-800"></div>
                            <div className="border-zinc-900/20 dark:border-white/20 mask-l-from-50% mask-l-to-90% mask-r-from-50% mask-r-to-50% absolute -inset-x-16 top-6 aspect-square rounded-full border"></div>
                            <div className="absolute -inset-x-8 top-24 aspect-square rounded-full border border-zinc-200 dark:border-zinc-800"></div>
                            <div className="mask-r-from-50% mask-r-to-90% mask-l-from-50% mask-l-to-50% absolute -inset-x-8 top-24 aspect-square rounded-full border border-zinc-500/30"></div>
                        </div>
                    </Card>
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid overflow-hidden border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Code2 className="size-5 text-zinc-900 dark:text-zinc-100" />
                                <h3 className="text-zinc-900 dark:text-zinc-50 font-semibold tracking-tight text-xl">Agile Engineering</h3>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                We follow modern agile practices, writing clean, maintainable code with continuous integration and rapid sprint cycles.
                            </p>
                        </div>
                        <div
                            aria-hidden
                            className="*:bg-zinc-900/10 dark:*:bg-white/10 flex h-44 justify-between pb-6 pt-12 *:h-full *:w-px opacity-30">
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-zinc-900/50! dark:bg-white/50!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-zinc-900/50! dark:bg-white/50!" />
                            <div />
                            <div />
                            <div />
                            <div className="bg-zinc-900/50! dark:bg-white/50!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-zinc-900/50! dark:bg-white/50!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-zinc-900/50! dark:bg-white/50!" />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div />
                            <div className="bg-zinc-900/50! dark:bg-white/50!" />
                        </div>
                    </Card>
                    <Card
                        variant="mixed"
                        className="row-span-2 grid grid-rows-subgrid border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-none">
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <Rocket className="size-5 text-zinc-900 dark:text-zinc-100" />
                                <h3 className="text-zinc-900 dark:text-zinc-50 font-semibold tracking-tight text-xl">Real-world Integration</h3>
                            </div>
                            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                                Post-development, we handle the global deployment and seamless integration into your production environment for real-world impact.
                            </p>
                        </div>

                        <div className="pointer-events-none relative -ml-7 flex size-44 items-center justify-center pt-5 opacity-40">
                            <Shield className="absolute inset-0 top-2.5 size-full stroke-[0.1px] text-zinc-900 dark:text-white opacity-15" />
                            <Shield className="size-32 stroke-[0.1px] text-zinc-900 dark:text-white" />
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    )
}
