'use server'

import { supabaseServer } from "@/lib/supabase-server"
import { revalidatePath } from "next/cache"
import type { SocialProfile } from "@/types/database"
import { auth } from "@/auth"

export async function addProfile(data: Omit<SocialProfile, 'id' | 'created_at' | 'updated_at'>) {
    try {
        // Verify user is authenticated
        const session = await auth()
        if (!session) {
            throw new Error('Not authenticated')
        }

        // Clean up empty strings in optional fields
        const cleanData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                value === '' ? null : value
            ])
        );

        const { error } = await supabaseServer
            .from('social_profiles')
            .insert([cleanData])

        if (error) {
            console.error('Error adding profile:', error)
            throw new Error(error.message)
        }

        revalidatePath('/secret/social-profiles')
        return { success: true }
    } catch (error) {
        console.error('Error in addProfile:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to add profile')
    }
}

export async function deleteProfile(id: string) {
    try {
        // Verify user is authenticated
        const session = await auth()
        if (!session) {
            throw new Error('Not authenticated')
        }

        const { error } = await supabaseServer
            .from('social_profiles')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting profile:', error)
            throw new Error(error.message)
        }

        revalidatePath('/secret/social-profiles')
        return { success: true }
    } catch (error) {
        console.error('Error in deleteProfile:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to delete profile')
    }
}

export async function updateProfile(id: string, data: Partial<SocialProfile>) {
    try {
        // Verify user is authenticated
        const session = await auth()
        if (!session) {
            throw new Error('Not authenticated')
        }

        // Clean up empty strings in optional fields
        const cleanData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                value === '' ? null : value
            ])
        );

        const { error } = await supabaseServer
            .from('social_profiles')
            .update(cleanData)
            .eq('id', id)

        if (error) {
            console.error('Error updating profile:', error)
            throw new Error(error.message)
        }

        revalidatePath('/secret/social-profiles')
        return { success: true }
    } catch (error) {
        console.error('Error in updateProfile:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to update profile')
    }
} 