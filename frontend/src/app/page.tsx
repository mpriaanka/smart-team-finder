import Link from 'next/link';
import { ArrowRight, Zap, Users, ShieldCheck, Code, Cpu, Layout } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/90 to-white/90 dark:from-slate-900/90 dark:to-slate-900/90 backdrop-blur-sm shadow-xl z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-sm font-medium">Built for Hackathons & Startups</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Find Your <span className="text-gradient">Dream Team.</span> <br className="hidden md:block" /> Build Great Products.
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-muted-foreground mb-10">
            Stop struggling to find teammates. Our smart matching algorithm connects you with students based on complementary skills, roles, and compatibility scores.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="bg-gradient-primary text-white py-4 px-8 rounded-full font-bold text-lg hover-lift shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="glass text-foreground py-4 px-8 rounded-full font-bold text-lg hover-lift hidden sm:flex items-center justify-center"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Smart Team Finder?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We leverage smart compatibility algorithms to find the perfect team for your next hackathon project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-8 hover-lift">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Matching</h3>
              <p className="text-muted-foreground">
                Our algorithm scores teammates based on skills, complementary roles, and shared interests.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-8 hover-lift delay-100">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Build Teams Instantly</h3>
              <p className="text-muted-foreground">
                Create a team or join an existing one with one click. Manage requests and organize seamlessly.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-8 hover-lift delay-200">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3">Verified Profiles</h3>
              <p className="text-muted-foreground">
                Filter by university, connect with verified students, and build a trusted network of builders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles Section */}
      <section className="py-24 bg-secondary/50 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-12">Find Teammates Across Disciplines</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <RoleBadge icon={<Code />} role="Frontend" color="text-blue-500 bg-blue-500/10" />
            <RoleBadge icon={<Users />} role="Backend" color="text-green-500 bg-green-500/10" />
            <RoleBadge icon={<Cpu />} role="AI/ML" color="text-purple-500 bg-purple-500/10" />
            <RoleBadge icon={<Layout />} role="UI/UX" color="text-pink-500 bg-pink-500/10" />
            <RoleBadge icon={<Zap />} role="DevOps" color="text-orange-500 bg-orange-500/10" />
          </div>
        </div>
      </section>
    </div>
  );
}

function RoleBadge({ icon, role, color }: { icon: React.ReactNode, role: string, color: string }) {
  return (
    <div className={`flex items-center gap-3 px-6 py-3 rounded-full font-medium ${color} border border-border/30 hover:-translate-y-1 transition-transform cursor-default shadow-sm`}>
      {icon}
      <span>{role}</span>
    </div>
  );
}
