'use client';
import Link from 'next/link';
import {Logo} from '@/components/logo';
import {Menu, X} from 'lucide-react';
import React from 'react';
import {useScroll, motion} from 'motion/react';
import {cn} from '@/lib/utils';

const menuItems = [
  {name: 'Features', href: '#features'},
  {name: 'Solution', href: '#solution'},
  {name: 'Stats', href: '#stats'},
  {name: 'About', href: '#about'},
];

export const HeroHeader = () => {
  const [menuState, setMenuState] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const {scrollYProgress} = useScroll();

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header>
      <nav
        data-state={menuState && 'active'}
        className="fixed z-20 w-full pt-2">
        <div
          className={cn(
            'mx-auto max-w-7xl rounded-full px-6 transition-all duration-300 lg:px-12',
            scrolled &&
              'bg-background/50 backdrop-blur-2xl border border-white/10 shadow-lg',
          )}>
          <motion.div
            key={1}
            className={cn(
              'flex items-center justify-between py-3 duration-200 lg:py-6',
              scrolled && 'lg:py-4',
            )}>
            <div className="flex items-center">
              <Link
                href="/"
                aria-label="home"
                className="flex items-center space-x-2 shrink-0">
                <Logo />
              </Link>
            </div>

            {/* Desktop Navigation - Hidden on Mobile */}
            <div className="hidden lg:flex items-center">
              <ul className="flex gap-12 text-sm font-medium">
                {menuItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors duration-200 text-lg">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mobile Menu Button - Hidden on Desktop */}
            <div className="flex lg:hidden">
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -mr-2 p-2 focus:outline-none">
                <Menu
                  className={cn(
                    'size-6 transition-all duration-300',
                    menuState
                      ? 'scale-0 opacity-0 rotate-90'
                      : 'scale-100 opacity-100 rotate-0',
                  )}
                />
                <X
                  className={cn(
                    'absolute inset-0 m-auto size-6 transition-all duration-300',
                    menuState
                      ? 'scale-100 opacity-100 rotate-0'
                      : 'scale-0 opacity-0 -rotate-90',
                  )}
                />
              </button>
            </div>
          </motion.div>

          {/* Mobile Navigation Dropdown */}
          <motion.div
            initial={false}
            animate={
              menuState ? {height: 'auto', opacity: 1} : {height: 0, opacity: 0}
            }
            className="lg:hidden overflow-hidden bg-background rounded-3xl mb-4 px-2">
            <ul className="space-y-4 pb-8 pt-4">
              {menuItems.map((item, index) => (
                <li key={index} className="px-4">
                  <Link
                    href={item.href}
                    onClick={() => setMenuState(false)}
                    className="text-lg font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 block py-2 border-b border-zinc-100 dark:border-zinc-800 last:border-none">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </nav>
    </header>
  );
};
