import { Check, Star, Zap, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Pricing() {
  const { user } = useAuth();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      name: 'Free',
      priceId: '',
      price: '0',
      description: 'Perfect for exploring the Swiss engine.',
      features: ['Unlimited Brand Generations', 'Standard Export (Tailwind)', '2 Projects Saved', 'Community Support'],
      cta: 'Get Started',
      variant: 'secondary' as const
    },
    {
      name: 'Professional',
      priceId: 'price_pro_placeholder',
      price: '29',
      description: 'Everything you need to launch your brand.',
      features: [
        'Unlimited Saved Projects',
        'PDF Brand Book Export',
        'Figma Variable Sync',
        'Custom Logo Prompts',
        'Priority AI Generation',
        'Premium Font Library'
      ],
      cta: 'Upgrade to Pro',
      variant: 'primary' as const,
      popular: true
    },
    {
      name: 'Agency',
      priceId: 'price_agency_placeholder',
      price: '99',
      description: 'Built for high-volume brand studios.',
      features: [
        'Client Profiles',
        'Custom Brand Guidelines',
        'Team Collaboration',
        'White-label Exports',
        'Unlimited Storage',
        'API Access'
      ],
      cta: 'Start Agency Plan',
      variant: 'outline' as const
    }
  ];

  const handleSubscription = async (plan: typeof plans[0]) => {
    if (plan.price === '0') return; // Handled by standard sign-up
    if (!user) {
      alert('Please sign in to subscribe.');
      return;
    }

    setLoadingPlan(plan.name);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user.uid,
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      
      if (url) window.location.href = url;
    } catch (error: any) {
      console.error('Subscription error:', error);
      alert('Failed to initiate checkout. Please ensure STRIPE_SECRET_KEY is configured.');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="flex flex-col gap-0 SwissGridSurface min-h-screen">
      <div className="container-max mx-auto px-6 py-24 space-y-24">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-b-4 border-zinc-900 pb-12">
          <div className="space-y-4">
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.85, 0, 0.15, 1] }}
                className="text-[clamp(2rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.82]"
              >
                Pricing <br /> Plans
              </motion.h1>
            </div>
            <p className="text-xl text-zinc-500 font-light italic">
              Transparent scaling for founders requiring visual excellence.
            </p>
          </div>
          <div className="hidden lg:block text-right">
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-zinc-400">Currency</span>
            <p className="text-4xl font-black italic tracking-tighter uppercase">USD</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-l border-t border-zinc-900">
          {plans.map((plan, i) => (
            <motion.div 
              key={plan.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col justify-between border-r border-b border-zinc-900 p-12 transition-all duration-700 group hover:bg-zinc-50 ${plan.popular ? 'bg-zinc-50/50' : 'bg-white'}`}
            >
              <div className="space-y-12">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-black text-4xl tracking-tighter uppercase">{plan.name}</h3>
                    {plan.popular && <div className="w-3 h-3 bg-zinc-900" />}
                  </div>
                  <p className="text-zinc-500 text-sm font-light italic">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-2 border-b border-zinc-100 pb-8">
                  <span className="text-6xl font-black italic tracking-tighter">${plan.price}</span>
                  <span className="text-zinc-300 text-[10px] font-black uppercase tracking-widest">/ Month</span>
                </div>

                <div className="space-y-4">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 transition-colors">
                      <div className="w-1.5 h-1.5 bg-zinc-200 group-hover:bg-zinc-900 mt-0.5 transition-colors" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-16">
                <Button 
                  variant={plan.variant === 'primary' ? 'primary' : 'outline'} 
                  className="w-full"
                  onClick={() => handleSubscription(plan)}
                  isLoading={loadingPlan === plan.name}
                >
                  {plan.cta}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row items-center border border-zinc-900 bg-white">
          <div className="flex-1 p-16 space-y-6 border-r border-zinc-900">
            <div className="bg-zinc-900 w-12 h-12 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Enterprise <br /> Synthesis</h2>
            <p className="text-zinc-500 font-light max-w-sm italic">
              Custom AI datasets trained for large-scale physical and digital brand deployment.
            </p>
          </div>
          <div className="p-16 flex flex-wrap items-center gap-16">
            <div className="space-y-1">
              <p className="text-4xl font-black italic tracking-tighter uppercase">99.9%</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">UPTIME_INDEX</p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black italic tracking-tighter uppercase">24/7</p>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">SUPPORT_HUB</p>
            </div>
            <Button variant="outline" size="lg">Contact_Sales</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
