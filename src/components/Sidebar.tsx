'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="w-64 bg-white shadow-lg">
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">ImpGrowth</h2>
                <nav className="space-y-2">
                    <Link 
                        href="/secret" 
                        className={`block p-2 rounded ${pathname === '/secret' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        href="/secret/social-profiles" 
                        className={`block p-2 rounded ${pathname === '/secret/social-profiles' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Profiles
                    </Link>
                    <Link 
                        href="/secret/facebook-groups" 
                        className={`block p-2 rounded ${pathname === '/secret/facebook-groups' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Facebook Groups
                    </Link>
                    <Link 
                        href="/secret/tasks" 
                        className={`block p-2 rounded ${pathname === '/secret/tasks' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                        Tasks
                    </Link>
                </nav>
            </div>
        </div>
    )
} 