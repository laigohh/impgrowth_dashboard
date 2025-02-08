'use client'

import { useState } from 'react'
import Link from 'next/link'
import AddProfileModal from './AddProfileModal'
import { addProfile, deleteProfile, updateProfile } from '@/app/actions/profiles'
import type { SocialProfile } from '@/types/database'
import EditProfileModal from './EditProfileModal'

interface SocialProfilesContentProps {
    profiles: SocialProfile[] | null
    userEmail: string
}

export default function SocialProfilesContent({ profiles, userEmail }: SocialProfilesContentProps) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [editingProfile, setEditingProfile] = useState<SocialProfile | null>(null)

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">ImpGrowth</h2>
                </div>
                <nav className="mt-4">
                    <Link 
                        href="/secret" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        href="/secret/social-profiles" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                    >
                        Social Profiles
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Tasks
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Analytics
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-md">
                    <div className="flex justify-between items-center px-8 py-4">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Social Profiles</h1>
                            <span className="text-gray-500 dark:text-gray-400">({profiles?.length || 0} profiles)</span>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            + Add Profile
                        </button>
                    </div>
                </header>

                {/* Profiles Table */}
                <main className="p-8">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created By</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">AdsPower #</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Gmail</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Proxy</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Facebook</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reddit</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Youtube</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Instagram</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pinterest</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">X</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thread</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {profiles?.map((profile) => (
                                        <tr key={profile.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {profile.user_email.split('@')[0]}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.adspower_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.gmail}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.proxy || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.facebook_url ? '✓' : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.reddit_url ? '✓' : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.youtube_url ? '✓' : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.instagram_url ? '✓' : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.pinterest_url ? '✓' : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.twitter_url ? '✓' : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.thread_url ? '✓' : '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => {
                                                            setEditingProfile(profile)
                                                            setIsEditModalOpen(true)
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button 
                                                        onClick={() => deleteProfile(profile.id)}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <AddProfileModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={addProfile}
                userEmail={userEmail}
            />

            {editingProfile && (
                <EditProfileModal 
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setEditingProfile(null)
                    }}
                    onSubmit={updateProfile}
                    profile={editingProfile}
                />
            )}
        </div>
    )
} 