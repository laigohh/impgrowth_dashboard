import { seedFacebookGroups } from "@/app/actions/groups"

export async function GET() {
    await seedFacebookGroups()
    return new Response('Seeded successfully')
} 