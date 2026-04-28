import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../components/ui/Card';
import { Users, BarChart3, Database, Globe } from 'lucide-react';
import { statsService } from '../services/statsService';
import { Loading } from '../components/ui/Loading';

export default function Admin() {
  const [statsData, setStatsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService.getGlobalStats().then(data => {
      setStatsData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  const stats = [
    { name: 'Active Users', value: statsData.activeUsers.toLocaleString(), change: '+12%', icon: Users },
    { name: 'Generations', value: statsData.totalBrands.toLocaleString(), change: '+25%', icon: BarChart3 },
    { name: 'System Status', value: statsData.systemStatus, change: '100%', icon: Database },
    { name: 'Uptime', value: statsData.uptime, change: '+0.01%', icon: Globe },
  ];

  return (
    <div className="flex flex-col gap-0 SwissGridSurface min-h-screen">
      <div className="container-max mx-auto px-6 py-12 space-y-16">
        <header className="border-b-4 border-zinc-900 pb-12">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[clamp(2.5rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.82]"
            >
              Control <br /> Panel
            </motion.h1>
          </div>
          <p className="text-xl text-zinc-500 font-light italic mt-4">
            Monitoring generation activity and server performance.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-l border-t border-zinc-900">
          {stats.map((stat) => (
            <div key={stat.name} className="p-12 border-r border-b border-zinc-900 bg-white space-y-8 group transition-colors duration-500 hover:bg-zinc-50">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center p-2 group-hover:border-zinc-900 transition-colors">
                  <stat.icon className="w-5 h-5 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
                </div>
                <span className="text-[10px] font-black text-zinc-400 bg-zinc-50 border border-zinc-100 px-3 py-1 group-hover:bg-zinc-900 group-hover:text-white transition-all">{stat.change}</span>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">{stat.name}</p>
                <p className="text-5xl font-black italic tracking-tighter">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-l border-t border-zinc-900">
          <div className="p-16 border-r border-b border-zinc-900 bg-white space-y-12">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 border-b border-zinc-100 pb-6">Recent Activity</h2>
            <div className="space-y-0">
              {statsData.recentActivity.map((activity: any) => (
                <div key={activity.id} className="flex items-center gap-8 py-6 border-b border-zinc-50 last:border-0 group">
                  <div className="w-1.5 h-1.5 bg-zinc-200 group-hover:bg-zinc-900 transition-colors" />
                  <div className="flex-1">
                    <p className="text-xs font-black uppercase tracking-tight">{activity.name}</p>
                    <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-900 px-3 py-1 bg-zinc-50 border border-zinc-100">SUCCESS</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-16 border-r border-b border-zinc-900 bg-zinc-950 text-white space-y-12 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-zinc-800" />
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 border-b border-zinc-800 pb-6">Server Infrastructure</h2>
            <div className="space-y-12">
              {[
                { label: 'AI API Load', val: 42, color: 'bg-white' },
                { label: 'Database Speed', val: 18, color: 'bg-zinc-400' },
                { label: 'Storage Usage', val: 65, color: 'bg-white' },
              ].map((bar) => (
                <div key={bar.label} className="space-y-4">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    <span>{bar.label}</span>
                    <span className="text-white italic">{bar.val}%</span>
                  </div>
                  <div className="h-0.5 w-full bg-zinc-900 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${bar.val}%` }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                      className={`h-full ${bar.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-12 text-[10px] font-black text-zinc-800 uppercase tracking-widest text-center italic">
              ENGINE VERSION 4.2.0
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
