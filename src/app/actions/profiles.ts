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

        // Validate required fields
        if (!data.adspower_id || !data.name) {
            throw new Error('adspower_id and name are required')
        }

        // Clean up empty strings in optional fields
        const cleanData = {
            adspower_id: data.adspower_id,
            name: data.name,
            gmail: data.gmail === '' ? null : data.gmail,
            proxy: data.proxy === '' ? null : data.proxy,
            facebook_url: data.facebook_url === '' ? null : data.facebook_url,
            reddit_url: data.reddit_url === '' ? null : data.reddit_url,
            youtube_url: data.youtube_url === '' ? null : data.youtube_url,
            instagram_url: data.instagram_url === '' ? null : data.instagram_url,
            pinterest_url: data.pinterest_url === '' ? null : data.pinterest_url,
            twitter_url: data.twitter_url === '' ? null : data.twitter_url,
            thread_url: data.thread_url === '' ? null : data.thread_url,
            active: data.active
        };

        await db.insert(socialProfiles).values({
            id: nanoid(),
            ...cleanData
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