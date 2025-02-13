'use server'

import { db } from "@/db/client"
import { socialProfiles } from "@/db/schema"
import { revalidatePath } from "next/cache"
import type { SocialProfile } from "@/types/database"
import { auth } from "@/auth"
import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'

export async function addProfile(data: Omit<SocialProfile, 'id' | 'created_at' | 'updated_at'>) {
    try {
        const session = await auth()
        if (!session) {
            throw new Error('Not authenticated')
        }

        // Clean up empty strings in optional fields and map fields correctly
        const cleanData = Object.fromEntries(
            Object.entries({
                ...data,
                // Ensure user_email is set from userEmail
                user_email: data.user_email || data.userEmail,
            }).map(([key, value]) => [
                key,
                value === '' && key !== 'user_email' && key !== 'adspower_id' && key !== 'name' 
                    ? null 
                    : value
            ])
        );

        await db.insert(socialProfiles).values({
            id: nanoid(),
            ...cleanData,
        });

        revalidatePath('/secret/social-profiles')
        return { success: true }
    } catch (error) {
        console.error('Error in addProfile:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to add profile')
    }
}

export async function deleteProfile(id: string) {
    try {
        const session = await auth()
        if (!session) {
            throw new Error('Not authenticated')
        }

        await db
            .delete(socialProfiles)
            .where(eq(socialProfiles.id, id));

        revalidatePath('/secret/social-profiles')
        return { success: true }
    } catch (error) {
        console.error('Error in deleteProfile:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to delete profile')
    }
}

export async function updateProfile(id: string, data: Partial<SocialProfile>) {
    try {
        const session = await auth()
        if (!session) {
            throw new Error('Not authenticated')
        }

        // Clean up empty strings in optional fields
        const cleanData = Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                value === '' && key !== 'adspower_id' && key !== 'name' 
                    ? null 
                    : value
            ])
        );

        await db
            .update(socialProfiles)
            .set(cleanData)
            .where(eq(socialProfiles.id, id));

        revalidatePath('/secret/social-profiles')
        return { success: true }
    } catch (error) {
        console.error('Error in updateProfile:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to update profile')
    }
} 