import { Link } from 'react-router-dom';
import { Mic, Target, Eye, Shield, Users, TrendingUp } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const values = [
  { icon: Eye, title: 'Transparency', desc: 'We hide nothing. Our sources, methods, and biases are always disclosed.' },
  { icon: Shield, title: 'Integrity', desc: 'Every story is verified through multiple sources before publication.' },
  { icon: Mic, title: 'Voice for Voiceless', desc: 'We amplify stories that mainstream media ignores or suppresses.' },
  { icon: Target, title: 'Accuracy', desc: 'Facts over opinions. Evidence over narratives. Truth over comfort.' },
  { icon: Users, title: 'Community', desc: 'Built by the people, for the people. Citizen journalism at its core.' },
  { icon: TrendingUp, title: 'Impact', desc: 'Our stories create real change - policy reforms, justice, and awareness.' },
];

const stats = [
  { label: 'Stories Published', value: '500+' },
  { label: 'Citizen Reporters', value: '10K+' },
  { label: 'Monthly Readers', value: '2M+' },
  { label: 'Cases Impacted', value: '150+' },
];

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <img src="/assets/logo.png" alt="HardTalkIndia" className="h-20 w-20 rounded-xl mx-auto mb-6" />
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            About <span className="text-gradient">HardTalkIndia</span>
          </h1>
          <p className="text-lg text-hti-gray max-w-2xl mx-auto leading-relaxed">
            The Voice of Unfiltered India. We are India's leading citizen journalism platform,
            dedicated to uncovering ground reality without filters or bias.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-hti-border/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-hti-primary">{s.value}</div>
                <div className="text-sm text-hti-gray mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-hti-gray leading-relaxed mb-4">
                HardTalkIndia was born from a simple belief: every Indian deserves to know the truth
                about what is happening in their country. Not the polished version, not the political
                version - the real, unfiltered ground reality.
              </p>
              <p className="text-hti-gray leading-relaxed mb-4">
                We cover stories that matter: women's safety, police failures, political satire,
                civic issues, racism, and survivor stories. No topic is off-limits, no voice is too small.
              </p>
              <p className="text-hti-gray leading-relaxed">
                Our network of citizen reporters spans across India, bringing us stories from
                metro cities to remote villages. We verify everything, publish what matters, and
                never back down from speaking truth to power.
              </p>
            </div>
            <div className="card-glass rounded-2xl p-8 text-center">
              <div className="text-4xl font-bold text-gradient mb-2">"</div>
              <p className="text-lg text-white leading-relaxed mb-4">
                The duty of journalism is to monitor those in power and give voice to the voiceless.
              </p>
              <div className="w-12 h-0.5 bg-hti-primary mx-auto mb-4" />
              <p className="text-sm text-hti-gray">Our guiding principle</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 border-t border-hti-border/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card-glass rounded-xl p-6 group hover:border-hti-primary/50 transition-all">
                <v.icon className="w-8 h-8 text-hti-primary mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg mb-2">{v.title}</h3>
                <p className="text-sm text-hti-gray leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="card-glass rounded-2xl p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,69,0,0.1)_0%,_transparent_70%)]" />
            <div className="relative space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Be Part of the Change</h2>
              <p className="text-hti-gray max-w-lg mx-auto">
                Whether you want to submit a story, support our work, or join our community -
                there is a place for you at HardTalkIndia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/submit-story" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3.5">
                  Submit a Story
                </Link>
                <Link to="/donate" className="btn-secondary inline-flex items-center justify-center gap-2 px-8 py-3.5">
                  Support Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
