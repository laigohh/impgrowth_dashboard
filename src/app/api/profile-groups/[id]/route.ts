import { db } from "@/db/client"
import { profileGroups } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/auth"

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth()
        if (!session) {
            return new Response('Unauthorized', { status: 401 })
        }

        const assignments = await db
            .select()
            .from(profileGroups)
            .where(eq(profileGroups.profile_id, params.id))

        return new Response(JSON.stringify(assignments), {
            headers: {
                'Content-Type': 'application/json',
            },
        })
    } catch (error) {
        console.error('Error fetching group assignments:', error)
        return new Response(
            JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Failed to fetch group assignments' 
            }), 
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
    }
} 