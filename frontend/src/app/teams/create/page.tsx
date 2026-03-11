"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { UserPlus, Loader2, Rocket, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CreateTeam() {
    const router = useRouter();
    const [teamName, setTeamName] = useState('');
    const [projectIdea, setProjectIdea] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const res = await axios.post('http://localhost:5000/api/teams',
                { team_name: teamName, project_idea: projectIdea },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            router.push(`/teams/${res.data._id}`);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create team. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link href="/teams" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Teams
            </Link>

            <div className="glass-card overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 border-b border-border/50">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-md">
                            <Rocket className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Start a New Project</h1>
                            <p className="text-muted-foreground">Create a team and recruit teammates</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-lg mb-6 border border-destructive/20 font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">Team Name</label>
                            <input
                                type="text"
                                required
                                value={teamName}
                                onChange={(e) => setTeamName(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white shadow-sm"
                                placeholder="e.g. NextGen AI Hackers"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-foreground">Project Idea</label>
                            <textarea
                                required
                                rows={5}
                                value={projectIdea}
                                onChange={(e) => setProjectIdea(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-border focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white shadow-sm resize-y"
                                placeholder="Describe your project, the problem you're solving, and the tech stack you plan to use..."
                            ></textarea>
                            <p className="text-xs text-muted-foreground mt-2 font-medium">
                                A clear, exciting description will attract top talent to your team.
                            </p>
                        </div>

                        <div className="pt-4 border-t border-border/50 flex justify-end gap-4">
                            <Link
                                href="/teams"
                                className="px-6 py-2.5 rounded-lg font-medium text-foreground hover:bg-secondary transition-colors"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-white px-8 py-2.5 rounded-lg font-semibold hover-lift shadow-md flex items-center justify-center min-w-[160px] disabled:opacity-70 disabled:hover:translate-y-0"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" /> Create Team
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
