'use client'

import { useState, useEffect } from 'react'
import type { SocialProfile, GroupAssignment, FacebookGroup } from '@/types/database'

interface AddProfileModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: Omit<SocialProfile, 'id' | 'created_at' | 'updated_at'>, fbGroups?: GroupAssignment[]) => Promise<{ success: boolean } | void>
    userEmail: string
    groups: FacebookGroup[]
}

export default function AddProfileModal({ isOpen, onClose, onSubmit, userEmail, groups }: AddProfileModalProps) {
    const [formData, setFormData] = useState({
        user_email: userEmail,
        adspower_id: '',
        name: '',
        gmail: '',
        proxy: '',
        facebook_url: '',
        reddit_url: '',
        youtube_url: '',
        instagram_url: '',
        pinterest_url: '',
        twitter_url: '',
        thread_url: '',
        active: true
    })
    const [fbGroups, setFbGroups] = useState<GroupAssignment[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            // Only include fbGroups if facebook_url is present
            const result = await onSubmit(
                formData, 
                formData.facebook_url ? fbGroups : undefined
            )
            if (result && result.success) {
                onClose()
                setFormData({
                    user_email: userEmail,
                    adspower_id: '',
                    name: '',
                    gmail: '',
                    proxy: '',
                    facebook_url: '',
                    reddit_url: '',
                    youtube_url: '',
                    instagram_url: '',
                    pinterest_url: '',
                    twitter_url: '',
                    thread_url: '',
                    active: true
                })
                setFbGroups([])
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Add New Profile</h2>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {/* Required Fields Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Required Information</h3>
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
                            </div>
                        </div>

                        {/* Social Media Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Social Media Profiles</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Facebook URL</label>
                                <input
                                    type="url"
                                    value={formData.facebook_url || ''}
                                    onChange={(e) => {
                                        const url = e.target.value;
                                        if (url && !url.includes('facebook.com')) {
                                            setError('Please enter a valid Facebook URL');
                                            return;
                                        }
                                        setError(null);
                                        setFormData(prev => ({ ...prev, facebook_url: url }));
                                    }}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="https://facebook.com/..."
                                />
                            </div>

                            {/* Facebook Groups Selection */}
                            {formData.facebook_url && (
                                <div className="space-y-4 border-t pt-4">
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
                                                    <p className="font-medium text-gray-800 dark:text-gray-200">{group.name}</p>
                                                    <a 
                                                        href={group.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="text-sm text-blue-500 hover:underline"
                                                    >
                                                        {group.url}
                                                    </a>
                                                </div>
                                                <select
                                                    value={fbGroups.find(g => g.group_id === group.id)?.role || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value as 'admin' | 'engagement' | ''
                                                        if (!value) {
                                                            setFbGroups(prev => prev.filter(g => g.group_id !== group.id))
                                                        } else {
                                                            setFbGroups(prev => {
                                                                const existing = prev.find(g => g.group_id === group.id)
                                                                if (existing) {
                                                                    return prev.map(g => g.group_id === group.id ? { ...g, role: value } : g)
                                                                }
                                                                return [...prev, { group_id: group.id, role: value }]
                                                            })
                                                        }
                                                    }}
                                                    className="ml-4 p-2 border rounded bg-white dark:bg-gray-700"
                                                >
                                                    <option value="">Select Role</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="engagement">Engagement</option>
                                                </select>
                                            </div>
                                        ))}
                                    </div>
                                    {fbGroups.length === 0 && (
                                        <p className="text-amber-500 text-sm">Please select at least one group and role</p>
                                    )}
                                </div>
                            )}

                            {/* Other social media inputs... */}
                        </div>
                    </div>

                    {/* Footer with buttons - always visible */}
                    <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
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
                            disabled={isSubmitting || (!!formData.facebook_url && fbGroups.length === 0)}
                        >
                            {isSubmitting ? 'Adding...' : 'Add Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 