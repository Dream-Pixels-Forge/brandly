import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brandService } from '../services/brandService';
import { regenerateAspect } from '../services/gemini';
import { useSettings } from '../context/SettingsContext';
import { BrandProject } from '../types';
import { BrandViewer } from '../components/brand/BrandViewer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

export default function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [project, setProject] = useState<BrandProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [regeneratingAspect, setRegeneratingAspect] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      brandService.getBrand(id).then(data => {
        setProject(data);
        setLoading(false);
      }).catch((err) => {
        setFetchError(err.message || 'Failed to load brand');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="space-y-8 text-center">
          <div className="flex items-end h-12 gap-1.5 justify-center">
            {[4, 6, 8, 5, 7].map((h, i) => (
              <div key={i} className="w-1 bg-zinc-900 animate-pulse" style={{ height: `${h * 6}px` }} />
            ))}
          </div>
          <p className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-400 animate-pulse">Loading_Brand</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="container-max mx-auto px-6 py-24 flex flex-col items-center text-center space-y-8">
        <div className="w-16 h-16 border-4 border-red-500 flex items-center justify-center">
          <span className="text-3xl font-black text-red-500">!</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Load Error</h1>
          <p className="text-sm text-zinc-500 font-mono">{fetchError}</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container-max mx-auto px-6 py-24 flex flex-col items-center text-center space-y-8">
        <div className="w-16 h-16 border-4 border-zinc-200 flex items-center justify-center">
          <span className="text-3xl font-black text-zinc-300">?</span>
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter uppercase">Brand Not Found</h1>
          <p className="text-sm text-zinc-400">This brand may have been deleted or the link is invalid.</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const handleRegenerateAspect = async (aspect: 'colors' | 'typography' | 'name') => {
    if (!project) return;
    try {
      setRegeneratingAspect(aspect);
      const result = await regenerateAspect(project.identity, aspect, project.input, {
        model: settings.model,
        apiKey: settings.apiKey || undefined,
        creativity: settings.creativity,
        mood: 'minimal',
      });
      setProject({ ...project, identity: result });
    } catch (err: any) {
      console.error('Refinement failed:', err);
    } finally {
      setRegeneratingAspect(null);
    }
  };

  return (
    <div className="flex flex-col gap-0 SwissGridSurface min-h-screen">
      <div className="container-max mx-auto px-6 py-12">
        <header className="mb-24 border-b border-zinc-200 pb-12 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-[10px] font-black uppercase tracking-[0.4em] p-0 h-auto hover:bg-transparent hover:underline">
            ← BACK_TO_LIBRARY
          </Button>
          <div className="hidden md:flex gap-8">
            <span className="text-[10px] font-black uppercase text-zinc-300">Auth_Secure</span>
            <span className="text-[10px] font-black uppercase text-zinc-300">V_04_SYNTH</span>
          </div>
        </header>

        <BrandViewer 
          brand={project.identity} 
          onRegenerate={() => navigate('/generate')} 
          onRegenerateAspect={handleRegenerateAspect}
          regeneratingAspect={regeneratingAspect}
        />
      </div>
    </div>
  );
}
