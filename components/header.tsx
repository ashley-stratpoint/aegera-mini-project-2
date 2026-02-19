'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { SignInButton, SignUpButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '#about' },
    { name: 'Museum', href: '/blogs' },
    { name: 'Contact', href: '#contact' },
]

export const HeroHeader = () => {
    const pathname = usePathname()
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav data-state={menuState && 'active'} className="fixed z-50 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex items-center justify-between py-3 lg:py-4">
                        <div className="flex items-center">
                            <Link href="/" aria-label="home" className="flex items-center space-x-2">
                                <Logo />
                            </Link>
                        </div>

                        <div className="hidden lg:block absolute left-1/2 -translate-x-1/2">
                            <ul className="flex gap-8 text-sm font-medium">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex items-center gap-4">
                            {!mounted ? (
                                <div className="h-8 w-8 rounded-full bg-zinc-100 animate-pulse" />
                            ) : (
                                <div className="flex items-center gap-3">
                                    <SignedIn>
                                        <UserButton afterSignOutUrl="/" />
                                    </SignedIn>
                                    
                                    <SignedOut>
                                        <SignInButton mode="modal">
                                            <Button variant="ghost" size="sm" className="rounded-full hidden md:inline-flex">
                                                Login
                                            </Button>
                                        </SignInButton>
                                        <SignUpButton mode="modal">
                                            <Button size="sm" className="rounded-full">
                                                Get Started
                                            </Button>
                                        </SignUpButton>
                                    </SignedOut>
                                </div>
                            )}
                            <button
                                onClick={() => setMenuState(!menuState)}
                                className="relative z-20 block p-2 lg:hidden">
                                {menuState ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {menuState && (
                    <div className="lg:hidden absolute top-full left-0 w-full p-4 bg-background border-b animate-in fade-in slide-in-from-top-4">
                        <ul className="space-y-4">
                            {menuItems.map((item, index) => (
                                <li key={index}>
                                    <Link 
                                        href={item.href} 
                                        onClick={() => setMenuState(false)}
                                        className="block text-lg font-medium"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
        </header>
    )
}