import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User as UserIcon, Settings as SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { SettingsDialog } from '../settings/SettingsDialog';

export function Navbar() {
  const { user, signIn, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-zinc-900">
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <div className="container-max mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 bg-zinc-900 flex items-center justify-center">
              <div className="w-2 h-2 bg-white" />
            </div>
            <span className="text-xl font-black uppercase tracking-tighter text-zinc-900">Brandly</span>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link to="/generate" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900">Create</Link>
            <Link to="/gallery" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors">Gallery</Link>
            <Link to="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors">Pricing</Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-8">
              <Link to="/dashboard" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-900 transition-colors">
                Library
              </Link>
              <div className="flex items-center gap-3">
                {user.photoURL && (
                  <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-none border border-zinc-900 p-0.5" />
                )}
                <Button variant="ghost" size="sm" onClick={logout} className="text-[10px] font-black underline decoration-zinc-200 underline-offset-4">
                  Log Out
                </Button>
              </div>
            </div>
          ) : (
            <Button variant="ghost" size="sm" onClick={signIn} className="text-[10px] font-black tracking-widest">
              Sign In
            </Button>
          )}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:text-zinc-900 transition-colors"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          
          <Link to="/generate">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
