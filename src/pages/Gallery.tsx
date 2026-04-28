import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { collection, query, limit, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BrandProject } from '../types';
import { ExternalLink, ShoppingBag, Box, Layout, Shield, User, Cpu, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loading } from '../components/ui/Loading';

export default function Gallery() {
  const [brands, setBrands] = useState<BrandProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'SaaS', 'Studio', 'Commerce', 'Brand', 'Bank', 'Portfolio', 'Tech'];

  useEffect(() => {
    const q = query(
      collection(db, 'brands'),
      orderBy('createdAt', 'desc'),
      limit(12)
    );
    
    getDocs(q).then((snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BrandProject[];
      setBrands(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex flex-col gap-0 SwissGridSurface min-h-screen">
      <div className="container-max mx-auto px-6 py-12 space-y-16">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b-4 border-zinc-900 pb-12">
          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                className="text-[clamp(2rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.82]"
              >
                Community <br /> Gallery
              </motion.h1>
            </div>
            <p className="text-xl text-zinc-500 font-light italic">
              A collection of visual identities created by the community.
            </p>
          </div>
          <div className="flex flex-col items-end text-right md:text-right">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400">Total Projects</span>
            <p className="text-3xl md:text-4xl font-black italic tracking-tighter">{brands.length.toLocaleString()}</p>
          </div>
        </header>

        <div className="flex flex-col gap-12">
          {/* Navigation & Filters */}
          <div className="flex flex-col gap-6 border-b border-zinc-200 pb-8">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Filter_Resources</span>
            <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full no-scrollbar">
              {categories.map((cat) => {
                const count = cat === 'All' 
                  ? brands.length 
                  : brands.filter(b => b.identity.category === cat).length;
                
                const isActive = filter === cat;
                const hasResults = count > 0;

                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`flex items-center gap-3 px-6 py-2 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap transition-all duration-300 border ${
                      isActive 
                      ? 'bg-zinc-900 border-zinc-900 text-white shadow-lg' 
                      : hasResults 
                        ? 'bg-white border-zinc-200 text-zinc-900 hover:border-zinc-900' 
                        : 'bg-zinc-50 border-zinc-100 text-zinc-300'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-zinc-100'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* High-Density Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0 border-l border-t border-zinc-900">
            {brands
              .filter(brand => filter === 'All' || brand.identity.category === filter)
              .map((brand) => (
              <Link 
                key={brand.id} 
                to={`/brand/${brand.id}`} 
                className="block group border-r border-b border-zinc-900 transition-all duration-500 hover:bg-zinc-50 overflow-hidden relative"
              >
                {/* Component Preview Thumbnail */}
                <div className="aspect-[4/3] w-full p-8 flex flex-col items-center justify-center relative overflow-hidden bg-white">
                  <div 
                    className="absolute inset-0 opacity-[0.03] pointer-events-none transition-opacity group-hover:opacity-[0.06]" 
                    style={{ backgroundColor: brand.identity.colors.primary }}
                  />
                  
                  {/* Decorative Anchor Marks */}
                  <div className="absolute top-4 left-4 w-1.5 h-1.5 border border-zinc-200 group-hover:border-zinc-900" />
                  <div className="absolute top-4 right-4 w-1.5 h-1.5 border border-zinc-200 group-hover:border-zinc-900" />
                  <div className="absolute bottom-4 left-4 w-1.5 h-1.5 border border-zinc-200 group-hover:border-zinc-900" />
                  <div className="absolute bottom-4 right-4 w-1.5 h-1.5 border border-zinc-200 group-hover:border-zinc-900" />

                  {/* Category-specific Visual Hint */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-10 group-hover:opacity-30 transition-opacity">
                    {brand.identity.category === 'Commerce' && <ShoppingBag className="w-12 h-12" />}
                    {brand.identity.category === 'SaaS' && <Box className="w-12 h-12" />}
                    {brand.identity.category === 'Studio' && <Layout className="w-12 h-12" />}
                    {brand.identity.category === 'Bank' && <Shield className="w-12 h-12" />}
                    {brand.identity.category === 'Portfolio' && <User className="w-12 h-12" />}
                    {brand.identity.category === 'Tech' && <Cpu className="w-12 h-12" />}
                    {brand.identity.category === 'Brand' && <Globe className="w-12 h-12" />}
                  </div>

                  {/* Brand Mark */}
                  <div 
                    className="w-16 h-16 mb-6 transition-all duration-700 group-hover:scale-110 flex items-center justify-center border-4 border-zinc-900 relative shadow-sm"
                    style={{ color: brand.identity.colors.primary }}
                  >
                    <span className="text-3xl font-black italic">{brand.identity.name.charAt(0)}</span>
                    <div 
                      className="absolute -top-2 -right-2 w-4 h-4 shadow-sm" 
                      style={{ backgroundColor: brand.identity.colors.secondary }}
                    />
                  </div>
                  
                  <span 
                    className="text-zinc-900 font-black tracking-tighter text-2xl text-center leading-[0.85] uppercase max-w-[80%]"
                    style={{ fontFamily: brand.identity.typography.heading.family }}
                  >
                    {brand.identity.name}
                  </span>
                </div>

                {/* Metadata Footer */}
                <div className="p-6 space-y-4 bg-white border-t border-zinc-100 transition-colors group-hover:bg-zinc-50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-black text-[10px] uppercase tracking-tight text-zinc-900">{brand.identity.name}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-zinc-900" />
                        <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.2em]">
                          {brand.identity.category} // {brand.identity.tone}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       {brand.identity.target_audience.split(',').slice(0, 1).map((tag: string, i: number) => (
                         <span key={i} className="text-[8px] font-black uppercase tracking-widest bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                           {tag.trim()}
                         </span>
                       ))}
                    </div>
                  </div>
                  <p className="text-[10px] font-medium text-zinc-500 line-clamp-1 leading-relaxed">
                    {brand.identity.tagline}
                  </p>
                </div>

                {/* Hover Action Overlay */}
                <div className="absolute inset-0 bg-zinc-900/0 group-hover:bg-zinc-900/5 transition-all duration-500 pointer-events-none" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
