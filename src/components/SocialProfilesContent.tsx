'use client'

import { useState } from 'react'
import Link from 'next/link'
import AddProfileModal from './AddProfileModal'
import { addProfile, deleteProfile, updateProfile } from '@/app/actions/profiles'
import { createFBProfile } from '@/app/actions/fb-profiles'
import type { SocialProfile, FacebookGroup } from '@/types/database'
import EditProfileModal from './EditProfileModal'


interface SocialProfilesContentProps {
    profiles: SocialProfile[]
    groups: FacebookGroup[]
    userEmail: string
}

// First, let's create a helper component for the social link
const SocialLink = ({ url }: { url: string | undefined | null }) => {
    if (!url) return <span>-</span>;
    
    return (
        <a 
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 cursor-pointer"
            title="Open profile"
        >
            ✓
        </a>
    );
};

export default function SocialProfilesContent({ profiles, groups, userEmail }: SocialProfilesContentProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState<SocialProfile | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleDelete = async (id: string) => {
        try {
            setError(null)
            const result = await deleteProfile(id)
            if (!result.success) {
                throw new Error('Failed to delete profile')
            }
        } catch (err) {
            console.error('Error deleting profile:', err)
            setError(err instanceof Error ? err.message : 'Failed to delete profile')
        }
    }

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
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Social Profiles
                    </Link>
                    <Link 
                        href="/secret/facebook-groups" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Facebook Groups
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
                        <div className="space-x-4">
                            <button
                                onClick={() => setIsAddModalOpen(true)}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Add Profile
                            </button>
                        </div>
                    </div>
                </header>

                {/* Profiles Table */}
                <main className="p-8">
                    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
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
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.adspower_id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                {profile.gmail || '-'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{profile.proxy || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <SocialLink url={profile.facebook_url} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <SocialLink url={profile.reddit_url} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <SocialLink url={profile.youtube_url} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <SocialLink url={profile.instagram_url} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <SocialLink url={profile.pinterest_url} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <SocialLink url={profile.twitter_url} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <SocialLink url={profile.thread_url} />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => {
                                                            setSelectedProfile(profile)
                                                            setIsEditModalOpen(true)
                                                        }}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        ✎
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(profile.id)}
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

            {/* Add Profile Modal */}
            {isAddModalOpen && (
                <AddProfileModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={async (data, fbGroups) => {
                        const result = await addProfile(data)
                        if (result.success && fbGroups && fbGroups.length > 0 && result.id) {
                            await createFBProfile({
                                profile_id: result.id,
                                groups: fbGroups
                            })
                        }
                        return result
                    }}
                    userEmail={userEmail}
                    groups={groups}
                />
            )}

            {/* Edit Profile Modal */}
            {isEditModalOpen && selectedProfile && (
                <EditProfileModal
                    profile={selectedProfile}
                    groups={groups}
                    onClose={() => {
                        setIsEditModalOpen(false)
                        setSelectedProfile(null)
                    }}
                    onSubmit={updateProfile}
                />
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}
        </div>
    )
} 