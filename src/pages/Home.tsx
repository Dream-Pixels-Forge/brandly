import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Zap, Shield, LayoutGrid } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col gap-0 SwissGridSurface overflow-hidden">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col justify-center relative border-b border-zinc-900">
        <div className="absolute top-12 left-0 w-full flex justify-between px-6 pointer-events-none">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 text-vertical">EST. 2024</span>
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400 text-vertical">NO DESIGN EXPERIENCE NEEDED</span>
        </div>

        <div className="container-max mx-auto px-6 space-y-16">
          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                className="text-[clamp(3rem,15vw,12rem)] font-black tracking-tighter text-zinc-900 leading-[0.82] uppercase"
              >
                Instant <br /> Brand
              </motion.h1>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 pt-8">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="max-w-xl space-y-6"
              >
                <p className="text-xl md:text-2xl text-zinc-900 font-medium leading-tight">
                  Turn your "About Us" text into a complete brand kit. <br />
                  <span className="text-zinc-400 italic font-light">From idea to identity in sixty seconds.</span>
                </p>
                <div className="flex gap-4">
                  <Link to="/generate">
                    <Button size="lg" className="group">
                      Get Started
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                    </Button>
                  </Link>
                  <Link to="/gallery">
                    <Button variant="outline" size="lg">View Gallery</Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="hidden lg:block w-64 h-64 border border-zinc-900 relative group cursor-crosshair"
              >
                <div className="absolute inset-0 bg-zinc-900 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                <div className="absolute inset-0 flex items-center justify-center text-zinc-900 group-hover:text-white transition-colors duration-500 font-bold uppercase tracking-widest text-xs">
                  Start Now
                </div>
                <div className="absolute -top-2 -left-2 w-4 h-4 border-l border-t border-zinc-900" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-r border-b border-zinc-900" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="bg-zinc-900 py-6 overflow-hidden border-y border-zinc-900">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[1,2,3,4].map(i => (
            <div key={i} className="flex gap-12 text-white text-4xl font-black uppercase tracking-tighter">
              <span>Instant_Logos</span>
              <span className="opacity-20">Full_Access</span>
              <span>Vector_Export</span>
              <span className="opacity-20">Modern_Design</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grid Features */}
      <section className="py-24 border-b border-zinc-900 relative">
        <div className="container-max mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                title: "Smart Layouts", 
                desc: "Beautifully aligned designs out of the box. No manual tweaking needed.",
                num: "01"
              },
              { 
                title: "Intelligent Colors", 
                desc: "We analyze your industry and mission to select the perfect color palette.",
                num: "02"
              },
              { 
                title: "Code Ready", 
                desc: "Get instant Tailwind CSS configurations to use in your real projects.",
                num: "03"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="p-12 border-zinc-200 lg:border-r last:border-r-0 border-b lg:border-b-0 space-y-8 group hover:bg-zinc-50 transition-colors duration-500"
              >
                <span className="block text-4xl font-black tracking-tighter text-zinc-200 group-hover:text-zinc-900 transition-colors duration-500">{item.num}</span>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold uppercase tracking-tight">{item.title}</h3>
                  <p className="text-zinc-500 leading-relaxed font-light">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
