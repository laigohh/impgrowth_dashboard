'use client'

import { useState } from 'react'
import FacebookAdminTasks from './facebook/AdminTasks'
import { generateDailyTasks } from '@/app/actions/tasks'
import type { Profile } from '@/types/database'

interface TasksContentProps {
    profiles: Profile[]
}

export default function TasksContent({ profiles }: TasksContentProps) {
    const [expandedProfiles, setExpandedProfiles] = useState<Record<string, boolean>>({})
    const [isGenerating, setIsGenerating] = useState(false)

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
                            <div 
                                onClick={() => toggleProfile(profile.profile_id)}
                                className="p-4 cursor-pointer hover:bg-gray-50 flex justify-between items-center"
                            >
                                <div className="flex items-center space-x-2">
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        {profile.adspower_id}
                                    </h2>
                                    <span className="text-gray-500">
                                        - {profile.profile_name || 'Unknown Profile'}
                                    </span>
                                </div>
                                <span className="transform transition-transform duration-200 text-gray-400">
                                    {expandedProfiles[profile.profile_id] ? '▼' : '▶'}
                                </span>
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