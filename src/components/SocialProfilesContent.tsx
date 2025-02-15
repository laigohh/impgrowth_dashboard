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

type SortDirection = 'asc' | 'desc' | null;

export default function SocialProfilesContent({ profiles, groups, userEmail }: SocialProfilesContentProps) {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedProfile, setSelectedProfile] = useState<SocialProfile | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>(null)

    // Add sorting function
    const sortedProfiles = [...profiles].sort((a, b) => {
        if (!sortDirection) return 0;
        
        const aValue = a.adspower_id.toLowerCase();
        const bValue = b.adspower_id.toLowerCase();
        
        if (sortDirection === 'asc') {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });

    // Toggle sort direction
    const handleSort = () => {
        setSortDirection(current => {
            if (current === null) return 'asc';
            if (current === 'asc') return 'desc';
            return null;
        });
    };

    // Add sort indicator component
    const SortIndicator = () => {
        if (!sortDirection) return '↕️';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

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
        <div className="flex-1">
            <header className="bg-white shadow-sm">
                <div className="flex justify-between items-center px-8 py-4">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Social Profiles</h1>
                        <span className="text-gray-500">({profiles?.length || 0} profiles)</span>
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

            <main className="p-8">
                <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th 
                                        onClick={handleSort}
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                    >
                                        AdsPower # <SortIndicator />
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gmail</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proxy</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facebook</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reddit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Youtube</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instagram</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pinterest</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">X</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thread</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedProfiles.map((profile) => (
                                    <tr key={profile.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.adspower_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {profile.gmail || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.proxy || '-'}</td>
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
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
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