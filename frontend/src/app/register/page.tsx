"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Users, Loader2 } from 'lucide-react';

export default function Register() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: '',
        role: 'Frontend',
        skills: '',
        github_username: '',
        bio: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const roles = ['Frontend', 'Backend', 'AI/ML', 'UI/UX', 'DevOps', 'Data Science', 'Other'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Convert skills from comma separated to array before sending
            const payload = {
                ...formData,
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s.length > 0)
            };

            const res = await axios.post('http://localhost:5000/api/auth/signup', payload);

            localStorage.setItem('user', JSON.stringify(res.data));
            localStorage.setItem('token', res.data.token);

            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-secondary/30 py-12">
            <div className="glass-card w-full max-w-2xl p-8 animate-fade-in">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 shadow-lg">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Create an Account</h1>
                    <p className="text-muted-foreground text-sm mt-1">Start finding the perfect team</p>
                </div>

                {error && (
                    <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg mb-6 border border-destructive/20 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Full Name</label>
                            <input
                                type="text" name="name" required
                                value={formData.name} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <input
                                type="email" name="email" required
                                value={formData.email} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                                placeholder="you@university.edu"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password" name="password" required
                                value={formData.password} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">University / College</label>
                            <input
                                type="text" name="university" required
                                value={formData.university} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                                placeholder="State University"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                            <label className="block text-sm font-medium mb-1">Primary Role</label>
                            <select
                                name="role" required
                                value={formData.role} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                            >
                                {roles.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">GitHub Username (Optional)</label>
                            <input
                                type="text" name="github_username"
                                value={formData.github_username} onChange={handleChange}
                                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all bg-white"
                                placeholder="torvalds"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <textarea
                            name="bio" rows={3}
                            value={formData.bio} onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-primary outline-none transition-all bg-white resize-none"
                            placeholder="Tell us about yourself and what you're looking to build..."
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-primary text-white font-semibold py-3 rounded-lg hover-lift hover:shadow-md flex justify-center items-center mt-6 disabled:opacity-70 disabled:hover:translate-y-0"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                    </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
