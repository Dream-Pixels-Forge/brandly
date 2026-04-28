import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { brandService } from '../services/brandService';
import { BrandProject } from '../types';
import { BrandViewer } from '../components/brand/BrandViewer';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Loading } from '../components/ui/Loading';

export default function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<BrandProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      brandService.getBrand(id).then(data => {
        setProject(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!project) {
    return (
      <div className="container-max mx-auto px-6 py-24 text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter">Brand not found.</h1>
        <Button variant="ghost" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

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
        />
      </div>
    </div>
  );
}
