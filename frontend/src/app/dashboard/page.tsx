"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Users, UserPlus, Zap, ArrowRight, Activity, Code, Star } from 'lucide-react';

export default function Dashboard() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [matches, setMatches] = useState<any[]>([]);
    const [stats, setStats] = useState({ users: 0, teams: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token || !storedUser) {
            router.push('/login');
            return;
        }

        setUser(JSON.parse(storedUser));

        const fetchData = async () => {
            try {
                const [matchesRes, usersRes, teamsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/users/match', { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get('http://localhost:5000/api/users'),
                    axios.get('http://localhost:5000/api/teams')
                ]);

                // Take top 3 recommendations for dashboard
                setMatches(matchesRes.data.slice(0, 3));
                setStats({
                    users: usersRes.data.length,
                    teams: teamsRes.data.length
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-10 animate-fade-in">
                <h1 className="text-3xl font-bold">Welcome back, {user?.name.split(' ')[0]} 👋</h1>
                <p className="text-muted-foreground mt-2">Here's your hackathon networking overview</p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="glass-card p-6 flex flex-col justify-between hover-lift">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-muted-foreground font-medium mb-1">Available Teammates</p>
                            <h2 className="text-3xl font-bold">{stats.users - 1}</h2>
                        </div>
                        <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users className="w-6 h-6" /></div>
                    </div>
                    <Link href="/teammates" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        Browse all <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between hover-lift delay-100">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-muted-foreground font-medium mb-1">Active Teams</p>
                            <h2 className="text-3xl font-bold">{stats.teams}</h2>
                        </div>
                        <div className="p-3 bg-accent/10 rounded-xl text-accent"><Activity className="w-6 h-6" /></div>
                    </div>
                    <Link href="/teams" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        View teams <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="glass-card p-6 flex flex-col justify-between hover-lift delay-200">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-muted-foreground font-medium mb-1">Your Team</p>
                            <h2 className="text-xl font-bold mt-2">Looking for team</h2>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><UserPlus className="w-6 h-6" /></div>
                    </div>
                    <Link href="/teams/create" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                        Create a team <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recommended Teammates */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Zap className="w-5 h-5 text-amber-500" /> Recommended for you
                            </h2>
                            <p className="text-muted-foreground text-sm mt-1">Based on complementary skills and roles</p>
                        </div>
                        <Link href="/teammates" className="text-primary text-sm font-medium hover:underline">See all</Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {matches.length > 0 ? matches.map((match) => (
                            <div key={match._id} className="glass border border-border/50 rounded-2xl p-5 hover:border-primary/50 transition-colors hover:shadow-md">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-lg text-primary">
                                            {match.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold">{match.name}</h3>
                                            <span className="text-xs px-2 py-1 bg-secondary rounded-full font-medium">{match.role}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full text-xs font-bold">
                                        <Star className="w-3 h-3" /> {match.compatibility}% Match
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-1.5 mb-4">
                                    {match.skills.slice(0, 3).map((skill: string) => (
                                        <span key={skill} className="text-xs flex items-center gap-1 px-2 py-1 border border-border/50 rounded-md text-muted-foreground">
                                            <Code className="w-3 h-3" /> {skill}
                                        </span>
                                    ))}
                                    {match.skills.length > 3 && <span className="text-xs px-2 py-1 text-muted-foreground">+{match.skills.length - 3}</span>}
                                </div>

                                <Link href={`/profile/${match._id}`} className="block w-full text-center py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
                                    View Profile
                                </Link>
                            </div>
                        )) : (
                            <div className="col-span-2 p-8 text-center text-muted-foreground bg-secondary/30 rounded-2xl border border-dashed border-border">
                                No recommendations found yet. Connect with others first!
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div>
                    <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
                    <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute -right-10 -top-10 opacity-20"><Zap className="w-40 h-40" /></div>
                        <h3 className="text-2xl font-bold mb-2 relative z-10">Start a Project</h3>
                        <p className="text-white/80 text-sm mb-6 max-w-[200px] relative z-10">
                            Have a great hackathon idea? Create a team and invite others.
                        </p>
                        <Link href="/teams/create" className="inline-flex max-w-max items-center gap-2 bg-white text-primary px-5 py-2.5 rounded-full font-semibold hover:shadow-lg transition-all relative z-10">
                            Create Team <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
