"use client";

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { Users, BookOpen, Clock, ChevronLeft, Calendar, User, Code } from 'lucide-react';
import Link from 'next/link';

export default function TeamDetail({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const [team, setTeam] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/teams/${unwrappedParams.id}`);
                setTeam(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, [unwrappedParams.id]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!team) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">Team not found</h1>
                <Link href="/teams" className="text-primary hover:underline flex justify-center items-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> Back to Teams
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link href="/teams" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Teams
            </Link>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-8">
                    <div className="glass-card p-8">
                        <div className="flex justify-between items-start mb-6 border-b border-border/50 pb-6">
                            <div>
                                <h1 className="text-3xl font-extrabold mb-2">{team.team_name}</h1>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Created {new Date(team.createdAt).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {team.members.length} Members</span>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 font-bold rounded-full text-sm border border-emerald-500/20 shadow-sm">
                                Recruiting
                            </span>
                        </div>

                        <div className="space-y-6">
                            <section>
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                                    <BookOpen className="w-5 h-5 text-primary" /> Project Idea
                                </h2>
                                <div className="bg-secondary/30 p-6 rounded-2xl border border-border/30">
                                    <p className="text-foreground/90 whitespace-pre-wrap leading-relaxed">
                                        {team.project_idea}
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-8 pt-6 border-t border-border/50 flex flex-wrap gap-4">
                            <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover-lift shadow-md">
                                Request to Join Team
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="glass-card p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 border-b pb-3 border-border/50">
                            <Users className="w-5 h-5" /> Team Members
                        </h2>
                        <div className="space-y-4">
                            {team.members.map((member: any) => (
                                <Link key={member._id} href={`/profile/${member._id}`} className="block">
                                    <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary transition-colors border border-transparent hover:border-border/50 group">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex flex-shrink-0 items-center justify-center font-bold text-lg text-primary shadow-sm">
                                            {member.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">{member.name}</h3>
                                            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                                <User className="w-3 h-3" /> {member.role}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
