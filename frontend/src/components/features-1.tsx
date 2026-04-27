import {Card, CardContent, CardHeader} from '@/components/ui/card';
import {Code, Server, Sparkles, Cloud, Database, Layout} from 'lucide-react';
import {ReactNode} from 'react';

const SERVICES = [
  {
    title: 'UI/UX Design',
    description:
      'Designing intuitively beautiful and responsive user interfaces with Tailwind CSS that prioritize user engagement.',
    icon: Layout,
  },
  {
    title: 'Modern Web Development',
    description:
      'High-performance, SEO-optimized web applications built with React and Next.js for a seamless user experience.',
    icon: Code,
  },
  {
    title: 'Scalable Backend Systems',
    description:
      'Secure and reliable server-side logic using Node.js, NestJS, and Laravel to power your complex business processes.',
    icon: Server,
  },
  {
    title: 'AI-Driven Applications',
    description:
      'Elevating your business with custom AI integrations, leveraging OpenAI and modern LLMs to automate and innovate.',
    icon: Sparkles,
  },
  {
    title: 'Cloud & DevOps',
    description:
      'Optimizing deployments with AWS and Docker for maximum scalability, reliability, and security of your digital infrastructure.',
    icon: Cloud,
  },
  {
    title: 'Database Management',
    description:
      'Efficient data modelling and management using Prisma, MongoDB, and MySQL to ensure your data stays organized and secure.',
    icon: Database,
  },
];

export default function Features() {
  return (
    <section className="bg-zinc-50 py-16 md:py-32 dark:bg-transparent">
      <div className="@container mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-balance text-4xl font-semibold lg:text-5xl">
            Our Services
          </h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 text-lg">
            From ideation to deployment, we build high-performance, scalable web
            applications that drive your business forward.
          </p>
        </div>
        <div className="@min-4xl:grid-cols-3 mx-auto mt-8 grid gap-6 *:text-center md:mt-16">
          {SERVICES.map((service, index) => (
            <Card
              key={index}
              className="group shadow-zinc-950/5 transition-all duration-300 hover:shadow-2xl hover:shadow-zinc-200/50 dark:hover:shadow-none hover:-translate-y-1 hover:border-zinc-200 dark:hover:border-zinc-800 border border-transparent">
              <CardHeader className="pb-3">
                <CardDecorator>
                  <service.icon className="size-6" aria-hidden />
                </CardDecorator>
                <h3 className="mt-6 text-2xl font-medium">{service.title}</h3>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({children}: {children: ReactNode}) => (
  <div className="mask-radial-from-40% mask-radial-to-60% relative mx-auto size-36 duration-200 [--color-border:color-mix(in_oklab,var(--color-zinc-950)10%,transparent)] group-hover:[--color-border:color-mix(in_oklab,var(--color-zinc-950)20%,transparent)] dark:[--color-border:color-mix(in_oklab,var(--color-white)15%,transparent)] dark:group-hover:[--color-border:color-mix(in_oklab,var(--color-white)20%,transparent)]">
    <div
      aria-hidden
      className="absolute inset-0 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] bg-size-[24px_24px] dark:opacity-50"
    />

    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-l border-t">
      {children}
    </div>
  </div>
);
