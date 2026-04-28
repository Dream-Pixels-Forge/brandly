import { useEffect, useState, useRef } from 'react';
import { BrandIdentity } from '../../types';
import { Button } from '../ui/Button';
import { Loader2, Layout, BookOpen, Monitor, Tablet, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import { BrandPreview } from './BrandPreview';

interface BrandViewerProps {
  brand: BrandIdentity;
  onRegenerate: () => void;
}

export function BrandViewer({ brand, onRegenerate }: BrandViewerProps) {
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingMarkdown, setIsExportingMarkdown] = useState(false);
  const [activeView, setActiveView] = useState<'guidelines' | 'preview'>('guidelines');
  const [deviceSize, setDeviceSize] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headingFont = brand.typography.heading.family.replace(/ /g, '+');
    const bodyFont = brand.typography.body.family.replace(/ /g, '+');
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${headingFont}:wght@400;700&family=${bodyFont}:wght@400;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [brand]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(brand.tailwind_config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportPDF = async () => {
    if (!contentRef.current) return;
    setIsExporting(true);

    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const innerWidth = pageWidth - (margin * 2);

      // Helper for Header/Footer
      const drawFrame = (pageNumber: number, sectionTitle: string) => {
        pdf.setDrawColor(24, 24, 27);
        pdf.setLineWidth(0.5);
        pdf.line(margin, 15, pageWidth - margin, 15);
        pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`${brand.name.toUpperCase()} // BRAND GUIDELINES`, margin, 12);
        pdf.text(sectionTitle.toUpperCase(), pageWidth - margin, 12, { align: 'right' });

        pdf.setFont('helvetica', 'normal');
        pdf.text(`© ${new Date().getFullYear()} IDENTITY_SYNTHESIS_ENGINE`, margin, pageHeight - 10);
        pdf.text(`PAGE ${pageNumber}`, pageWidth - margin, pageHeight - 10, { align: 'right' });
      };

      // 1. COVER PAGE
      pdf.setFillColor(24, 24, 27); 
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
      
      // Grid Background for Cover
      pdf.setDrawColor(40, 40, 45);
      pdf.setLineWidth(0.1);
      for (let x = 0; x < pageWidth; x += 10) pdf.line(x, 0, x, pageHeight);
      for (let y = 0; y < pageHeight; y += 10) pdf.line(0, y, pageWidth, y);

      pdf.setTextColor(255, 255, 255);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(60);
      const nameLines = pdf.splitTextToSize(brand.name.toUpperCase(), innerWidth);
      pdf.text(nameLines, margin + 10, pageHeight / 3);
      
      pdf.setFontSize(14);
      pdf.setTextColor(180, 180, 180);
      pdf.setFont('helvetica', 'normal');
      pdf.text(brand.tagline.toUpperCase(), margin + 10, (pageHeight / 3) + (nameLines.length * 22) + 5);
      
      pdf.setDrawColor(255, 255, 255);
      pdf.setLineWidth(1.5);
      pdf.line(margin + 10, pageHeight - 50, pageWidth - margin - 10, pageHeight - 50);
      
      pdf.setFontSize(10);
      pdf.setTextColor(255, 255, 255);
      pdf.text('CONFIDENTIAL STRATEGIC ASSET', margin + 10, pageHeight - 40);
      pdf.text(`ISSUED: ${new Date().toLocaleDateString()}`, pageWidth - margin - 10, pageHeight - 40, { align: 'right' });

      // 2. STRATEGY PAGE (Mission, Vision, Values)
      pdf.addPage();
      drawFrame(2, '01_Brand_Strategy');
      
      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(24);
      pdf.text('BRAND STRATEGY', margin, 40);
      
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('THE CORE ESSENCE AND FUTURE DIRECTION', margin, 46);

      // Mission
      pdf.setFillColor(248, 248, 250);
      pdf.rect(margin, 60, innerWidth, 40, 'F');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text('MISSION_STATEMENT', margin + 10, 70);
      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'italic');
      const missionLines = pdf.splitTextToSize(`"${brand.mission}"`, innerWidth - 20);
      pdf.text(missionLines, margin + 10, 80);

      // Vision
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('VISION_DIRECTION', margin, 120);
      pdf.setTextColor(80, 80, 80);
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      const visionLines = pdf.splitTextToSize(brand.vision, innerWidth);
      pdf.text(visionLines, margin, 128);

      // Values
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'bold');
      pdf.text('CORE_VALUES', margin, 160);
      
      brand.values.forEach((value, index) => {
        const y = 175 + (index * 15);
        pdf.setFillColor(24, 24, 27);
        pdf.rect(margin, y - 5, 8, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(6);
        pdf.text(`0${index + 1}`, margin + 2.5, y + 0.5);
        
        pdf.setTextColor(24, 24, 27);
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(value.toUpperCase(), margin + 15, y + 1);
      });

      // 3. VISUAL IDENTITY (Tone, Palette)
      pdf.addPage();
      drawFrame(3, '02_Visual_Identity');

      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(24);
      pdf.text('VISUAL SYSTEM', margin, 40);
      
      pdf.setFontSize(10);
      pdf.setTextColor(150, 150, 150);
      pdf.text('TONE, ATMOSPHERE AND COLOR_DYNAMICS', margin, 46);

      // Tone
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text('IDENTITY_TONE', margin, 65);
      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(12);
      pdf.text(`CHARACTER: ${brand.tone.toUpperCase()}`, margin, 72);
      pdf.text(`AUDIENCE: ${brand.target_audience.toUpperCase()}`, margin, 78);

      // Color Palette (Manual Drawing for Sharpness)
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text('COLOR_SPECIFICATIONS', margin, 100);

      const colors = [
        { name: 'Primary', hex: brand.colors.primary },
        { name: 'Secondary', hex: brand.colors.secondary },
        { name: 'Accent', hex: brand.colors.accent },
        { name: 'Background', hex: brand.colors.background },
      ];

      colors.forEach((color, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const x = margin + (col * (innerWidth / 2 + 5));
        const y = 110 + (row * 50);
        const boxWidth = innerWidth / 2 - 5;
        
        // Color Box
        pdf.setDrawColor(230, 230, 230);
        pdf.rect(x, y, boxWidth, 25);
        const rgb = hexToRgb(color.hex);
        if (rgb) pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        pdf.rect(x, y, boxWidth, 25, 'F');
        
        // Labels
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(7);
        pdf.text(color.name.toUpperCase(), x, y + 32);
        pdf.setTextColor(24, 24, 27);
        pdf.setFontSize(10);
        pdf.text(color.hex.toUpperCase(), x, y + 38);
      });

      // 4. TYPOGRAPHY & IMPLEMENTATION
      pdf.addPage();
      drawFrame(4, '03_Implementation');

      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(24);
      pdf.text('TYPOGRAPHY', margin, 40);

      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text('FONT_SPECIMENS', margin, 60);

      // Heading specimen
      pdf.setTextColor(24, 24, 27);
      pdf.setFontSize(12);
      pdf.text(`PRIMARY: ${brand.typography.heading.family.toUpperCase()}`, margin, 75);
      pdf.setFontSize(40);
      pdf.text('AaBbCcDdEe', margin, 90);
      pdf.setFontSize(10);
      pdf.text('0123456789 !@#$%^&*()', margin, 100);

      // Body specimen
      pdf.setFontSize(12);
      pdf.text(`SECONDARY: ${brand.typography.body.family.toUpperCase()}`, margin, 120);
      pdf.setFontSize(20);
      pdf.text('The quick brown fox jumps...', margin, 132);
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const sampleText = "Design is not just what it looks like and feels like. Design is how it works. A brand is no longer what we tell the consumer it is — it is what consumers tell each other it is.";
      pdf.text(pdf.splitTextToSize(sampleText, innerWidth), margin, 142);

      // Tailwind Config (Last page or bottom)
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(100, 100, 100);
      pdf.setFontSize(8);
      pdf.text('TAILWIND_CONFIGURATION', margin, 175);
      
      pdf.setFillColor(248, 248, 250);
      pdf.rect(margin, 180, innerWidth, 80, 'F');
      pdf.setFont('courier', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(80, 80, 80);
      const codeLines = pdf.splitTextToSize(brand.tailwind_config, innerWidth - 20);
      pdf.text(codeLines.slice(0, 35), margin + 10, 190);

      pdf.save(`BRAND_IDENTITY_${brand.name.toUpperCase().replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('PDF Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportMarkdown = () => {
    setIsExportingMarkdown(true);
    try {
      const markdown = `# ${brand.name.toUpperCase()} — BRAND IDENTITY MANIFEST
Generated on ${new Date().toLocaleDateString()}

## 01. CORE STRATEGY

### MISSION
> "${brand.mission}"

### VISION
${brand.vision}

### CORE VALUES
${brand.values.map((v, i) => `${i + 1}. ${v}`).join('\n')}

---

## 02. IDENTITY NARRATIVE

**Tone/Character:** ${brand.tone}
**Target Audience:** ${brand.target_audience}
**Tagline:** ${brand.tagline}

---

## 03. VISUAL SYSTEM

### 3.1 COLOR PALETTE
- **Primary:** \`${brand.colors.primary}\`
- **Secondary:** \`${brand.colors.secondary}\`
- **Accent:** \`${brand.colors.accent}\`
- **Background:** \`${brand.colors.background}\`
- **Text:** \`${brand.colors.text}\`

### 3.2 TYPOGRAPHY
- **Heading Family:** ${brand.typography.heading.family} (${brand.typography.heading.source})
- **Body Family:** ${brand.typography.body.family} (${brand.typography.body.source})

---

## 04. IMPLEMENTATION

### TAILWIND CONFIGURATION
\`\`\`json
${brand.tailwind_config}
\`\`\`

---
© ${new Date().getFullYear()} IDENTITY_SYNTHESIS_ENGINE // SYSTEM_V1.2
`;

      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DESIGN.md';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Markdown Export failed:', error);
    } finally {
      setIsExportingMarkdown(false);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <div className="space-y-12 pb-32">
      {/* View Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex p-1 bg-zinc-100 border border-zinc-200">
          <button
            onClick={() => setActiveView('guidelines')}
            className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeView === 'guidelines' 
                ? 'bg-zinc-900 text-white shadow-xl translate-y-[-2px]' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Guidelines
          </button>
          <button
            onClick={() => setActiveView('preview')}
            className={`flex items-center gap-3 px-8 py-4 text-[10px] font-black uppercase tracking-widest transition-all ${
              activeView === 'preview' 
                ? 'bg-zinc-900 text-white shadow-xl translate-y-[-2px]' 
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            Live Preview
          </button>
        </div>
      </div>

      {activeView === 'preview' && (
        <div className="flex flex-col items-center mb-12">
          <div className="flex justify-center gap-4 p-2 bg-zinc-100 rounded-xl border border-zinc-200">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'tablet', icon: Tablet, label: 'Tablet' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' },
            ].map((device) => (
              <button
                key={device.id}
                onClick={() => setDeviceSize(device.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest ${
                  deviceSize === device.id 
                    ? 'bg-zinc-900 text-white shadow-lg' 
                    : 'text-zinc-500 hover:bg-zinc-200'
                }`}
              >
                <device.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{device.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeView === 'guidelines' ? (
          <motion.div 
            key="guidelines"
            ref={contentRef}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-32"
          >
            {/* Manifest Header */}
            <div className="flex justify-between items-center border-b-2 border-zinc-900 pb-4">
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-400">Identity_Synthesis_Report</span>
              <span className="text-[10px] font-black uppercase text-zinc-900">v1.2.0_Stable</span>
            </div>

            {/* Brand Header */}
            <section className="relative py-20 overflow-hidden">
              <div className="absolute top-0 right-0 w-1/2 h-full border-r border-zinc-100 -z-10" />
              <div className="space-y-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-px bg-zinc-900" />
                  <span className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-400">Project_Identity_Manifest</span>
                </div>
                
                <div className="space-y-4">
                  <h1 className="text-[clamp(4rem,15vw,12rem)] font-black tracking-tighter text-zinc-900 uppercase leading-[0.75]" style={{ fontFamily: brand.typography.heading.family }}>
                    {brand.name}
                  </h1>
                  <p className="text-3xl text-zinc-900 font-extralight uppercase tracking-[0.15em] leading-tight max-w-4xl" style={{ fontFamily: brand.typography.body.family }}>
                    {brand.tagline}
                  </p>
                </div>

                <div className="flex flex-wrap gap-12 pt-12">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Sector</p>
                    <p className="text-sm font-bold uppercase">{brand.category}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Status</p>
                    <p className="text-sm font-bold uppercase italic">{brand.name.length > 5 ? 'STRATEGIC_READY' : 'CORE_SYNTHETIC'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-zinc-400 tracking-widest">Protocol</p>
                    <p className="text-sm font-bold uppercase">v{ (brand.name.length % 5) + 4 }.{ (brand.tagline.length % 9) }_STABLE</p>
                  </div>
                </div>
              </div>
            </section>
      {/* Core Identity */}
      <section className="space-y-12 bg-white">
        <div className="flex items-center gap-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">Strategy & Core</h2>
          <div className="h-px flex-1 bg-zinc-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-12">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900">Mission Statement</h3>
              <p className="text-3xl font-bold tracking-tight text-zinc-900 leading-tight italic" style={{ fontFamily: brand.typography.body.family }}>
                "{brand.mission}"
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900">Future Vision</h3>
              <p className="text-lg text-zinc-500 font-medium leading-relaxed italic" style={{ fontFamily: brand.typography.body.family }}>
                {brand.vision}
              </p>
            </div>
          </div>
          <div className="bg-zinc-950 p-12 text-white space-y-8 flex flex-col justify-between">
             <div className="space-y-4">
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Core Values</h3>
               <ul className="space-y-4">
                 {brand.values.map((v, i) => (
                   <li key={i} className="flex items-center gap-4 text-xl font-bold tracking-tight group">
                     <span className="text-[10px] font-mono text-zinc-700">0{i+1}</span>
                     {v}
                   </li>
                 ))}
               </ul>
             </div>
             <div className="pt-8 border-t border-zinc-800">
               <span className="text-[9px] font-black tracking-widest text-zinc-700 uppercase">Brand_Spirit_Verified</span>
             </div>
          </div>
        </div>
      </section>

      {/* Visual Persona / Vibe */}
      <section className="space-y-12 bg-white">
        <div className="flex items-center gap-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">Identity Narrative</h2>
          <div className="h-px flex-1 bg-zinc-900" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 p-16 bg-zinc-50 border border-zinc-100 space-y-8">
            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900">The Visual Vibe</h3>
              <p className="text-xl font-medium text-zinc-600 leading-relaxed italic">
                The visual identity of <span className="text-zinc-900 font-bold">{brand.name}</span> is characterized as <span className="text-zinc-900 font-bold">{brand.tone}</span>. 
                Our research indicates it resonates most effectively with <span className="text-zinc-900 font-bold">{brand.target_audience}</span>.
              </p>
            </div>
          </div>
          <div className="lg:col-span-4 aspect-square bg-zinc-900 flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
             {/* Architectural grid overlay for the logo preview */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
             
             <div className="space-y-6 relative z-10">
                <div className="flex justify-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-1 h-3 bg-zinc-700" />
                  ))}
                </div>
                <div className="text-5xl text-white font-black tracking-tighter uppercase leading-[0.85] border-y border-zinc-800 py-6">
                   {brand.name.split(' ').map((word, i) => <div key={i}>{word}</div>)}
                </div>
                <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">Primary_ID_Mark_v1.0</span>
             </div>
          </div>
        </div>
      </section>

      {/* Visual Direction */}
      <section className="space-y-12">
        <div className="flex items-center gap-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">Chromatic_Systems</h2>
          <div className="h-px flex-1 bg-zinc-900" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[
            { name: 'Primary', hex: brand.colors.primary, role: `Brand Core / ${brand.category} Focus` },
            { name: 'Secondary', hex: brand.colors.secondary, role: `Structural Balance / ${brand.tone} Layering` },
            { name: 'Accent', hex: brand.colors.accent, role: 'High-Contrast Interaction Driver' },
            { name: 'Background', hex: brand.colors.background, role: 'Base Surface / Context Layer' },
          ].map((c, i) => {
            const rgb = hexToRgb(c.hex) || { r: 0, g: 0, b: 0 };
            return (
              <div key={i} className="group border border-zinc-200 bg-white p-8 space-y-8 hover:border-zinc-900 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.2em]">{c.name}</span>
                    <h4 className="text-sm font-bold uppercase tracking-tight">{c.role}</h4>
                  </div>
                  <div className="w-1.5 h-1.5 bg-zinc-900" />
                </div>
                
                <div className="flex gap-8 items-center">
                  <div 
                    className="w-32 h-32 border border-zinc-900 shadow-xl group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundColor: c.hex }}
                  />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-zinc-400">HEX</p>
                      <p className="font-mono text-xs font-bold uppercase">{c.hex}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-zinc-400">RGB</p>
                      <p className="font-mono text-xs font-bold uppercase">{rgb.r}, {rgb.g}, {rgb.b}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-zinc-400">LUMINANCE</p>
                      <p className="font-mono text-xs font-bold uppercase">
                        {Math.round((0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255 * 100)}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase text-zinc-400">CONTRAST</p>
                      <p className="font-mono text-xs font-bold uppercase text-green-600">PASSED</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Typography */}
      <section className="space-y-12">
        <div className="flex items-center gap-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">Typographic_Hierarchy</h2>
          <div className="h-px flex-1 bg-zinc-900" />
        </div>
        
        <div className="p-12 space-y-16 bg-white border border-zinc-900">
          <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Typography Specimens</h4>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            <div className="space-y-8">
              <div className="flex justify-between items-baseline mb-4 border-b border-zinc-900 pb-2">
                <span className="text-[10px] font-black tracking-[0.3em] text-zinc-900 uppercase">Primary Display / {brand.typography.heading.family}</span>
                <span className="text-[10px] font-mono text-zinc-400">AA - ZZ</span>
              </div>
              <div className="space-y-6">
                <p className="text-7xl lg:text-8xl text-zinc-900 uppercase tracking-tighter leading-[0.7]" style={{ fontFamily: brand.typography.heading.family }}>
                  Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm Nn Oo Pp Qq Rr Ss Tt Uu Vv Ww Xx Yy Zz
                </p>
                <p className="text-xl font-bold tracking-tight text-zinc-900" style={{ fontFamily: brand.typography.heading.family }}>
                  1234567890 !@#$%^&*()
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="flex justify-between items-baseline mb-4 border-b border-zinc-900 pb-2">
                <span className="text-[10px] font-black tracking-[0.3em] text-zinc-900 uppercase">Secondary Body / {brand.typography.body.family}</span>
                <span className="text-[10px] font-mono text-zinc-400">Regular / Medium / Bold</span>
              </div>
              <div className="space-y-8">
                <p className="text-3xl text-zinc-900 leading-tight italic" style={{ fontFamily: brand.typography.body.family }}>
                  The quick brown fox jumps over the lazy dog.
                </p>
                <div className="space-y-4">
                  <p className="text-sm text-zinc-600 leading-relaxed font-medium" style={{ fontFamily: brand.typography.body.family }}>
                    Design is not just what it looks like and feels like. Design is how it works. A brand is no longer what we tell the consumer it is — it is what consumers tell each other it is.
                  </p>
                  <p className="text-xs text-zinc-400 font-mono">
                    {brand.typography.body.family} / SOURCE: {brand.typography.body.source}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Intelligence Analysis */}
      <section className="space-y-12">
        <div className="flex items-center gap-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">Strategic_Synthesis</h2>
          <div className="h-px flex-1 bg-zinc-900" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 border border-zinc-900 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Market_Positioning</h4>
            <p className="text-sm font-medium leading-relaxed">
              Targeting the <span className="font-bold underline">{brand.target_audience.split(',')[0]}</span> segment by leveraging <span className="font-bold">{brand.tone.toLowerCase()}</span> aesthetics to establish immediate authority in the <span className="font-bold italic">{brand.category}</span> sector.
            </p>
          </div>
          <div className="p-8 border border-zinc-900 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Psychological_Impact</h4>
            <p className="text-sm font-medium leading-relaxed">
              The use of <span className="font-bold" style={{ color: brand.colors.primary }}>{brand.colors.primary}</span> as a high-signal anchor reinforces the brand's core values of <span className="italic">{brand.values[0].toLowerCase()}</span> and <span className="italic">{brand.values[1].toLowerCase()}</span>.
            </p>
          </div>
          <div className="p-8 border border-zinc-900 space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Future_Scalability</h4>
            <p className="text-sm font-medium leading-relaxed">
              Typographic pairing of <span className="font-bold">{brand.typography.heading.family}</span> ensures legacy-level consistency across {brand.category}-specific digital touchpoints and future physical assets.
            </p>
          </div>
        </div>
      </section>

      {/* Tailwind Config Section */}
      <section className="space-y-12">
        <div className="flex items-center gap-6">
          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 shrink-0">Brand Code</h2>
          <div className="h-px flex-1 bg-zinc-900" />
        </div>
        <div className="relative group border border-zinc-900">
          <div className="absolute top-4 right-4 z-10">
            <Button 
              variant="outline"
              size="sm" 
              className="bg-white"
              onClick={copyToClipboard}
            >
              {copied ? 'Copied' : 'Copy Tailwind Config'}
            </Button>
          </div>
          <div className="bg-zinc-950 p-12 overflow-x-auto relative">
            <pre className="font-mono text-xs text-zinc-500 leading-relaxed">
              <code>{brand.tailwind_config}</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Action Bar */}
      <div className="flex flex-wrap justify-between items-center gap-8 pt-12 border-t-4 border-zinc-900 data-[exporting=true]:hidden" data-exporting={isExporting || isExportingMarkdown}>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportPDF}
            isLoading={isExporting}
          >
            Export PDF
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportMarkdown}
            isLoading={isExportingMarkdown}
          >
            Export DESIGN.md
          </Button>
          <Button variant="ghost" size="sm" onClick={onRegenerate}>
            Start Over
          </Button>
        </div>
        <Link to="/pricing">
          <Button size="lg">
            Upgrade for full access
          </Button>
        </Link>
      </div>
    </motion.div>
  ) : (
    <motion.div
      key="preview"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative min-h-[900px] flex justify-center items-start p-4 md:p-24 rounded-[3rem] overflow-hidden bg-[#0a0a0a] border border-zinc-800"
    >
      {/* Dynamic Studio Lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#333,transparent)]" />
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Reflection Floor */}
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />

      <div 
        className="relative z-10 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border-[12px] md:border-[20px] border-zinc-900 rounded-[3rem] md:rounded-[5rem] overflow-hidden flex flex-col"
        style={{ 
          width: deviceSize === 'desktop' ? '100%' : deviceSize === 'tablet' ? '768px' : '390px',
          height: deviceSize === 'desktop' ? 'auto' : '844px',
          maxHeight: deviceSize === 'desktop' ? 'none' : 'min(844px, 80vh)',
          maxWidth: '100%'
        }}
      >
        {/* Dynamic Notch / Camera */}
        {deviceSize !== 'desktop' && (
          <div className="h-14 bg-zinc-900 flex items-center justify-center shrink-0">
            <div className="flex gap-4 items-center">
              <div className="w-20 h-6 bg-zinc-800 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#1a1a1a]" />
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-x-hidden overflow-y-auto scrollbar-hide bg-white translate-z-0">
          <BrandPreview brand={brand} />
        </div>
      </div>

      {/* Device Shadows/Glows */}
      <div 
        className="absolute bottom-12 z-0 blur-[120px] opacity-20 pointer-events-none transition-all duration-1000"
        style={{ 
          width: deviceSize === 'desktop' ? '80%' : deviceSize === 'tablet' ? '600px' : '300px',
          height: '100px',
          backgroundColor: brand.colors.primary 
        }}
      />
    </motion.div>
  )}
</AnimatePresence>
</div>
);
}
