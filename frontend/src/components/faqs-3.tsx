'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
}

export default function FAQsThree() {
    const faqItems: FAQItem[] = [
        {
            id: 'item-1',
            icon: 'code-2',
            question: 'What types of software services do you provide?',
            answer: 'We specialize in custom web applications, mobile app development (iOS & Android), and backend systems. Whether you need a modern website or a complex business tool, we have the expertise to build it.',
        },
        {
            id: 'item-2',
            icon: 'cpu',
            question: 'What technology stack do you use?',
            answer: 'We primarily work with React, Next.js, and Node.js for high-performance applications. For styling and UI, we use Tailwind CSS, and for database management, we rely on modern solutions like Supabase, PostgreSQL, and MongoDB.',
        },
        {
            id: 'item-3',
            icon: 'calendar',
            question: 'How long does it take to complete a project?',
            answer: 'A typical project can take anywhere from 4 to 12 weeks depending on its size and complexity. We follow an agile process, delivering parts of the software in small phases so you can see progress early and often.',
        },
        {
            id: 'item-4',
            icon: 'message-square',
            question: 'How do we communicate during development?',
            answer: 'Communication is key to our success. We use tools like Slack for daily updates and hold weekly video calls to show you the latest progress. You will have a dedicated project manager to answer any questions at any time.',
        },
        {
            id: 'item-5',
            icon: 'life-buoy',
            question: 'Do you offer support after the project is finished?',
            answer: 'Yes, we provide ongoing maintenance and support packages to ensure your software stays secure and updated. We are always here to help you add new features or fix any issues as your business grows.',
        },
    ]

    return (
        <section className="bg-muted dark:bg-background py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-10 md:flex-row md:gap-16">
                    <div className="md:w-1/3">
                        <div className="sticky top-20">
                            <h2 className="mt-4 text-3xl font-bold">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground mt-4">
                                Can't find what you're looking for? Contact our{' '}
                                <Link
                                    href="#"
                                    className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="md:w-2/3">
                        <Accordion
                            type="single"
                            collapsible
                            className="w-full space-y-2">
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="bg-background shadow-xs rounded-lg border px-4 last:border-b">
                                    <AccordionTrigger className="cursor-pointer items-center py-5 hover:no-underline">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-6">
                                                <DynamicIcon
                                                    name={item.icon}
                                                    className="m-auto size-4"
                                                />
                                            </div>
                                            <span className="text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-5">
                                        <div className="px-9">
                                            <p className="text-base">{item.answer}</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </section>
    )
}
