import { useState, useRef, useEffect } from 'react';
import { generateBrandIdentity, regenerateAspect } from '../services/gemini';
import { brandService } from '../services/brandService';
import { useAuth } from '../context/AuthContext';
import { BrandIdentity, BrandMood } from '../types';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';
import { BrandViewer } from '../components/brand/BrandViewer';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react';

import { useSettings } from '../context/SettingsContext';

type GenStage = 'input' | 'direction' | 'result';

export default function Generator() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const [inputText, setInputText] = useState('');
  const [activeMood, setActiveMood] = useState<BrandMood>(settings.defaultMood);
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStage, setGenStage] = useState<GenStage>('input');
  const [brand, setBrand] = useState<BrandIdentity | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [regeneratingAspect, setRegeneratingAspect] = useState<string | null>(null);
  const [refKeywords, setRefKeywords] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(t);
  }, [toast]);

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

      const augmentedInput = refKeywords.trim()
        ? `${inputText}\n\nVisual References / Keywords: ${refKeywords}`
        : inputText;

      const result = await generateBrandIdentity(
        augmentedInput, 
        {
          model: settings.model,
          apiKey: settings.apiKey || undefined,
          creativity: settings.creativity,
          mood: activeMood
        }
      );
      
      if (!mountedRef.current) return;

      let savedId = null;
      if (user) {
        savedId = await brandService.saveBrand(user.uid, inputText, result);
      }

      if (!mountedRef.current) return;
      setBrand(result);
      setGenStage('result');
      setIsGenerating(false);
      if (savedId) {
        setToast('Brand identity saved to your library!');
      }
      
    } catch (err: any) {
      if (!mountedRef.current) return;
      setError(err.message || 'Something went wrong. Please try again.');
      setIsGenerating(false);
    }
  };

  const handleRegenerateAspect = async (aspect: 'colors' | 'typography' | 'name') => {
    if (!brand || !inputText.trim()) return;
    try {
      setRegeneratingAspect(aspect);
      setError(null);
      const augmentedInput = refKeywords.trim()
        ? `${inputText}\n\nVisual References / Keywords: ${refKeywords}`
        : inputText;
      const result = await regenerateAspect(brand, aspect, augmentedInput, {
        model: settings.model,
        apiKey: settings.apiKey || undefined,
        creativity: settings.creativity,
        mood: activeMood,
      });
      if (!mountedRef.current) return;
      setBrand(result);
      if (user) {
        await brandService.saveBrand(user.uid, inputText, result);
        setToast(`${aspect.charAt(0).toUpperCase() + aspect.slice(1)} regenerated and saved!`);
      }
    } catch (err: any) {
      if (!mountedRef.current) return;
      setError(err.message || 'Refinement failed.');
    } finally {
      if (mountedRef.current) setRegeneratingAspect(null);
    }
  };

  const stageTitle = genStage === 'input' 
    ? { title: 'Your Brand Identity', subtitle: 'Describe your business essence. Our engine will derive your visual soul automatically.' }
    : { title: 'Refine Direction', subtitle: 'Set the visual atmosphere and add reference keywords before synthesis.' };

  return (
    <div className="container-max mx-auto px-6 py-12 min-h-screen">
      <AnimatePresence mode="popLayout">
        {genStage === 'input' && !isGenerating && (
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
                    onClick={() => setGenStage('direction')}
                    disabled={!inputText.trim() || inputText.length < 50}
                    size="lg"
                    className="w-full md:w-auto"
                  >
                    Next: Set Direction
                    <ArrowRight className="ml-3 w-4 h-4" />
                  </Button>
                </div>
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

        {genStage === 'direction' && !isGenerating && (
          <motion.div 
            key="direction"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-16"
          >
            <div className="flex items-center gap-6">
              <button onClick={() => setGenStage('input')} className="p-2 hover:bg-zinc-100 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="space-y-4 border-l-4 border-zinc-900 pl-8">
                <h1 className="text-[clamp(2.5rem,8vw,6rem)] font-black tracking-tighter uppercase leading-[0.85]">
                  Refine <br /> Direction
                </h1>
                <p className="text-xl text-zinc-500 font-light max-w-xl italic">
                  Set the visual atmosphere and add reference keywords before synthesis.
                </p>
              </div>
            </div>

            <div className="space-y-12">
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

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-6 bg-zinc-900" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Reference_Keywords</h3>
                </div>
                <p className="text-sm text-zinc-400 italic">Optional: add visual references, competitor names, or style keywords to guide the synthesis.</p>
                <input
                  value={refKeywords}
                  onChange={(e) => setRefKeywords(e.target.value)}
                  placeholder="e.g. Minotti, Kartell, Japanese minimalism, warm neutrals, editorial photography"
                  className="w-full px-6 py-5 bg-zinc-50 border border-zinc-200 focus:border-zinc-900 focus:outline-none text-lg font-medium tracking-tight text-zinc-900 placeholder:text-zinc-300 transition-colors"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-zinc-200">
                <Button variant="ghost" size="sm" onClick={() => { setInputText(''); setRefKeywords(''); setGenStage('input'); }}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start Over
                </Button>
                <Button 
                  onClick={handleGenerate} 
                  isLoading={isGenerating}
                  size="lg"
                >
                  Generate Identity
                </Button>
              </div>
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

        {genStage === 'result' && brand && !isGenerating && (
          <motion.div 
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <BrandViewer brand={brand} onRegenerate={() => { setBrand(null); setGenStage('input'); }} onRegenerateAspect={handleRegenerateAspect} regeneratingAspect={regeneratingAspect} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
