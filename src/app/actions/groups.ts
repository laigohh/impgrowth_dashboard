'use server'

import { db } from "@/db/client"
import { facebookGroups } from "@/db/schema"
import { revalidatePath } from "next/cache"
import { sql } from "drizzle-orm"

export async function addFacebookGroup(name: string, url: string) {
    try {
        await db.insert(facebookGroups).values({
            name,
            url
        });
        
        revalidatePath('/secret/facebook-groups')
        return { success: true }
    } catch (error) {
        console.error('Error in addFacebookGroup:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to add Facebook group')
    }
}

export async function seedFacebookGroups() {
    try {
        // First check if groups already exist
        const existingGroups = await db
            .select({ count: sql`count(*)` })
            .from(facebookGroups);

        // If groups already exist, skip seeding
        if (existingGroups[0].count > 0) {
            console.log('Groups already seeded, skipping...');
            return { success: true };
        }

        await db.insert(facebookGroups).values([
            { name: 'Digital Faceless Queens', url: 'https://www.facebook.com/groups/461037856544830' },
            { name: 'Women Learning to Lead in Business', url: 'https://www.facebook.com/groups/1114978673633491' },
            { name: 'Women Entrepreneurs & Digital Product Success', url: 'https://www.facebook.com/groups/9362107010471392' },
            { name: 'Digital Marketing / Digital Products Playground', url: 'https://www.facebook.com/groups/1727010741391730' },
            { name: 'Digital Marketing Promo Network', url: 'https://www.facebook.com/groups/527796609857325' },
            { name: 'WFH Moms & Online Hustles', url: 'https://www.facebook.com/groups/1138736687836465' },
            { name: 'Digital Marketing Girl Boss', url: 'https://www.facebook.com/groups/939906811424324' },
            { name: 'Millionaire Mompreneurs Hub', url: 'https://www.facebook.com/groups/1618269535741586' },
            { name: 'Women Entrepreneurs Success Circle', url: 'https://www.facebook.com/groups/614384310936686' },
            { name: 'Women Entrepreneurs in Online Business', url: 'https://www.facebook.com/groups/2063709847400243' },
            { name: 'Women Learning & Growing Together', url: 'https://www.facebook.com/groups/579039344984304' },
            { name: 'The Female Entrepreneur Collective', url: 'https://www.facebook.com/groups/2027722134369108' },
            { name: 'Stay At Home Moms in Business', url: 'https://www.facebook.com/groups/601637519223787' },
            { name: 'Digital Marketing For Growth', url: 'https://www.facebook.com/groups/1586819345309789' },
            { name: 'Digital Marketing - ImpGrowth', url: 'https://www.facebook.com/groups/1146686613679308' }
        ]);
        
        revalidatePath('/secret/facebook-groups')
        return { success: true }
    } catch (error) {
        console.error('Error seeding Facebook groups:', error)
        throw new Error(error instanceof Error ? error.message : 'Failed to seed Facebook groups')
    }
} 