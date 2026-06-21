'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import {
  Target,
  Shield,
  Search,
  Calculator,
  Users,
  Eye,
  CheckCircle2,
  Leaf,
  BarChart,
  Building2
} from 'lucide-react';

export default function OurMissionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9F7F4] font-montserrat pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6 w-full">
        
        {/* Top Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-[#D4A373] text-xs font-black uppercase tracking-widest">Our Mission</div>
            <h1 className="text-5xl md:text-6xl font-black text-[#2C3E50] leading-[1.1] tracking-tight">
              Building a more transparent future for real estate investing
            </h1>
            <div className="flex gap-6 items-start">
              <div className="size-14 rounded-full bg-[#FDF8F3] border border-[#D4A373]/30 flex items-center justify-center shrink-0 mt-1">
                <Target className="size-6 text-[#D4A373] stroke-[1.5]" />
              </div>
              <p className="text-lg text-[#2C3E50] font-medium leading-relaxed max-w-xl">
                <span className="font-bold">Hofman Horizon</span> exists to make real estate investments more <span className="text-[#D4A373] font-bold">transparent</span> for investors by building a trusted platform where <span className="text-[#D4A373] font-bold">data, opportunities</span>, and <span className="text-[#D4A373] font-bold">people</span> come together to make better investment decisions.
              </p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative h-[450px] bg-[#F9F7F4] rounded-[32px] overflow-hidden flex items-center justify-center p-8"
          >
            {/* Background Image with sepia/fade overlay */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-80"
              style={{ 
                backgroundImage: 'url(https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80)',
                filter: 'sepia(0.6) contrast(0.9) brightness(1.1)'
              }} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F9F7F4]/20 via-[#F9F7F4]/70 to-[#FDF8F3]" />
            
            {/* Connecting graphics */}
            <div className="relative z-10 w-full h-full">
              {/* Arc Path */}
              <div className="absolute top-[18%] bottom-[18%] right-[25%] w-[55%] border-y border-r border-[#D4A373] border-dashed rounded-r-[200px] opacity-40" />
              
              {/* Data Node */}
              <div className="absolute top-[12%] right-[45%] flex flex-col items-center gap-2 translate-x-1/2">
                <div className="size-16 rounded-full bg-[#FDF8F3] border border-[#D4A373]/40 shadow-sm flex items-center justify-center text-[#D4A373]">
                  <BarChart className="size-7 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest">Data</span>
              </div>

              {/* Opportunities Node */}
              <div className="absolute top-1/2 right-[20%] flex flex-col items-center gap-2 translate-x-1/2 -translate-y-1/2">
                <div className="size-16 rounded-full bg-[#FDF8F3] border border-[#D4A373]/40 shadow-sm flex items-center justify-center text-[#D4A373]">
                  <Building2 className="size-7 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest">Opportunities</span>
              </div>

              {/* People Node */}
              <div className="absolute bottom-[12%] right-[45%] flex flex-col items-center gap-2 translate-x-1/2">
                <div className="size-16 rounded-full bg-[#FDF8F3] border border-[#D4A373]/40 shadow-sm flex items-center justify-center text-[#D4A373]">
                  <Users className="size-7 stroke-[1.5]" />
                </div>
                <span className="text-[10px] font-black text-[#2C3E50] uppercase tracking-widest">People</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Quote Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FDF8F3] rounded-[32px] p-10 flex items-center justify-center mb-24 max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-10">
            <Shield className="size-[72px] text-[#D4A373] shrink-0 stroke-[1.2]" />
            <h3 className="text-2xl md:text-[28px] font-black text-[#2C3E50] leading-snug flex text-center md:text-left relative pt-2 md:pt-0">
              <span className="text-[#D4A373] text-6xl absolute -left-12 -top-4 leading-none font-serif hidden md:block">“</span>
              <span>We believe real estate investing should be built on <span className="text-[#D4A373]">transparency</span>, not sales pitches.</span>
            </h3>
          </div>
        </motion.div>

        {/* Story, Solution, Mission List */}
        <div className="max-w-4xl mx-auto mb-24">
          {[
            {
              id: 'story',
              title: 'Our story',
              icon: Search,
              desc: 'When we started looking for a second investment property ourselves, we quickly discovered how difficult it was to find reliable, unbiased information. Opportunities were scattered across different platforms, projected returns often lacked context, and comparing investments accurately was nearly impossible. Too often, the information available was influenced by commercial interests rather than the investor\'s best interests. We felt lost and did not have confidence in the numbers.'
            },
            {
              id: 'solution',
              title: 'Our solution',
              icon: Calculator,
              desc: 'That\'s why we created Hofman Horizon. Our platform brings promising investment opportunities together in one place and provides investors with the tools and data needed to evaluate them objectively. We combined all this in one calculator. Using our custom-built analysis engine, we go beyond headline returns by incorporating acquisition costs, financing, taxes, vacancy risks, operating expenses, and other key factors that impact performance.'
            },
            {
              id: 'mission',
              title: 'Our mission',
              icon: Users,
              desc: 'Our mission is to create a trusted environment where investors can discover opportunities, understand the numbers behind them, and make informed decisions with confidence. Ultimately, we envision Hofman Horizon as more than a platform — we are building a trusted community where investors, developers, brokers, and industry professionals connect, share knowledge, discover opportunities, and shape the future of transparent real estate investing together.'
            }
          ].map((item, idx, arr) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`flex flex-col sm:flex-row gap-8 items-start py-10 ${idx !== arr.length - 1 ? 'border-b border-[#D4A373]/20' : ''}`}
            >
              <div className="size-[88px] rounded-[24px] bg-white flex items-center justify-center shrink-0 border border-[#D4A373]/30 shadow-sm">
                <item.icon className="size-10 text-[#D4A373] stroke-[1.2]" />
              </div>
              <div className="space-y-3 pt-2">
                <h3 className="text-2xl font-black text-[#2C3E50]">{item.title}</h3>
                <p className="text-[#2C3E50] font-medium leading-relaxed text-[15px]">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Core Values Footer */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#FDF8F3] rounded-[32px] p-8 md:p-12"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { title: 'Independence', desc: 'We are committed to independence and always put investors first.', icon: Shield },
              { title: 'Transparency', desc: 'We believe in clear, honest data and showing the full picture behind every deal.', icon: Eye },
              { title: 'Accuracy', desc: 'We deliver reliable, context-rich analysis you can trust to make better decisions.', icon: CheckCircle2 },
              { title: 'Sustainable value', desc: 'We help investors focus on what truly matters: sustainable returns and long-term value.', icon: Leaf }
            ].map((value, idx) => (
              <div key={idx} className="flex flex-col items-center text-center gap-4">
                <div className="size-[60px] rounded-full bg-transparent flex items-center justify-center border border-[#D4A373]/30 text-[#D4A373]">
                  <value.icon className="size-7 stroke-[1.2]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-black text-[#2C3E50]">{value.title}</h4>
                  <p className="text-xs text-[#2C3E50] font-medium leading-relaxed">
                    {value.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
