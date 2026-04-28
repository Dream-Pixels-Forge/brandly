import React from 'react';
import { motion } from 'motion/react';
import { BrandIdentity } from '../../types';
import { 
  ArrowRight, 
  Layout, 
  Box, 
  ShoppingBag, 
  Shield, 
  User, 
  Cpu, 
  Globe, 
  Menu,
  ChevronRight,
  Star
} from 'lucide-react';

interface BrandPreviewProps {
  brand: BrandIdentity;
}

export function BrandPreview({ brand }: BrandPreviewProps) {
  const { category, colors, typography, name, tagline, mission } = brand;

  const renderSaaS = () => (
    <div className="space-y-20 pb-20">
      {/* SaaS Hero */}
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200 bg-white/50 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: colors.accent }} />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">v2.0 Beta Live</span>
          </div>
          <h1 
            className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.9]"
            style={{ fontFamily: typography.heading.family, color: colors.text }}
          >
            {tagline}
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-md font-light leading-relaxed">
            {mission}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:translate-y-[-2px] transition-all"
              style={{ backgroundColor: colors.primary }}
            >
              Get Started Free
            </button>
            <button className="px-8 py-4 text-[10px] font-black uppercase tracking-widest border border-zinc-200 hover:bg-zinc-50 transition-all">
              Watch Demo
            </button>
          </div>
        </div>
        <div className="relative aspect-video bg-zinc-100 border border-zinc-200 rounded-xl overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-8 bg-white border-b border-zinc-200 flex items-center px-4 gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <div className="p-8 pt-12 grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-24 bg-white border border-zinc-100 rounded shadow-sm flex items-center justify-center">
                <Box className="w-6 h-6 text-zinc-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SaaS Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { label: 'Active Users', val: '120k+' },
          { label: 'Integrations', val: '50+' },
          { label: 'Uptime', val: '99.9%' },
          { label: 'Customer Rating', val: '4.9/5' },
        ].map((stat, i) => (
          <div key={i} className="space-y-1">
            <p className="text-3xl font-black italic tracking-tighter" style={{ color: colors.primary }}>{stat.val}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCommerce = () => (
    <div className="space-y-16">
      <div className="relative aspect-[21/9] bg-zinc-100 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundColor: colors.primary }} />
        <div className="relative z-10 text-center space-y-6 px-4">
          <h1 className="text-4xl md:text-7xl font-black italic tracking-tighter uppercase" style={{ color: colors.text }}>New Arrivals</h1>
          <button className="px-10 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-widest">Shop Collection</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="group cursor-pointer space-y-4">
            <div className="aspect-[3/4] bg-zinc-50 border border-zinc-200 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-24 h-24" style={{ color: colors.primary }} />
              </div>
              <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform">
                <button 
                  className="w-full py-3 text-[9px] font-black uppercase tracking-widest text-white shadow-lg"
                  style={{ backgroundColor: colors.accent }}
                >
                  Quick Add
                </button>
              </div>
            </div>
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Essential Series</p>
                <p className="font-bold">Premium Canvas Tote</p>
              </div>
              <p className="font-black">$85.00</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStudio = () => (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-12 space-y-8 mb-12">
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase" style={{ color: colors.text }}>
          We Build <br /> <span style={{ color: colors.primary }}>Digital Worlds</span>
        </h1>
      </div>
      
      <div className="md:col-span-8 aspect-video bg-zinc-900 flex items-center justify-center relative overflow-hidden group">
        <div className="absolute inset-0 opacity-40 group-hover:opacity-60 transition-opacity" style={{ backgroundColor: colors.secondary }} />
        <p className="relative z-10 text-white text-[10px] font-black uppercase tracking-[1em] translate-y-4 group-hover:translate-y-0 transition-transform">View Project</p>
      </div>

      <div className="md:col-span-4 space-y-8">
        <div className="p-8 border-t border-zinc-900 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Services</p>
          <ul className="space-y-2 text-xl font-bold italic tracking-tighter">
            <li>Identity Design</li>
            <li>Interactive Systems</li>
            <li>Visual Strategy</li>
            <li>Motion Graphics</li>
          </ul>
        </div>
        <div className="aspect-square bg-zinc-100 flex items-center justify-center border border-zinc-200">
          <Layout className="w-12 h-12 text-zinc-200" />
        </div>
      </div>
    </div>
  );

  const renderBank = () => (
    <div className="max-w-4xl mx-auto space-y-12">
      <header className="flex justify-between items-center py-6 border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-zinc-900 flex items-center justify-center">
             <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-black uppercase tracking-tighter text-xl">{name}</span>
        </div>
        <div className="flex gap-4">
          <button className="p-2 hover:bg-zinc-50 rounded-full transition-colors"><Menu className="w-5 h-5" /></button>
          <button className="w-10 h-10 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200">
            <User className="w-6 h-6 m-auto translate-y-1 text-zinc-400" />
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="p-8 rounded-3xl text-white space-y-8 relative overflow-hidden" style={{ backgroundColor: colors.primary }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl shadow-2xl" />
            <div className="flex justify-between items-start relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Balance</p>
              <Cpu className="w-6 h-6 opacity-60" />
            </div>
            <p className="text-5xl font-black tracking-tighter relative z-10">$45,280.00</p>
            <div className="flex gap-4 relative z-10">
              <button className="flex-1 py-4 bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-colors">Send</button>
              <button className="flex-1 py-4 bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-colors">Request</button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Recent Transactions</h3>
            <div className="space-y-1">
              {[
                { label: 'Draft Creative Studio', val: '-$1,200', type: 'exp' },
                { label: 'AWS Cloud Services', val: '-$42.50', type: 'exp' },
                { label: 'Identity Engine Payment', val: '+$5,000', type: 'inc' },
              ].map((tx, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-zinc-50 border border-zinc-100">
                  <span className="font-bold">{tx.label}</span>
                  <span className={`font-black ${tx.type === 'inc' ? 'text-green-600' : 'text-zinc-900'}`}>{tx.val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-6 border-2 border-dashed border-zinc-200 rounded-3xl space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Investment Insights</p>
            <p className="text-xl font-bold">Your portfolio is up <span className="text-green-600">+12.4%</span> this month.</p>
            <button className="w-full py-3 border border-zinc-900 text-[9px] font-black uppercase tracking-widest">Analyze</button>
          </div>
          <div className="p-6 bg-zinc-900 rounded-3xl text-white space-y-4">
             <Star className="w-6 h-6 text-amber-400" />
             <p className="text-xs font-medium opacity-80">Unlock Platinum status with personalized strategic support.</p>
             <button className="text-[9px] font-black uppercase tracking-widest underline decoration-zinc-600 underline-offset-4">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrand = () => (
    <div className="space-y-24">
      <div className="text-center space-y-8 max-w-2xl mx-auto">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase" style={{ color: colors.text }}>{tagline}</h1>
        <p className="text-lg text-zinc-500 leading-relaxed font-light">{mission}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="aspect-square bg-zinc-100 flex items-center justify-center border border-zinc-200">
           <Globe className="w-16 h-16 text-zinc-200" />
        </div>
        <div className="aspect-square bg-zinc-900 flex items-center justify-center p-12 text-center">
           <p className="text-white text-[10px] font-black uppercase tracking-[0.5em]">{brand.vision}</p>
        </div>
      </div>
    </div>
  );

  const renderPortfolio = () => (
    <div className="space-y-24">
      <div className="flex flex-col md:flex-row gap-12 items-end">
        <div className="flex-1 space-y-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Selected Works</p>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-none" style={{ color: colors.text }}>{name}</h1>
        </div>
        <p className="md:w-1/3 text-lg font-light leading-relaxed text-zinc-500 italic pb-2">
          {mission}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="aspect-square bg-zinc-50 border border-zinc-100 flex flex-col items-center justify-center group overflow-hidden relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
              <div className="w-12 h-12 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-xl">
                 <ArrowRight className="w-5 h-5" style={{ color: colors.primary }} />
              </div>
            </div>
            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-200 group-hover:scale-150 transition-transform duration-700">Project_0{i}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const getTemplate = () => {
    switch (category) {
      case 'SaaS': return renderSaaS();
      case 'Commerce': return renderCommerce();
      case 'Studio': return renderStudio();
      case 'Bank': return renderBank();
      case 'Portfolio': return renderPortfolio(); 
      case 'Tech': return renderSaaS(); 
      case 'Brand': return renderBrand();
      default: return renderBrand();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="SwissGridSurface p-8 md:p-16 border border-zinc-200 bg-white min-h-[600px]"
      style={{ backgroundColor: colors.background }}
    >
      {/* Mini Nav */}
      <nav className="flex justify-between items-center mb-12 md:mb-24">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center font-black italic border-2 border-zinc-900"
            style={{ color: colors.primary, borderColor: colors.text }}
          >
            {name.charAt(0)}
          </div>
          <span 
            className="text-lg md:text-xl font-black uppercase tracking-tighter"
            style={{ fontFamily: typography.heading.family, color: colors.text }}
          >
            {name}
          </span>
        </div>
        <div className="hidden md:flex gap-8">
          {['Product', 'Company', 'Pricing'].map(nav => (
            <span key={nav} className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 cursor-pointer transition-colors">
              {nav}
            </span>
          ))}
        </div>
      </nav>

      {getTemplate()}
    </motion.div>
  );
}
