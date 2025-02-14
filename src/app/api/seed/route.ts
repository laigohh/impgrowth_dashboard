import { seedFacebookGroups } from "@/app/actions/groups"

// Add dynamic config to prevent static generation
export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        await seedFacebookGroups()
        return new Response('Seeded successfully')
    } catch (error) {
        // Add better error handling
        console.error('Seed error:', error)
        return new Response(
            JSON.stringify({ 
                error: error instanceof Error ? error.message : 'Failed to seed database' 
            }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }
} 