import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="w-full bg-zinc-50 border-t border-zinc-200 py-12">
      <div className="container-max mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col gap-2">
          <span className="text-xl font-bold tracking-tighter">Brandly</span>
          <p className="text-sm text-zinc-500">© 2024 Brandly AI. Built for professionals.</p>
        </div>
        <div className="flex gap-8 text-sm text-zinc-500">
          <Link to="/legal" className="hover:text-zinc-900 transition-colors uppercase font-black text-[10px] tracking-widest">Privacy Policy</Link>
          <Link to="/legal" className="hover:text-zinc-900 transition-colors uppercase font-black text-[10px] tracking-widest">Terms of Service</Link>
          <a href="mailto:support@brandly.ai" className="hover:text-zinc-900 transition-colors uppercase font-black text-[10px] tracking-widest">Support</a>
          <a href="https://twitter.com/brandly" target="_blank" rel="noreferrer" className="hover:text-zinc-900 transition-colors uppercase font-black text-[10px] tracking-widest">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
