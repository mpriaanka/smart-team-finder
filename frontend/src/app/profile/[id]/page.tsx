"use client";

import { useEffect, useState, use } from 'react';
import axios from 'axios';
import { Mail, MapPin, Code, Briefcase, Calendar, ChevronLeft, Github, Star, GitCommit, Search, Layout, Activity } from 'lucide-react';
import Link from 'next/link';

// Helper function to calculate level based on score
const getDeveloperLevel = (score: number) => {
    if (score >= 500) return 'Expert';
    if (score >= 200) return 'Advanced';
    if (score >= 100) return 'Intermediate';
    return 'Beginner';
};

// Helper function for progress bar width
const getProgressWidth = (score: number) => {
    const maxScore = 500;
    const percentage = (score / maxScore) * 100;
    return Math.min(percentage, 100);
};

export default function Profile({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const [userProfile, setUserProfile] = useState<any>(null);
    const [githubData, setGithubData] = useState<any>(null);
    const [githubRepos, setGithubRepos] = useState<any[]>([]);
    const [developerScore, setDeveloperScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/users/${unwrappedParams.id}`);
                const user = res.data;
                setUserProfile(user);

                if (user.github_username) {
                    try {
                        const ghUserRes = await axios.get(`https://api.github.com/users/${user.github_username}`);
                        setGithubData(ghUserRes.data);

                        const ghReposRes = await axios.get(`https://api.github.com/users/${user.github_username}/repos?sort=updated&per_page=6`);
                        setGithubRepos(ghReposRes.data);

                        const totalStars = ghReposRes.data.reduce((acc: number, curr: any) => acc + curr.stargazers_count, 0);

                        const ghEventsRes = await axios.get(`https://api.github.com/users/${user.github_username}/events/public?per_page=30`);
                        let recentCommits = 0;
                        ghEventsRes.data.forEach((event: any) => {
                            if (event.type === 'PushEvent') {
                                recentCommits += event.payload.commits.length;
                            }
                        });

                        const totalRepos = ghUserRes.data.public_repos;
                        const score = (recentCommits * 2) + (totalRepos * 5) + (totalStars * 3);
                        setDeveloperScore(score);
                    } catch (ghErr) {
                        console.error("Failed to fetch GitHub data:", ghErr);
                    }
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [unwrappedParams.id]);

    if (loading) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold mb-4">User not found</h1>
                <Link href="/teammates" className="text-primary hover:underline flex justify-center items-center gap-2">
                    <ChevronLeft className="w-4 h-4" /> Back to teammates
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link href="/teammates" className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary mb-8 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
            </Link>

            <div className="glass-card overflow-hidden">
                {/* Banner */}
                <div className="h-32 sm:h-48 bg-gradient-primary w-full relative">
                    <div className="absolute -bottom-12 sm:-bottom-16 left-8">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-slate-900 bg-white flex items-center justify-center shadow-lg">
                            <span className="text-4xl sm:text-5xl font-bold text-primary">{userProfile.name.charAt(0)}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-16 sm:pt-20 px-8 pb-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold mb-1">{userProfile.name}</h1>
                            <p className="text-primary font-medium flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> {userProfile.role}
                            </p>
                        </div>
                        <a
                            href={`mailto:${userProfile.email}`}
                            className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
                        >
                            <Mail className="w-4 h-4" /> Contact
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                        <div className="md:col-span-2 space-y-8">
                            <section>
                                <h2 className="text-xl font-bold mb-4 border-b pb-2">About Me</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    {userProfile.bio || "This user hasn't added a bio yet."}
                                </p>
                            </section>

                            {/* GitHub Integration Section */}
                            {githubData && (
                                <section className="mt-8">
                                    <div className="flex items-center gap-2 mb-4 border-b pb-2">
                                        <Github className="w-6 h-6" />
                                        <h2 className="text-xl font-bold">GitHub Activity</h2>
                                    </div>

                                    {/* Developer Score Card */}
                                    <div className="bg-secondary/40 rounded-xl p-6 border border-border/50 mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">Developer Score</p>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold text-primary">{developerScore}</span>
                                                    <span className="text-sm font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                                        Level: {getDeveloperLevel(developerScore)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Activity className="w-10 h-10 text-primary/20" />
                                        </div>

                                        <div className="w-full bg-border rounded-full h-2.5 mt-4">
                                            <div
                                                className="bg-primary h-2.5 rounded-full transition-all duration-1000 ease-out"
                                                style={{ width: `${getProgressWidth(developerScore)}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                            <span>Beginner</span>
                                            <span>Intermediate</span>
                                            <span>Advanced</span>
                                            <span>Expert</span>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border/50 text-center">
                                            <div>
                                                <p className="text-2xl font-semibold">{githubData.public_repos}</p>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Repos</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold">{githubData.followers}</p>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Followers</p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-semibold">
                                                    {githubRepos.reduce((acc, curr) => acc + curr.stargazers_count, 0)}
                                                </p>
                                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Stars</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Repositories */}
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <Layout className="w-5 h-5 text-muted-foreground" />
                                        Recent Projects
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {githubRepos.map((repo) => (
                                            <a
                                                key={repo.id}
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="block p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors bg-card hover:shadow-sm"
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-semibold text-primary truncate pr-4" title={repo.name}>{repo.name}</h4>
                                                    {repo.stargazers_count > 0 && (
                                                        <span className="flex items-center gap-1 text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                                            {repo.stargazers_count}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                                                    {repo.description || "No description provided."}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs font-medium">
                                                    {repo.language && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="w-2 h-2 rounded-full bg-primary/60"></span>
                                                            {repo.language}
                                                        </span>
                                                    )}
                                                    <span className="text-muted-foreground flex items-center gap-1">
                                                        <GitCommit className="w-3 h-3" /> Updated {new Date(repo.updated_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-bold mb-4 border-b pb-2">Skills</h2>
                            <div className="flex flex-wrap gap-2">
                                {userProfile.skills.map((skill: string) => (
                                    <span key={skill} className="px-3 py-1.5 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg border border-border/50 flex items-center gap-2">
                                        <Code className="w-4 h-4 text-muted-foreground" /> {skill}
                                    </span>
                                ))}
                                {userProfile.skills.length === 0 && (
                                    <p className="text-muted-foreground italic">No skills listed.</p>
                                )}
                            </div>
                        </section>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-secondary/50 rounded-2xl p-6 border border-border/50">
                            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">Details</h3>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">University</p>
                                        <p className="text-sm text-muted-foreground">{userProfile.university}</p>
                                    </div>
                                </div>

                                {userProfile.github_username && (
                                    <div className="flex items-start gap-3">
                                        <Github className="w-5 h-5 text-muted-foreground mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium">GitHub Profile</p>
                                            <a
                                                href={`https://github.com/${userProfile.github_username}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-primary hover:underline flex items-center gap-1"
                                            >
                                                @{userProfile.github_username}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium">Joined</p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(userProfile.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
