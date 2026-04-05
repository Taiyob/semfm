import Image from 'next/image';

export default function Stats() {
  return (
    <section className="bg-white dark:bg-zinc-950 @container pt-10 md:pt-16 border-t border-zinc-100 dark:border-zinc-900">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <div className="space-y-6">
          <h2 className="text-balance text-4xl font-semibold md:text-5xl tracking-tight text-zinc-900 dark:text-zinc-50 font-outfit">
            Building Modern Software for Your Success
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed max-w-2xl mx-auto">
            We help companies grow by creating reliable, easy-to-use digital
            products that solve real business problems.
          </p>
        </div>
        <div className="@xl:grid-cols-3 mt-16 grid gap-12 text-sm">
          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-8">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              <span className="text-zinc-950 dark:text-zinc-50 font-semibold block text-3xl mb-1">
                50+
              </span>{' '}
              Projects completed and delivered.
            </p>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-8">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              <span className="text-zinc-950 dark:text-zinc-50 font-semibold block text-3xl mb-1">
                15+
              </span>{' '}
              Happy clients from around the world.
            </p>
          </div>

          <div className="border-t border-zinc-100 dark:border-zinc-900 pt-8">
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              <span className="text-zinc-950 dark:text-zinc-50 font-semibold block text-3xl mb-1">
                Top Rated
              </span>{' '}
              Trusted by our partners daily.
            </p>
          </div>
        </div>
      </div>
      <div className="mask-radial-from-65% mask-radial-at-bottom mask-radial-[50%_100%] relative mx-auto max-w-5xl mt-16 dark:opacity-30 overflow-hidden">
        <div className="bg-zinc-500/10 absolute inset-0 z-10 mix-blend-overlay pointer-events-none" />
        <Image
          src="https://images.unsplash.com/photo-1723307060937-b003478a2c03?q=80&w=2928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="global technology map representation"
          className="dark:invert grayscale transition-all duration-700 hover:grayscale-0 hover:scale-[1.03] hover:brightness-110 cursor-crosshair"
          width={2928}
          height={1464}
        />
      </div>
    </section>
  );
}
