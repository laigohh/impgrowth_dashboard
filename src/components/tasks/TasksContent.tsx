'use client'

import { useState } from 'react'
import FacebookAdminTasks from './facebook/AdminTasks'
import { generateDailyTasks, completeAllProfileTasks } from '@/app/actions/tasks'
import type { Profile } from '@/types/database'

interface TasksContentProps {
    profiles: Profile[]
}

export default function TasksContent({ profiles }: TasksContentProps) {
    const [expandedProfiles, setExpandedProfiles] = useState<Record<string, boolean>>({})
    const [isGenerating, setIsGenerating] = useState(false)
    const [completingProfile, setCompletingProfile] = useState<string | null>(null)

    const toggleProfile = (profileId: string) => {
        setExpandedProfiles(prev => ({
            ...prev,
            [profileId]: !prev[profileId]
        }))
    }

    const handleGenerateTasks = async () => {
        try {
            setIsGenerating(true)
            await generateDailyTasks()
        } catch (error) {
            console.error('Error generating tasks:', error)
            alert('Failed to generate tasks')
        } finally {
            setIsGenerating(false)
        }
    }

    const handleCompleteProfile = async (profileId: string) => {
        if (!confirm('Are you sure you want to mark all tasks as completed for this profile?')) {
            return
        }

        try {
            setCompletingProfile(profileId)
            await completeAllProfileTasks(profileId)
        } catch (error) {
            console.error('Error completing profile tasks:', error)
            alert('Failed to complete profile tasks')
        } finally {
            setCompletingProfile(null)
        }
    }

    return (
        <>
            <header className="bg-white shadow-sm">
                <div className="px-8 py-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-semibold text-gray-800">Tasks</h1>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">
                                ({profiles.length} profiles with tasks)
                            </span>
                            <button
                                onClick={handleGenerateTasks}
                                disabled={isGenerating}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                            >
                                {isGenerating ? 'Generating...' : 'Generate Daily Tasks'}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="p-8">
                <div className="space-y-6">
                    {profiles.map(profile => (
                        <div 
                            key={profile.profile_id}
                            className="bg-white rounded-lg shadow-sm"
                        >
                            <div className="p-4 flex justify-between items-center">
                                <div 
                                    onClick={() => toggleProfile(profile.profile_id)}
                                    className="flex-1 cursor-pointer hover:bg-gray-50 flex items-center space-x-2"
                                >
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {profile.adspower_id}
                                    </h2>
                                    <span className="text-gray-500">
                                        - {profile.profile_name || 'Unknown Profile'}
                                    </span>
                                    <span className="transform transition-transform duration-200 text-gray-400">
                                        {expandedProfiles[profile.profile_id] ? '▼' : '▶'}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleCompleteProfile(profile.profile_id)}
                                    disabled={completingProfile === profile.profile_id}
                                    className="ml-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 text-sm"
                                >
                                    {completingProfile === profile.profile_id ? 'Completing...' : 'Complete All Tasks'}
                                </button>
                            </div>

                            {expandedProfiles[profile.profile_id] && (
                                <div className="p-4 border-t border-gray-100">
                                    <FacebookAdminTasks 
                                        tasks={profile.tasks}
                                        profileId={profile.profile_id}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </main>
        </>
    )
} 