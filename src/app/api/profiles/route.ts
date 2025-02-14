import { db } from "@/db/client"
import { fbProfiles, profileGroups } from "@/db/schema"
import { auth } from "@/auth"
import { eq } from "drizzle-orm"
import type { GroupAssignment } from "@/types/database"
import { sql } from "drizzle-orm"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const { profile_name, facebook_type, groups } = await req.json()

    // Validate input
    if (!profile_name || !facebook_type || !Array.isArray(groups)) {
      return new Response('Invalid input', { status: 400 })
    }

    // Create profile and group assignments in a transaction
    const result = await db.transaction(async (tx) => {
      // Create profile
      const [profile] = await tx
        .insert(fbProfiles)
        .values({
          profile_name,
          facebook_type,
        })
        .returning({ id: fbProfiles.id })

      // Create group assignments
      if (groups.length > 0) {
        await tx
          .insert(profileGroups)
          .values(
            groups.map((g: GroupAssignment) => ({
              profile_id: String(profile.id),
              group_id: g.group_id,
              role: g.role,
            }))
          )
      }

      return profile
    })

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error creating profile:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to create profile' 
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

export async function GET(req: Request) {
  try {
    const session = await auth()
    if (!session) {
      return new Response('Unauthorized', { status: 401 })
    }

    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (id) {
      // Get specific profile with its groups
      const profile = await db
        .select()
        .from(fbProfiles)
        .where(eq(fbProfiles.id, parseInt(id)))
        .limit(1)

      if (!profile.length) {
        return new Response('Profile not found', { status: 404 })
      }

      const groups = await db
        .select()
        .from(profileGroups)
        .where(eq(profileGroups.profile_id, id))

      return new Response(
        JSON.stringify({ ...profile[0], groups }),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Get all profiles
    const profiles = await db.select().from(fbProfiles)
    
    return new Response(JSON.stringify(profiles), {
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Error fetching profiles:', error)
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to fetch profiles' 
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