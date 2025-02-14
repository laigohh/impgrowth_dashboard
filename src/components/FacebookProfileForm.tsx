'use client'

import { useState } from 'react'
import type { FacebookGroup } from '@/types/database'

interface GroupAssignment {
  group_id: number;
  role: 'admin' | 'engagement';
}

interface FacebookProfileFormProps {
  groups: FacebookGroup[];
  onSubmit: (data: {
    profile_name: string;
    facebook_type: 'admin' | 'engagement';
    groups: GroupAssignment[];
  }) => Promise<void>;
}

const FacebookTypeSelect = ({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (value: 'admin' | 'engagement') => void;
}) => (
  <select 
    value={value} 
    onChange={(e) => onChange(e.target.value as 'admin' | 'engagement')}
    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
  >
    <option value="admin">Admin Account</option>
    <option value="engagement">Engagement Account</option>
  </select>
);

const GroupSelector = ({ 
  groups, 
  selected, 
  onSelect 
}: { 
  groups: FacebookGroup[]; 
  selected: GroupAssignment[]; 
  onSelect: (selection: GroupAssignment[]) => void;
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {groups.map((group) => (
      <label key={group.id} className="flex items-center space-x-2 p-3 border rounded-md dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
        <input
          type="checkbox"
          checked={selected.some(s => s.group_id === group.id)}
          onChange={(e) => {
            const newSelection = e.target.checked
              ? [...selected, { group_id: group.id, role: 'admin' as const }]
              : selected.filter(s => s.group_id !== group.id);
            onSelect(newSelection);
          }}
          className="rounded text-blue-500 focus:ring-blue-500"
        />
        <div className="flex-1">
          <p className="font-medium dark:text-white">{group.name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{group.url}</p>
        </div>
        {selected.some(s => s.group_id === group.id) && (
          <select
            value={selected.find(s => s.group_id === group.id)?.role}
            onChange={(e) => {
              const role = e.target.value as 'admin' | 'engagement';
              const newSelection = selected.map(s => 
                s.group_id === group.id ? { ...s, role } : s
              );
              onSelect(newSelection);
            }}
            className="text-sm p-1 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="admin">Admin</option>
            <option value="engagement">Engagement</option>
          </select>
        )}
      </label>
    ))}
  </div>
);

export default function FacebookProfileForm({ groups, onSubmit }: FacebookProfileFormProps) {
  const [profileName, setProfileName] = useState('')
  const [facebookType, setFacebookType] = useState<'admin' | 'engagement'>('admin')
  const [selectedGroups, setSelectedGroups] = useState<GroupAssignment[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      if (!profileName.trim()) {
        throw new Error('Profile name is required')
      }

      if (selectedGroups.length === 0) {
        throw new Error('Please select at least one group')
      }

      await onSubmit({
        profile_name: profileName,
        facebook_type: facebookType,
        groups: selectedGroups
      })

      // Reset form
      setProfileName('')
      setFacebookType('admin')
      setSelectedGroups([])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Profile Name*
        </label>
        <input
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Account Type*
        </label>
        <FacebookTypeSelect value={facebookType} onChange={setFacebookType} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Select Groups*
        </label>
        <GroupSelector
          groups={groups}
          selected={selectedGroups}
          onSelect={setSelectedGroups}
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Profile'}
        </button>
      </div>
    </form>
  )
} 