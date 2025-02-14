'use client'

import { useState, useEffect } from 'react'
import type { FacebookGroup, FBProfile, ProfileGroup } from '@/types/database'

interface FacebookProfileViewProps {
  profile: FBProfile & {
    groups: ProfileGroup[]
  }
}

interface GroupWithDetails extends ProfileGroup {
  group?: FacebookGroup
}

export default function FacebookProfileView({ profile }: FacebookProfileViewProps) {
  const [groups, setGroups] = useState<FacebookGroup[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGroups() {
      try {
        const response = await fetch('/api/groups')
        if (!response.ok) throw new Error('Failed to fetch groups')
        const data = await response.json()
        setGroups(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load groups')
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">Error: {error}</div>

  const groupsWithDetails: GroupWithDetails[] = profile.groups.map(assignment => ({
    ...assignment,
    group: groups.find(g => g.id === assignment.group_id)
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-semibold">{profile.profile_name}</h3>
        <span className={`px-2 py-1 text-sm rounded-full ${
          profile.facebook_type === 'admin' 
            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {profile.facebook_type}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groupsWithDetails.map((assignment) => (
          <div 
            key={assignment.group_id} 
            className="border dark:border-gray-700 p-4 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium dark:text-white">
                  {assignment.group?.name || 'Unknown Group'}
                </p>
                {assignment.group?.url && (
                  <a
                    href={assignment.group.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                  >
                    Visit Group
                  </a>
                )}
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${
                assignment.role === 'admin' 
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                  : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              }`}>
                {assignment.role}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 