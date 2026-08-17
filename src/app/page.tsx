import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { NeuralVisualizer } from '@/components/landing/NeuralVisualizer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowRight,
  Sparkles,
  Brain,
  Zap,
  ShieldCheck,
  Calendar,
  Code2,
  Lock,
  Check,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F0] selection:bg-[#F4F6A6] selection:text-[#0B0B0C]">
      {/* Sticky Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#F4F6A6]/10 blur-[140px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121214] border border-white/10 text-xs">
            <Badge variant="yellow">MARIAN 3 Omni</Badge>
            <span className="text-[#A1A1AA]">Next-Gen AI Assistant Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F5F5F0] max-w-4xl mx-auto leading-[1.1]">
            Intelligence, built <br className="hidden sm:block" />
            <span className="font-mono text-[#F4F6A6]">around you.</span>
          </h1>

          <p className="text-base sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto leading-relaxed font-normal">
            MARIAN.AI is an intelligent, high-precision personal AI assistant engineered for deep reasoning, architectural synthesis, and seamless schedule integration.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link href="/chat">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4 text-[#0B0B0C]" />}
              >
                Start using MARIAN
              </Button>
            </Link>
            <a href="#capabilities">
              <Button variant="outline" size="lg">
                Explore Capabilities
              </Button>
            </a>
          </div>

          {/* Neural Canvas Visualizer */}
          <div className="pt-8 max-w-5xl mx-auto">
            <NeuralVisualizer />
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 border-t border-white/10 bg-[#0B0B0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-semibold text-[#F4F6A6] uppercase tracking-wider">
              Engineered Capabilities
            </span>
            <h2 className="text-3xl font-bold tracking-tight">Built for serious work.</h2>
            <p className="text-sm text-[#A1A1AA]">
              Combining state-of-the-art transformer reasoning with enterprise privacy and real-time execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Brain className="w-6 h-6 text-[#F4F6A6]" />,
                title: 'Chain-of-Thought Reasoning',
                desc: 'Multi-step mathematical proofing, architecture design, and precise logic execution without hallucinating key assumptions.',
              },
              {
                icon: <Calendar className="w-6 h-6 text-[#F4F6A6]" />,
                title: 'Google Calendar Sync',
                desc: 'Contextually aware of your schedule. MARIAN organizes meetings, calculates focus blocks, and resolves conflicting commitments.',
              },
              {
                icon: <Zap className="w-6 h-6 text-[#F4F6A6]" />,
                title: 'Low-Latency Streaming',
                desc: 'Engineered on high-throughput C++ inference backends with instant Server-Sent Events token delivery.',
              },
              {
                icon: <Code2 className="w-6 h-6 text-[#F4F6A6]" />,
                title: 'Full-Stack Code Synthesis',
                desc: 'Understands complex component graphs, TypeScript types, API routing patterns, and security best practices.',
              },
              {
                icon: <Lock className="w-6 h-6 text-[#F4F6A6]" />,
                title: 'Zero-Data Retention Option',
                desc: 'Your data is never used to train public base models. Full support for local state isolation and export.',
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-[#F4F6A6]" />,
                title: 'Defensive Security',
                desc: 'Strict input sanitization, token encryption at rest, and zero client-side credential exposure.',
              },
            ].map((cap, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#121214] border border-white/10 space-y-3 hover:border-[#F4F6A6]/40 transition-colors shadow-lg"
              >
                <div className="p-3 rounded-xl bg-[#18181B] border border-white/10 w-fit">
                  {cap.icon}
                </div>
                <h3 className="text-base font-semibold text-[#F5F5F0]">{cap.title}</h3>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Section */}
      <section id="research" className="py-20 border-t border-white/10 bg-[#121214]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge variant="crimson">Research & Innovation</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-[#F5F5F0]">
              The MARIAN Model Architecture
            </h2>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Our research focuses on combining sparse mixture-of-experts attention mechanisms with deterministic memory retrieval. This guarantees that MARIAN retains deep conversational context while generating tokens at sub-30ms speed.
            </p>
            <div className="space-y-3 pt-2">
              {[
                'Sparse Multi-Head Self-Attention with 200,000 Token Window',
                'Deterministic Google Calendar & Tool Execution Protocol',
                'End-to-End Type Safety and Defensive Markdown Sanitization',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-xs text-[#F5F5F0]">
                  <Check className="w-4 h-4 text-[#F4F6A6]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B0B0C] border border-white/10 font-mono text-xs text-[#F4F6A6] space-y-3 shadow-2xl">
            <div className="text-[#71717A] text-[11px] pb-2 border-b border-white/10">
              // MARIAN Transformer Inference Telemetry
            </div>
            <p>
              class MarianInferenceEngine &#123;
              <br />
              &nbsp;&nbsp;public async streamTokens(prompt: string): Promise&lt;Stream&gt; &#123;
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;const tokens = await this.transformer.reason(prompt);
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;return tokens.toSseResponse();
              <br />
              &nbsp;&nbsp;&#125;
              <br />
              &#125;
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-t border-white/10 bg-[#0B0B0C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-mono font-semibold text-[#F4F6A6] uppercase tracking-wider">
              Transparent Pricing
            </span>
            <h2 className="text-3xl font-bold tracking-tight">Invest in intelligence.</h2>
            <p className="text-sm text-[#A1A1AA]">Simple tiers with zero hidden fees.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Starter',
                price: '$0',
                period: 'forever free',
                desc: 'Essential AI chat capabilities for casual explorations.',
                features: ['Access to MARIAN 3 Flash', 'Standard speed', '10,000 tokens/day', 'Community support'],
                cta: 'Start Free',
                variant: 'outline' as const,
              },
              {
                name: 'Pro',
                price: '$20',
                period: 'per month',
                desc: 'Complete suite for power users, developers and researchers.',
                features: ['Access to MARIAN 3 Omni & Reasoning', 'High-throughput stream engine', 'Google Calendar integration', '200,000 token context', 'Priority support'],
                cta: 'Upgrade to Pro',
                variant: 'primary' as const,
                featured: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                period: 'tailored plans',
                desc: 'Dedicated infrastructure with custom model fine-tuning.',
                features: ['Custom MARIAN Transformer deployment', 'Zero-data retention SLA', 'Dedicated API Gateway', '24/7 Enterprise Support'],
                cta: 'Contact Engineering',
                variant: 'outline' as const,
              },
            ].map((tier, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-2xl bg-[#121214] border space-y-6 flex flex-col justify-between relative shadow-xl ${
                  tier.featured ? 'border-[#F4F6A6]' : 'border-white/10'
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#F4F6A6] text-[#0B0B0C] text-[11px] font-semibold uppercase tracking-wider">
                    Most Popular
                  </div>
                )}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#F5F5F0]">{tier.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-mono text-[#F5F5F0]">{tier.price}</span>
                    <span className="text-xs text-[#71717A]">{tier.period}</span>
                  </div>
                  <p className="text-xs text-[#A1A1AA]">{tier.desc}</p>
                  <div className="space-y-2.5 pt-4 border-t border-white/10">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2.5 text-xs text-[#F5F5F0]">
                        <Check className="w-3.5 h-3.5 text-[#F4F6A6]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href="/chat" className="block pt-4">
                  <Button variant={tier.variant} className="w-full justify-center">
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
