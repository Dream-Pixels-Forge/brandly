import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Cpu, Key, ChevronDown, Check, Loader2, AlertCircle, Zap, Palette } from 'lucide-react';
import { useSettings, GeminiModel } from '../../context/SettingsContext';
import { BrandMood } from '../../types';
import { validateApiKey } from '../../services/gemini';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MODELS: { id: GeminiModel; name: string; desc: string }[] = [
  { id: 'gemini-3.1-flash-lite-preview', name: '3.1 Flash Lite', desc: 'Fastest & Cost-Efficient' },
  { id: 'gemini-3-flash-preview', name: '3 Flash', desc: 'Next-gen Speed' },
  { id: 'gemini-3.1-pro-preview', name: '3.1 Pro', desc: 'Deep Reasoning & Logic' }
];

const MOODS: { id: BrandMood; name: string }[] = [
  { id: 'minimal', name: 'Minimalist' },
  { id: 'bold', name: 'Bold & Loud' },
  { id: 'luxury', name: 'High Luxury' },
  { id: 'tech', name: 'Future Tech' },
  { id: 'warm', name: 'Organic & Warm' }
];

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { settings, updateSettings, resetSettings } = useSettings();
  const [localKey, setLocalKey] = useState(settings.apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const handleValidate = async (key: string) => {
    if (!key) {
      setIsValid(null);
      return;
    }
    setIsValidating(true);
    const result = await validateApiKey(key);
    setIsValid(result);
    setIsValidating(false);
  };

  const handleSave = () => {
    updateSettings({ apiKey: localKey });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[9999]"
          />
          <div className="fixed inset-0 flex items-center justify-center p-4 z-[10000] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white border border-zinc-200 pointer-events-auto overflow-hidden flex flex-col shadow-2xl max-h-[90vh]"
            >
              {/* Header */}
              <div className="px-8 py-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-zinc-900 flex items-center justify-center text-white">
                    <Settings className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-900">System_Config</h2>
                    <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">v5.1.2 // Production_Ready</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={resetSettings}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    Reset_Defaults
                  </button>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 flex items-center justify-center hover:bg-zinc-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-8 space-y-10 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-10">
                    {/* Model Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <Cpu className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Synthesis_Engine</span>
                      </div>
                      
                      <div className="relative">
                        <button
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between p-5 bg-zinc-50 border border-zinc-200 hover:border-zinc-900 transition-all text-left"
                        >
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-zinc-400">
                              {MODELS.find(m => m.id === settings.model)?.desc}
                            </p>
                            <p className="text-sm font-black tracking-tighter uppercase text-zinc-900">
                              {MODELS.find(m => m.id === settings.model)?.name}
                            </p>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-zinc-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute z-20 top-full left-0 right-0 mt-2 bg-white border border-zinc-900 shadow-2xl"
                            >
                              {MODELS.map((m) => (
                                <button
                                  key={m.id}
                                  onClick={() => {
                                    updateSettings({ model: m.id });
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full p-4 text-left transition-colors border-b last:border-b-0 border-zinc-100 hover:bg-zinc-50 flex items-center justify-between ${
                                    settings.model === m.id ? 'bg-zinc-50' : ''
                                  }`}
                                >
                                  <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest mb-1 text-zinc-400">{m.desc}</p>
                                    <p className="text-sm font-black tracking-tighter uppercase text-zinc-900">{m.name}</p>
                                  </div>
                                  {settings.model === m.id && <Check className="w-4 h-4 text-zinc-900" />}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Creativity / Temperature */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <Zap className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Abstract_Creativity</span>
                      </div>
                      <div className="space-y-2">
                        <input 
                          type="range" 
                          min="0" 
                          max="1" 
                          step="0.1" 
                          value={settings.creativity}
                          onChange={(e) => updateSettings({ creativity: parseFloat(e.target.value) })}
                          className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-zinc-900"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          <span>Logical</span>
                          <span className="text-zinc-900">{settings.creativity * 100}%</span>
                          <span>Chaotic</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-10">
                    {/* Default Mood */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <Palette className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Default_Aesthetic</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {MOODS.map(mood => (
                          <button
                            key={mood.id}
                            onClick={() => updateSettings({ defaultMood: mood.id })}
                            className={`p-4 text-left border transition-all ${
                              settings.defaultMood === mood.id 
                                ? 'bg-zinc-900 border-zinc-900 text-white' 
                                : 'bg-zinc-50 border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900'
                            }`}
                          >
                            <span className="text-[10px] font-black uppercase tracking-widest">{mood.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* API Key */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <Key className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Credentials</span>
                      </div>
                      <div className="relative group">
                        <input
                          type={showKey ? "text" : "password"}
                          value={localKey}
                          onChange={(e) => {
                            setLocalKey(e.target.value);
                            setIsValid(null);
                          }}
                          onBlur={() => handleValidate(localKey)}
                          placeholder="Gemini API Key..."
                          className={`w-full bg-zinc-50 border p-4 pr-20 text-xs font-mono tracking-tight focus:outline-none transition-all placeholder:text-zinc-300 ${
                            isValid === true ? 'border-green-500 bg-green-50/30' : 
                            isValid === false ? 'border-red-500 bg-red-50/30' : 
                            'border-zinc-200 focus:border-zinc-900 focus:bg-white'
                          }`}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setShowKey(!showKey)}
                            className="text-zinc-300 hover:text-zinc-900 transition-colors uppercase text-[9px] font-black tracking-widest"
                          >
                            {showKey ? "Hide" : "Show"}
                          </button>
                        </div>
                      </div>
                      {isValidating ? (
                        <p className="text-[9px] text-zinc-400 animate-pulse">Verifying...</p>
                      ) : isValid === true ? (
                        <p className="text-[9px] text-green-600 font-bold">✓ Key Verified</p>
                      ) : isValid === false ? (
                        <p className="text-[9px] text-red-600 font-bold">✗ Invalid Key</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-6 border-t border-zinc-100 flex justify-end bg-zinc-50 shrink-0">
                <button
                  onClick={handleSave}
                  className="px-10 py-4 bg-zinc-900 text-white text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-all hover:translate-y-[-2px] active:translate-y-0 active:scale-95 shadow-lg shadow-zinc-200"
                >
                  Confirm_Settings
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
