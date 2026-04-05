import {
  SiOpenai,
  SiAnthropic,
  SiDocker,
  SiStripe,
  SiPaypal,
  SiSupabase,
  SiPrisma,
  SiGithub,
  SiSlack,
  SiCloudflare,
  SiMongodb,
  SiRedis,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiNodedotjs,
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { LogoIcon } from '@/components/logo';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { InfiniteSlider } from '@/components/infinite-slider';

const TECH_ROW_1 = [
  { name: 'OpenAI', icon: <SiOpenai className="text-zinc-900 dark:text-white" /> },
  { name: 'Stripe', icon: <SiStripe className="text-indigo-600" /> },
  { name: 'AWS', icon: <FaAws className="text-orange-500" /> },
  { name: 'GitHub', icon: <SiGithub className="text-zinc-900 dark:text-white" /> },
  { name: 'React', icon: <SiReact className="text-sky-500" /> },
  { name: 'Docker', icon: <SiDocker className="text-blue-500" /> },
];

const TECH_ROW_2 = [
  { name: 'Claude', icon: <SiAnthropic className="text-orange-600" /> },
  { name: 'PayPal', icon: <SiPaypal className="text-blue-700" /> },
  { name: 'Supabase', icon: <SiSupabase className="text-emerald-500" /> },
  { name: 'Next.js', icon: <SiNextdotjs className="text-zinc-900 dark:text-white" /> },
  { name: 'Cloudflare', icon: <SiCloudflare className="text-orange-500" /> },
  { name: 'MongoDB', icon: <SiMongodb className="text-emerald-600" /> },
];

const TECH_ROW_3 = [
  { name: 'Prisma', icon: <SiPrisma className="text-zinc-900 dark:text-white" /> },
  { name: 'Slack', icon: <SiSlack className="text-purple-600" /> },
  { name: 'Redis', icon: <SiRedis className="text-red-600" /> },
  { name: 'Node.js', icon: <SiNodedotjs className="text-green-600" /> },
  { name: 'Tailwind', icon: <SiTailwindcss className="text-sky-400" /> },
  { name: 'OpenAI', icon: <SiOpenai className="text-zinc-900 dark:text-white" /> },
];

export default function IntegrationsSection() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 md:py-32 overflow-hidden border-t border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="bg-muted/10 group relative mx-auto max-w-[22rem] items-center justify-between space-y-6 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md lg:max-w-xl">
          <div
            role="presentation"
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-50"></div>

          <div className="py-4">
            <InfiniteSlider gap={32} speed={25} speedOnHover={15}>
              {TECH_ROW_1.map((item, idx) => (
                <IntegrationCard key={`r1-${idx}`}>{item.icon}</IntegrationCard>
              ))}
            </InfiniteSlider>
          </div>

          <div className="py-4">
            <InfiniteSlider gap={32} speed={30} speedOnHover={15} reverse>
              {TECH_ROW_2.map((item, idx) => (
                <IntegrationCard key={`r2-${idx}`}>{item.icon}</IntegrationCard>
              ))}
            </InfiniteSlider>
          </div>

          <div className="py-4">
            <InfiniteSlider gap={32} speed={20} speedOnHover={15}>
              {TECH_ROW_3.map((item, idx) => (
                <IntegrationCard key={`r3-${idx}`}>{item.icon}</IntegrationCard>
              ))}
            </InfiniteSlider>
          </div>

          <div className="absolute inset-0 m-auto flex size-fit justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-zinc-900/5 dark:bg-white/5 rounded-full blur-2xl animate-pulse" />
              <IntegrationCard
                className="size-20 bg-white/80 dark:bg-zinc-900/80 shadow-2xl backdrop-blur-xl border-zinc-200/50 dark:border-white/10 ring-8 ring-zinc-50 dark:ring-zinc-900/50"
                isCenter={true}>
                <LogoIcon className="size-10" />
              </IntegrationCard>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl space-y-6 text-center">
          <h2 className="text-balance text-4xl font-semibold md:text-5xl tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">
            Seamlessly Integrated Ecosystem
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
            We build and deploy using an industry-leading technical stack, ensuring your software is scalable, secure, and ready for the global market.
          </p>

          {/* <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="rounded-full px-8 shadow-lg shadow-zinc-950/20 dark:shadow-white/5">
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild>
              <Link href="#">View Documentation</Link>
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({ children, className, isCenter = false }: { children: React.ReactNode; className?: string; isCenter?: boolean }) => {
  return (
    <div className={cn(
      'bg-white dark:bg-zinc-900 relative z-20 flex size-14 rounded-full border border-zinc-100 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700',
      className
    )}>
      <div className={cn('m-auto size-fit flex items-center justify-center *:size-6', isCenter && '*:size-10')}>{children}</div>
    </div>
  );
}
