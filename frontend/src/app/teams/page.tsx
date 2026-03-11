"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Users, UserPlus, BookOpen, Clock, Loader2, ArrowRight } from 'lucide-react';

export default function Teams() {
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/teams');
                setTeams(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTeams();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Hackathon Teams</h1>
                    <p className="text-muted-foreground">Join an existing team or browse exciting project ideas.</p>
                </div>

                <Link
                    href="/teams/create"
                    className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
                >
                    <UserPlus className="w-5 h-5" /> Create a Team
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map(team => (
                    <div key={team._id} className="glass-card hover-lift flex flex-col h-full border border-border/60">
                        <div className="p-6 flex-grow flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-bold text-foreground line-clamp-1">{team.team_name}</h3>
                                <span className="px-2.5 py-1 bg-secondary text-xs font-semibold rounded-full flex items-center gap-1 shrink-0 text-muted-foreground">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                                </span>
                            </div>

                            <div className="bg-secondary/30 p-3 rounded-xl mb-4 flex-grow border border-border/30">
                                <p className="font-semibold text-sm flex items-center gap-1.5 mb-2 text-foreground/80">
                                    <BookOpen className="w-4 h-4 text-primary" /> Project Idea
                                </p>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {team.project_idea}
                                </p>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm font-medium mb-3 flex items-center gap-1.5 text-foreground/80">
                                    <Users className="w-4 h-4" /> Members ({team.members?.length || 0})
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {team.members?.slice(0, 4).map((m: any) => (
                                        <div key={m._id} className="relative group cursor-help">
                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary border border-primary/20">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {m.name} ({m.role})
                                            </div>
                                        </div>
                                    ))}
                                    {team.members?.length > 4 && (
                                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-muted-foreground border">
                                            +{team.members.length - 4}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-border/50 bg-secondary/20 rounded-b-2xl mt-auto">
                            <Link
                                href={`/teams/${team._id}`}
                                className="w-full py-2 flex items-center justify-center gap-2 text-primary font-medium text-sm hover:underline"
                            >
                                View Details <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                ))}

                {teams.length === 0 && (
                    <div className="col-span-full py-20 text-center glass-card border-dashed">
                        <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-xl font-bold mb-2">No active teams yet</h3>
                        <p className="text-muted-foreground mb-6">Be the first to start a project and invite others!</p>
                        <Link
                            href="/teams/create"
                            className="bg-primary text-white inline-flex px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md items-center gap-2"
                        >
                            <UserPlus className="w-5 h-5" /> Start a Team
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
