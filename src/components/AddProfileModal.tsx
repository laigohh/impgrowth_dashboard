'use client'

import { useState } from 'react'
import type { SocialProfile } from '@/types/database'

interface AddProfileModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: Omit<SocialProfile, 'id' | 'created_at' | 'updated_at'>) => Promise<{ success: boolean } | void>
    userEmail: string
}

export default function AddProfileModal({ isOpen, onClose, onSubmit, userEmail }: AddProfileModalProps) {
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
    const [error, setError] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsSubmitting(true)

        try {
            const result = await onSubmit(formData)
            if (result && result.success) {
                onClose()
                // Reset form
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
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to add profile')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Add New Profile</h2>
                
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
                                value={formData.proxy || ''}
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
                                value={formData.facebook_url || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, facebook_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reddit URL</label>
                            <input
                                type="url"
                                value={formData.reddit_url || ''}
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
                                value={formData.youtube_url || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, youtube_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Instagram URL</label>
                            <input
                                type="url"
                                value={formData.instagram_url || ''}
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
                                value={formData.pinterest_url || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, pinterest_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Twitter URL</label>
                            <input
                                type="url"
                                value={formData.twitter_url || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, twitter_url: e.target.value }))}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Threads URL</label>
                        <input
                            type="url"
                            value={formData.thread_url || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, thread_url: e.target.value }))}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

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
                            {isSubmitting ? 'Adding...' : 'Add Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 