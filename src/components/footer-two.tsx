import { Logo } from '@/components/logo'
import Link from 'next/link'

const links = [
    {
        group: 'Services',
        items: [
            {
                title: 'Web Development',
                href: '#features',
            },
            {
                title: 'Mobile Applications',
                href: '#features',
            },
            {
                title: 'Cloud Solutions',
                href: '#features',
            },
            {
                title: 'System Architecture',
                href: '#solution',
            },
        ],
    },
    {
        group: 'Company',
        items: [
            {
                title: 'Our Features',
                href: '#features',
            },
            {
                title: 'Development Process',
                href: '#solution',
            },
            {
                title: 'Success Stories',
                href: '#stats',
            },
            {
                title: 'About Us',
                href: '#about',
            },
        ],
    },
    {
        group: 'Legal',
        items: [
            {
                title: 'Privacy Policy',
                href: '',
            },
            {
                title: 'Terms of Service',
                href: '',
            },
            {
                title: 'Cookie Policy',
                href: '',
            },
        ],
    },
]

export default function FooterSection() {
    return (
        <footer className="bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-100 dark:border-zinc-900 pt-24 pb-12">
            <div className="mx-auto max-w-7xl px-6">
                <div className="grid gap-16 md:grid-cols-2 lg:grid-cols-5">
                    <div className="lg:col-span-2 space-y-8">
                        <Link
                            href="/"
                            aria-label="go home"
                            className="block size-fit">
                            <Logo />
                        </Link>
                        <p className="text-zinc-600 dark:text-zinc-400 max-w-sm text-lg leading-relaxed font-outfit">
                            We build high-performance software solutions that help modern businesses scale and succeed in a digital-first world.
                        </p>
                    </div>

                    <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-12">
                        {links.map((link, index) => (
                            <div
                                key={index}
                                className="space-y-6">
                                <span className="block font-semibold text-zinc-900 dark:text-zinc-100 text-base font-outfit tracking-tight">{link.group}</span>
                                <ul className="space-y-4">
                                    {link.items.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 block transition-colors duration-200 text-sm">
                                                {item.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-24 pt-8 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-zinc-200 dark:border-zinc-800">
                    <span className="text-zinc-500 dark:text-zinc-400 text-sm font-outfit">
                        © {new Date().getFullYear()} StackMajix. All rights reserved.
                    </span>
                    <div className="flex items-center gap-8">
                        <Link
                            href=""
                            // target="_blank"
                            rel="noopener noreferrer"
                            aria-label="GitHub"
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.3 6.84 9.63.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.33 1.08 2.9 0.83.09-.64.35-1.08.63-1.33-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33s1.7.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.64.71 1.03 1.61 1.03 2.71 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 22 12 10 10 0 0 0 12 2z" /></svg>
                        </Link>
                        <Link
                            href=""
                            // target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37z" /></svg>
                        </Link>
                        <Link
                            href=""
                            // target="_blank"
                            rel="noopener noreferrer"
                            aria-label="X (Twitter)"
                            className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                            <svg className="size-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
