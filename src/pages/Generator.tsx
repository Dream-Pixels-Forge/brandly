import { useState } from 'react';
import { generateBrandIdentity } from '../services/gemini';
import { brandService } from '../services/brandService';
import { useAuth } from '../context/AuthContext';
import { BrandIdentity, BrandMood } from '../types';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Loading } from '../components/ui/Loading';
import { BrandViewer } from '../components/brand/BrandViewer';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, MessageSquare, Target, Palette } from 'lucide-react';

import { useSettings } from '../context/SettingsContext';

export default function Generator() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [inputText, setInputText] = useState('');
  const [activeMood, setActiveMood] = useState<BrandMood>(settings.defaultMood);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState<BrandIdentity | null>(null);
  const [error, setError] = useState<string | null>(null);

  const moods: { id: BrandMood, label: string, color: string }[] = [
    { id: 'minimal', label: 'Minimal', color: 'bg-zinc-100' },
    { id: 'bold', label: 'Bold', color: 'bg-zinc-900' },
    { id: 'luxury', label: 'Luxury', color: 'bg-amber-100' },
    { id: 'tech', label: 'Tech', color: 'bg-blue-100' },
    { id: 'warm', label: 'Warm', color: 'bg-orange-50' },
  ];

  const handleGenerate = async () => {
    if (!inputText.trim()) return;

    try {
      setIsGenerating(true);
      setError(null);
      setStep(0);

      const interval = setInterval(() => {
        setStep((s) => (s < 3 ? s + 1 : s));
      }, 2000);

      const result = await generateBrandIdentity(
        inputText, 
        {
          model: settings.model,
          apiKey: settings.apiKey || undefined,
          creativity: settings.creativity,
          mood: activeMood
        }
      );
      
      let savedId = null;
      if (user) {
        savedId = await brandService.saveBrand(user.uid, inputText, result);
      }

      clearInterval(interval);
      setStep(3);
      
      // Short delay for the last step
      setTimeout(() => {
        setBrand(result);
        setIsGenerating(false);
        if (savedId) {
          alert('Brand identity saved to your library!');
        }
      }, 500);
      
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
      setIsGenerating(false);
    }
  };

  return (
    <div className="container-max mx-auto px-6 py-12 min-h-screen">
      <AnimatePresence mode="popLayout">
        {!brand && !isGenerating && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-16"
          >
            <div className="space-y-4 border-l-4 border-zinc-900 pl-8">
              <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-tighter uppercase leading-[0.85]">
                Your Brand <br /> Identity
              </h1>
              <p className="text-xl text-zinc-500 font-light max-w-xl italic">
                Describe your business essence. Our engine will derive your visual soul automatically.
              </p>
            </div>

            <div className="flex flex-col gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-zinc-900" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Contextual_Atmosphere</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  {moods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMood(m.id)}
                      className={`px-8 py-5 border transition-all duration-300 relative overflow-hidden group ${
                        activeMood === m.id 
                          ? 'bg-zinc-900 border-zinc-900 text-white shadow-xl translate-y-[-4px]' 
                          : 'bg-white border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900 shadow-sm'
                      }`}
                    >
                      <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-widest">{m.label}</span>
                      </div>
                      {activeMood === m.id && (
                        <motion.div 
                          layoutId="active-mood-glitch"
                          className="absolute bottom-0 left-0 h-1 bg-white/20 w-full"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative group p-12 bg-zinc-50 border border-zinc-200 shadow-inner">
                <div className="absolute -top-3 -left-3 px-4 py-1 bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-[0.2em]">
                  TELL US ABOUT YOUR BRAND
                </div>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="e.g. We craft sustainable skincare using cold-pressed Nordic botanicals..."
                  className="w-full h-64 bg-transparent border-none focus:ring-0 focus:outline-none text-3xl font-medium tracking-tight text-zinc-900 placeholder:text-zinc-200 resize-none leading-tight caret-zinc-900"
                />
                
                <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-zinc-200">
                  <div className="flex gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Input Length</p>
                      <p className="text-xl font-bold tracking-tighter">{inputText.length}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black tracking-widest text-zinc-400 uppercase">Status</p>
                      <p className="text-xl font-bold tracking-tighter transition-colors duration-500" style={{ color: inputText.length > 50 ? '#18181b' : '#e4e4e7' }}>
                        {inputText.length > 0 ? (inputText.length > 50 ? 'READY' : 'TOO_SHORT') : 'AWAITING_INPUT'}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleGenerate} 
                    disabled={!inputText.trim() || inputText.length < 50}
                    isLoading={isGenerating}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    Create Identity
                  </Button>
                </div>
                
                <AnimatePresence>
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-8 p-6 bg-red-50 border-l-4 border-red-600 flex items-start gap-4"
                    >
                      <div className="shrink-0 pt-1">
                        <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold">!</div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600">Synthesis Error</p>
                        <p className="text-sm font-medium text-red-900 leading-tight tracking-tight">
                          {error.includes('AI_QUOTA_EXCEEDED') ? 'The strategic synthesis engine has reached its temporary capacity limit. Please wait 60 seconds before re-initializing.' : error}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8">
              {[
                { label: 'System', val: 'Swiss Engine 4.0' },
                { label: 'Model', val: settings.model.replace('gemini-', '').toUpperCase() },
                { label: 'Target', val: 'Visual Permanence' },
              ].map(stat => (
                <div key={stat.label} className="border-t border-zinc-100 pt-6">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</span>
                  <p className="text-sm font-bold text-zinc-900">{stat.val}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loading />
          </motion.div>
        )}

        {brand && !isGenerating && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BrandViewer brand={brand} onRegenerate={() => setBrand(null)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
