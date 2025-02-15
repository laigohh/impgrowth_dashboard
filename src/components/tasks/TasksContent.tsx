'use client'

import { useState } from 'react'
import { completeTask, generateDailyTasks } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FacebookAdminTasks from './facebook/AdminTasks'
import type { Task, Profile } from '@/types/database'
// We'll add EngagementTasks later when implemented
// import FacebookEngagementTasks from './facebook/EngagementTasks'

interface TasksContentProps {
    profiles: Profile[]
}

function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array]
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]
    }
    return newArray
}

export default function TasksContent({ profiles }: TasksContentProps) {
    const router = useRouter()
    const [loading, setLoading] = useState<string | null>(null)
    const [expandedProfiles, setExpandedProfiles] = useState<Record<string, boolean>>({})
    const [randomizedTasks, setRandomizedTasks] = useState<Record<string, Task[]>>({})

    const handleCompleteTask = async (taskId: string) => {
        try {
            setLoading(taskId)
            await completeTask(taskId)
            router.refresh()
        } catch (error) {
            console.error('Error completing task:', error)
            alert('Failed to complete task')
        } finally {
            setLoading(null)
        }
    }

    const toggleProfile = (profileId: string) => {
        if (!expandedProfiles[profileId]) {
            // When expanding, randomize the tasks
            const profileTasks = profiles.find(p => p.profile_id === profileId)?.tasks || []
            setRandomizedTasks(prev => ({
                ...prev,
                [profileId]: shuffleArray(profileTasks)
            }))
        }
        
        setExpandedProfiles(prev => ({
            ...prev,
            [profileId]: !prev[profileId]
        }))
    }

    const handleGenerateTasks = async () => {
        try {
            setLoading('generating')
            await generateDailyTasks()
            router.refresh()
        } catch (error) {
            console.error('Error generating tasks:', error)
            alert('Failed to generate tasks')
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="p-8">
            <div className="container mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
                    <button
                        onClick={handleGenerateTasks}
                        disabled={loading === 'generating'}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                    >
                        {loading === 'generating' ? 'Generating...' : 'Generate Tasks'}
                    </button>
                </div>

                <div className="grid gap-4">
                    {profiles.map(profile => {
                        const tasks = randomizedTasks[profile.profile_id] || profile.tasks

                        return (
                            <div
                                key={profile.profile_id}
                                className="bg-white rounded-lg shadow overflow-hidden"
                            >
                                {/* Profile Header - Always visible */}
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

                                {/* Tasks List */}
                                {expandedProfiles[profile.profile_id] && (
                                    <div className="p-4 border-t border-gray-100">
                                        <FacebookAdminTasks 
                                            tasks={tasks}
                                            onComplete={handleCompleteTask}
                                            loading={loading}
                                        />
                                        
                                        {/* We'll add this when implemented */}
                                        {/* <FacebookEngagementTasks 
                                            tasks={tasks}
                                            onComplete={handleCompleteTask}
                                            loading={loading}
                                        /> */}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {profiles.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No pending tasks. Click "Generate Tasks" to create new tasks.
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
} 