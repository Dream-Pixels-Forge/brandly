import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import Home from './pages/Home';
import Generator from './pages/Generator';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import BrandDetail from './pages/BrandDetail';
import Gallery from './pages/Gallery';
import Pricing from './pages/Pricing';
import Legal from './pages/Legal';

export default function App() {
  return (
    <Router>
      <SettingsProvider>
        <AuthProvider>
          <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/generate" element={<Generator />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/brand/:id" element={<BrandDetail />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/legal" element={<Legal />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </SettingsProvider>
    </Router>
  );
}
