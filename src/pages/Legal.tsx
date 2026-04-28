import { motion } from 'motion/react';

export default function Legal() {
  return (
    <div className="flex flex-col gap-0 SwissGridSurface min-h-screen">
      <div className="container-max mx-auto px-6 py-24 space-y-16">
        <header className="border-b-4 border-zinc-900 pb-12">
          <div className="overflow-hidden">
            <motion.h1 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[clamp(2.5rem,10vw,8rem)] font-black tracking-tighter uppercase leading-[0.82]"
            >
              Legal <br /> Information
            </motion.h1>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <section className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Terms of Service</h2>
            <div className="text-zinc-500 font-light leading-relaxed space-y-4">
              <p>By using Brandly, you agree to our structural alignment with professional standards. We provide AI-generated brand identities "as is" with no guarantee of exclusivity or trademark availability.</p>
              <p>Users are responsible for verifying all generated content before commercial deployment. Pro accounts are billed monthly and can be canceled at any time within your structural project dashboard.</p>
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-2xl font-black uppercase tracking-tighter">Privacy Policy</h2>
            <div className="text-zinc-500 font-light leading-relaxed space-y-4">
              <p>We respect your data integrity. Brandly collects only essential information required for project generation and billing. Your prompts are used to train our local context but are never shared with unauthorized third parties.</p>
              <p>Payment information is handled exclusively by Stripe, and we do not store sensitive credit card details on our architectural servers.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
