'use client'

import { useState, useEffect } from 'react'
import type { SocialProfile, FacebookGroup, GroupAssignment } from '@/types/database'
import { db } from '@/db/client'

interface EditProfileModalProps {
    profile: SocialProfile
    groups: FacebookGroup[]
    onClose: () => void
    onSubmit: (id: string, data: Partial<SocialProfile>, fbGroups?: GroupAssignment[]) => Promise<{ success: boolean }>
}

export default function EditProfileModal({ profile, groups, onClose, onSubmit }: EditProfileModalProps) {
    const [formData, setFormData] = useState({
        adspower_id: profile.adspower_id,
        name: profile.name,
        gmail: profile.gmail || '',
        proxy: profile.proxy || '',
        facebook_url: profile.facebook_url || '',
        reddit_url: profile.reddit_url || '',
        youtube_url: profile.youtube_url || '',
        instagram_url: profile.instagram_url || '',
        pinterest_url: profile.pinterest_url || '',
        twitter_url: profile.twitter_url || '',
        thread_url: profile.thread_url || '',
        active: profile.active
    })
    const [fbGroups, setFbGroups] = useState<GroupAssignment[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        async function fetchGroupAssignments() {
            try {
                const response = await fetch(`/api/profile-groups/${profile.id}`)
                if (response.ok) {
                    const data = await response.json()
                    setFbGroups(data.map((g: any) => ({
                        group_id: g.group_id,
                        role: g.role
                    })))
                }
            } catch (error) {
                console.error('Error fetching group assignments:', error)
            }
        }

        if (profile.facebook_url) {
            fetchGroupAssignments()
        }
    }, [profile.id, profile.facebook_url])

    if (!profile) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const result = await onSubmit(
                profile.id, 
                formData,
                formData.facebook_url ? fbGroups : undefined
            )
            if (result && result.success) {
                onClose()
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Edit Profile</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">AdsPower ID*</label>
                            <input
                                type="text"
                                required
                                value={formData.adspower_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, adspower_id: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name*</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gmail</label>
                            <input
                                type="email"
                                value={formData.gmail}
                                onChange={(e) => setFormData(prev => ({ ...prev, gmail: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Proxy</label>
                            <input
                                type="text"
                                value={formData.proxy}
                                onChange={(e) => setFormData(prev => ({ ...prev, proxy: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Facebook URL</label>
                            <input
                                type="url"
                                value={formData.facebook_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reddit URL</label>
                            <input
                                type="url"
                                value={formData.reddit_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, reddit_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">YouTube URL</label>
                            <input
                                type="url"
                                value={formData.youtube_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram URL</label>
                            <input
                                type="url"
                                value={formData.instagram_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, instagram_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pinterest URL</label>
                            <input
                                type="url"
                                value={formData.pinterest_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, pinterest_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter URL</label>
                            <input
                                type="url"
                                value={formData.twitter_url}
                                onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Threads URL</label>
                        <input
                            type="url"
                            value={formData.thread_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, thread_url: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    {formData.facebook_url && (
                        <div className="space-y-4 border-t pt-4 mt-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                                Facebook Groups
                                <span className="text-sm text-gray-500 ml-2">
                                    (Select groups and assign roles)
                                </span>
                            </h3>
                            <div className="space-y-3 max-h-60 overflow-y-auto">
                                {groups.map(group => (
                                    <div 
                                        key={group.id} 
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-800 dark:text-gray-200">
                                                {group.name}
                                            </p>
                                            <div className="flex gap-4 mt-1 text-sm text-gray-500">
                                                <span>
                                                    Admin: {group.admin_count || 0}
                                                </span>
                                                <span>
                                                    Engagement: {group.engagement_count || 0}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`role-${group.id}`}
                                                    value="admin"
                                                    checked={fbGroups.find(g => g.group_id === group.id)?.role === 'admin'}
                                                    onChange={() => {
                                                        setFbGroups(prev => {
                                                            const existing = prev.find(g => g.group_id === group.id)
                                                            if (existing) {
                                                                return prev.map(g => 
                                                                    g.group_id === group.id 
                                                                        ? { ...g, role: 'admin' } 
                                                                        : g
                                                                )
                                                            }
                                                            return [...prev, { group_id: group.id, role: 'admin' }]
                                                        })
                                                    }}
                                                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Admin</span>
                                            </label>
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="radio"
                                                    name={`role-${group.id}`}
                                                    value="engagement"
                                                    checked={fbGroups.find(g => g.group_id === group.id)?.role === 'engagement'}
                                                    onChange={() => {
                                                        setFbGroups(prev => {
                                                            const existing = prev.find(g => g.group_id === group.id)
                                                            if (existing) {
                                                                return prev.map(g => 
                                                                    g.group_id === group.id 
                                                                        ? { ...g, role: 'engagement' } 
                                                                        : g
                                                                )
                                                            }
                                                            return [...prev, { group_id: group.id, role: 'engagement' }]
                                                        })
                                                    }}
                                                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Engagement</span>
                                            </label>
                                            {fbGroups.find(g => g.group_id === group.id) && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFbGroups(prev => prev.filter(g => g.group_id !== group.id))
                                                    }}
                                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                                                    title="Remove selection"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors disabled:opacity-50"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 