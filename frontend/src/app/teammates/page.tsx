"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import { Search, Filter, Star, Code, MapPin, Loader2 } from 'lucide-react';

export default function Teammates() {
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const roles = ['Frontend', 'Backend', 'AI/ML', 'UI/UX', 'DevOps', 'Data Science'];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        const fetchMatches = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/match', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [router]);

    // Client-side filtering
    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.skills.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter ? u.role === roleFilter : true;
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-background min-h-[calc(100vh-4rem)]">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Find Teammates</h1>
                    <p className="text-muted-foreground">Discover verified students with complementary skills</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search skills or name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-full bg-white focus:ring-2 focus:ring-primary outline-none"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="pl-10 pr-8 py-2 border rounded-full bg-white focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                        >
                            <option value="">All Roles</option>
                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {filteredUsers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                        <div key={user._id} className="glass-card overflow-hidden hover-lift flex flex-col h-full">
                            <div className="p-6 flex-grow">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-primary text-xl font-bold border border-primary/20">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg leading-tight">{user.name}</h3>
                                            <p className="text-sm font-medium text-primary">{user.role}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 p-2 rounded-xl text-xs font-bold ring-1 ring-emerald-500/20 shadow-sm">
                                        <Star className="w-4 h-4 mb-0.5 fill-current" />
                                        {user.compatibility}%
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                    <MapPin className="w-4 h-4" /> {user.university}
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm text-foreground/80 line-clamp-2 min-h-[40px]">
                                        {user.bio || "No bio provided."}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {user.skills.slice(0, 4).map((skill: string) => (
                                        <span key={skill} className="px-2.5 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-md border border-border/50 flex items-center gap-1">
                                            <Code className="w-3 h-3 text-muted-foreground" /> {skill}
                                        </span>
                                    ))}
                                    {user.skills.length > 4 && (
                                        <span className="px-2.5 py-1 bg-secondary/50 text-muted-foreground text-xs font-medium rounded-md border border-border/30">
                                            +{user.skills.length - 4}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="p-4 border-t border-border/50 bg-secondary/30 mt-auto">
                                <Link href={`/profile/${user._id}`} className="w-full flex justify-center py-2 bg-white dark:bg-slate-800 border shadow-sm rounded-lg text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-colors">
                                    View Full Profile
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center">
                    <div className="inline-flex w-16 h-16 rounded-full bg-secondary items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">No teammates found</h2>
                    <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
            )}
        </div>
    );
}
