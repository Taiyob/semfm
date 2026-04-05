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
} from 'react-icons/si';
import { FaAws } from 'react-icons/fa';
import { Smartphone, Wallet, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const INTEGRATIONS = [
  {
    name: 'OpenAI (GPT-4)',
    description: 'Cutting-edge AI automation and reasoning.',
    icon: <SiOpenai className="text-zinc-950 dark:text-white" />,
  },
  {
    name: 'Claude (Anthropic)',
    description: 'Enterprise-grade intelligence with safety-first AI.',
    icon: <SiAnthropic className="text-orange-600" />,
  },
  {
    name: 'AWS Infrastructure',
    description: 'Highly scalable and secure cloud deployment solutions.',
    icon: <FaAws className="text-orange-500" />,
  },
  {
    name: 'Stripe Payments',
    description: 'The standard for global, PCI-compliant payment flows.',
    icon: <SiStripe className="text-indigo-600" />,
  },
  {
    name: 'bKash (MFS)',
    description: 'Native integration for Bangladesh\'s leading MFS provider.',
    icon: <Smartphone className="text-pink-600" />,
  },
  {
    name: 'Nagad (Digital Wallet)',
    description: 'Secure digital financial service for localized payments.',
    icon: <Wallet className="text-orange-600" />,
  },
  {
    name: 'SSLCommerz',
    description: 'Regional payment aggregator for localized gateways.',
    icon: <ShieldCheck className="text-blue-600" />,
  },
  {
    name: 'Docker & Kubernetes',
    description: 'Enterprise containerization for consistent deployment.',
    icon: <SiDocker className="text-blue-500" />,
  },
  {
    name: 'Supabase & Prisma',
    description: 'Optimized backend-as-a-service and data modelling.',
    icon: <SiSupabase className="text-emerald-500" />,
  },
  {
    name: 'GitHub Enterprise',
    description: 'Advanced source control and CI/CD automation.',
    icon: <SiGithub className="text-zinc-950 dark:text-white" />,
  },
  {
    name: 'Slack & Discord',
    description: 'Automated notification systems for team collaboration.',
    icon: <SiSlack className="text-purple-600" />,
  },
  {
    name: 'Cloudflare',
    description: 'Global security, performance, and DDoS protection.',
    icon: <SiCloudflare className="text-orange-500" />,
  },
];

export default function IntegrationsSection() {
  return (
    <section className="bg-white dark:bg-zinc-950 py-24 md:py-32 border-t border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold md:text-5xl tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
              Powering Your Business with World-Class Technology
            </h2>
            <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-400">
              We integrate with the most trusted platforms in the industry to build robust, secure, and future-proof software solutions for your enterprise.
            </p>
          </div>
          <Button variant="outline" size="lg" className="rounded-full shadow-sm hover:scale-105 transition-transform duration-200">
            Explore All Integrations
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {INTEGRATIONS.map((integration, index) => (
            <IntegrationCard key={index} {...integration} />
          ))}
        </div>
      </div>
    </section>
  );
}

const IntegrationCard = ({ name, description, icon }: { name: string; description: string; icon: React.ReactNode }) => {
  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-md border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="bg-zinc-50 dark:bg-zinc-800 p-2.5 rounded-lg border border-zinc-100 dark:border-zinc-700 transition-colors group-hover:bg-zinc-100 dark:group-hover:bg-zinc-750">
          <div className="size-6 *:size-full">{icon}</div>
        </div>
        <ArrowUpRight className="size-4 text-zinc-400 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </CardHeader>
      <CardContent className="pt-4">
        <h3 className="font-medium text-zinc-900 dark:text-zinc-50 tracking-tight">{name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
