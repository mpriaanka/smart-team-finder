"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, UserPlus, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        // Check local storage for user object
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        window.location.href = '/';
    };

    const navLinks = user ? [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, primary: false },
        { name: 'Find Teammates', path: '/teammates', icon: Users, primary: false },
        { name: 'Teams', path: '/teams', icon: UserPlus, primary: false },
    ] : [
        { name: 'Log In', path: '/login', icon: null, primary: false },
        { name: 'Sign Up', path: '/register', icon: null, primary: true },
    ];

    return (
        <nav className="fixed w-full z-50 glass top-0 left-0 border-b border-border/40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-gradient">Smart Team Finder</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-2 
                  ${link.primary ? 'bg-gradient-primary px-4 py-2 rounded-full hover:shadow-md hover-lift' : ''}
                  ${pathname === link.path && !link.primary ? 'text-primary' : 'text-muted-foreground'}
                `}
                            >
                                {link.icon && <link.icon className="w-4 h-4" />}
                                {link.name}
                            </Link>
                        ))}

                        {user && (
                            <div className="flex items-center gap-4 ml-4 border-l pl-4 border-border">
                                <Link href={`/profile/${user._id}`}>
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold cursor-pointer hover:bg-primary/20 transition">
                                        {user.name.charAt(0)}
                                    </div>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:bg-muted focus:outline-none"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden glass border-b border-border/40 absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`block px-3 py-2 rounded-md text-base font-medium ${pathname === link.path ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted'
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    {link.icon && <link.icon className="w-5 h-5" />}
                                    {link.name}
                                </div>
                            </Link>
                        ))}
                        {user && (
                            <>
                                <Link
                                    href={`/profile/${user._id}`}
                                    onClick={() => setIsOpen(false)}
                                    className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:bg-muted"
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-destructive hover:bg-destructive/10"
                                >
                                    Log Out
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
