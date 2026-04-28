import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Plus, Layout, Settings, History, Trash2, Loader2, ShoppingBag, Box, Shield, User, Cpu, Globe } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { brandService } from '../services/brandService';
import { BrandProject } from '../types';
import { Loading } from '../components/ui/Loading';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [brands, setBrands] = useState<BrandProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'projects' | 'collections' | 'history'>('projects');

  useEffect(() => {
    if (user) {
      brandService.getUserBrands(user.uid).then(data => {
        setBrands(data || []);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [user]);

  const stats = {
    total: brands.length,
    categories: [...new Set(brands.map(b => b.identity.category))].length,
    mostUsedCategory: brands.length > 0 
      ? brands.reduce((acc: any, curr) => {
          const cat = curr.identity.category;
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {} as any)
      : null,
    oldest: brands.length > 0 ? brands[brands.length - 1].createdAt : null,
  };

  const dominantCategory = stats.mostUsedCategory 
    ? Object.entries(stats.mostUsedCategory).sort((a: any, b: any) => b[1] - a[1])[0][0]
    : 'N/A';

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this brand?')) return;
    
    setDeletingId(id);
    try {
      await brandService.deleteBrand(id);
      setBrands(prev => prev.filter(b => b.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <Loading />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'history':
        return (
          <div className="lg:col-span-9 space-y-12">
            <div className="flex items-center gap-4 border-b border-zinc-900 pb-4">
              <History className="w-5 h-5" />
              <h2 className="text-xl font-black uppercase tracking-tighter">Activity_Protocol</h2>
            </div>
            <div className="space-y-4">
              {brands.map((brand, i) => (
                <div key={brand.id} className="flex items-center justify-between p-6 border border-zinc-200 bg-white hover:border-zinc-900 transition-all group">
                  <div className="flex gap-8 items-center">
                    <span className="font-mono text-[10px] text-zinc-400">#{(brands.length - i).toString().padStart(3, '0')}</span>
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase">{brand.identity.name} synthesized</p>
                      <p className="text-[10px] text-zinc-400 font-medium italic">
                        {brand.createdAt?.toDate ? brand.createdAt.toDate().toLocaleString() : new Date(brand.createdAt!).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate(`/brand/${brand.id}`)}>
                    View Report
                  </Button>
                </div>
              ))}
              {brands.length === 0 && (
                <div className="p-12 border-2 border-dashed border-zinc-200 text-center">
                  <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">No activity recorded</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'collections':
        const grouped = brands.reduce((acc: any, b) => {
          const cat = b.identity.category;
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(b);
          return acc;
        }, {});
        return (
          <div className="lg:col-span-9 space-y-16">
            {Object.entries(grouped).map(([category, items]: [string, any]) => (
              <div key={category} className="space-y-8">
                <div className="flex items-center gap-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">{category}</h3>
                  <div className="h-px flex-1 bg-zinc-200" />
                  <span className="text-[10px] font-mono text-zinc-400">[{items.length}]</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((brand: BrandProject) => (
                    <div 
                      key={brand.id}
                      onClick={() => navigate(`/brand/${brand.id}`)}
                      className="group border border-zinc-200 hover:border-zinc-900 bg-white p-6 transition-all cursor-pointer"
                    >
                      <div className="aspect-video mb-6 border border-zinc-100 p-4" style={{ backgroundColor: brand.identity.colors.background }}>
                        <div className="w-full h-full border-2 border-zinc-900 border-dashed flex items-center justify-center">
                          <span className="text-2xl font-black uppercase tracking-tighter" style={{ color: brand.identity.colors.primary }}>
                            {brand.identity.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <h4 className="font-bold uppercase text-xs mb-1">{brand.identity.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-medium italic">{brand.identity.tagline}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {brands.length === 0 && (
              <div className="p-12 border-2 border-dashed border-zinc-200 text-center">
                <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">Collections empty</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <main className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-zinc-900 h-fit">
            {brands.map((brand) => (
              <motion.div 
                key={brand.id}
                whileHover={{ backgroundColor: '#f9f9f9' }}
                className="group border-r border-b border-zinc-900 cursor-pointer overflow-hidden p-0"
                onClick={() => navigate(`/brand/${brand.id}`)}
              >
                <div 
                  className="aspect-square w-full p-12 flex flex-col items-center justify-center transition-all duration-700 group-hover:scale-95 relative overflow-hidden"
                  style={{ backgroundColor: brand.identity.colors.primary }}
                >
                  <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                    {brand.identity.category === 'Commerce' && <ShoppingBag className="w-32 h-32" />}
                    {brand.identity.category === 'SaaS' && <Box className="w-32 h-32" />}
                    {brand.identity.category === 'Studio' && <Layout className="w-32 h-32" />}
                    {brand.identity.category === 'Bank' && <Shield className="w-32 h-32" />}
                    {brand.identity.category === 'Portfolio' && <User className="w-32 h-32" />}
                    {brand.identity.category === 'Tech' && <Cpu className="w-32 h-32" />}
                    {brand.identity.category === 'Brand' && <Globe className="w-32 h-32" />}
                  </div>

                  <span className="text-white font-black tracking-tighter text-3xl text-center leading-[0.8] uppercase relative z-10">
                    {brand.identity.name}
                  </span>
                </div>
                <div className="p-8 space-y-4 bg-white transition-colors duration-500 group-hover:bg-zinc-50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <p className="font-black text-xs uppercase tracking-tight text-zinc-900 leading-none">{brand.identity.name}</p>
                      <p className="text-[8px] font-black uppercase text-zinc-400 tracking-widest">{brand.identity.category}</p>
                    </div>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] leading-none">
                      {brand.identity.tone} // {brand.createdAt?.toDate ? brand.createdAt.toDate().toLocaleDateString() : brand.createdAt ? new Date(brand.createdAt as any).toLocaleDateString() : 'Draft'}
                    </p>
                  </div>
                  <p className="text-[10px] font-medium text-zinc-500 italic line-clamp-1">
                    {brand.identity.tagline}
                  </p>
                  <div className="h-px w-full bg-zinc-100 group-hover:bg-zinc-900 transition-colors duration-500" />
                  <div className="flex justify-between items-end">
                    <div className="flex gap-1.5">
                      {[brand.identity.colors.primary, brand.identity.colors.secondary].map((c, i) => (
                        <div key={i} className="w-3 h-3 border border-zinc-900" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    <button 
                      onClick={(e) => handleDelete(e, brand.id)}
                      disabled={deletingId === brand.id}
                      className="p-2 hover:bg-red-50 text-zinc-300 hover:text-red-600 transition-colors duration-300"
                    >
                      {deletingId === brand.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            
            <Link to="/generate" className="aspect-square border-r border-b border-zinc-900 flex flex-col items-center justify-center gap-6 group hover:bg-zinc-900 transition-colors duration-500">
              <div className="w-12 h-12 border border-zinc-200 flex items-center justify-center group-hover:border-zinc-700 transition-colors">
                <Plus className="w-6 h-6 text-zinc-400 group-hover:text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 group-hover:text-white">INIT_SYNTHESIS</span>
            </Link>
          </main>
        );
    }
  };

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
                Project <br /> Library
              </motion.h1>
            </div>
            <p className="text-xl text-zinc-500 font-light italic">
              Your collection of generated visual identities.
            </p>
          </div>
          <Link to="/generate">
            <Button size="lg">
              <Plus className="w-5 h-5 mr-3" />
              New Project
            </Button>
          </Link>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-3">
            <div className="sticky top-32 space-y-12">
              <nav className="flex flex-col gap-2">
                {[
                  { name: 'Your Projects', icon: Layout, id: 'projects' },
                  { name: 'Collections', icon: ShoppingBag, id: 'collections' },
                  { name: 'History', icon: History, id: 'history' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`group flex items-center justify-between px-6 py-4 border transition-all duration-300 ${activeTab === item.id ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl translate-x-2' : 'border-zinc-200 text-zinc-400 hover:border-zinc-900 hover:text-zinc-900 bg-white'}`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.name}</span>
                    </div>
                    {activeTab === item.id && <div className="w-1.5 h-1.5 bg-white" />}
                  </button>
                ))}
              </nav>

              <div className="p-8 border border-zinc-900 bg-zinc-950 text-white space-y-6 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-full h-[2px] bg-zinc-900 origin-left" />
                <h4 className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-500 border-b border-zinc-800 pb-4">Account Stats</h4>
                <div className="space-y-6">
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Active_Protocol</span>
                    <p className="text-xl font-black italic tracking-tighter uppercase">{dominantCategory || 'IDLE'}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Units_Stored</span>
                    <p className="text-xl font-black italic tracking-tighter">{stats.total.toString().padStart(2, '0')}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Sectors_Defined</span>
                    <p className="text-xl font-black italic tracking-tighter">{stats.categories.toString().padStart(2, '0')}</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-[8px] font-mono text-zinc-600 uppercase">System Status: Optimal</p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {renderContent()}
        </div>
      </div>
    </div>
  );
}
