import { sql } from "drizzle-orm"

export async function up(db: any): Promise<void> {
    await db.run(sql`
        CREATE TABLE profile_groups (
            profile_id TEXT NOT NULL REFERENCES social_profiles(id),
            group_id INTEGER NOT NULL REFERENCES facebook_groups(id),
            role TEXT NOT NULL CHECK(role IN ('admin', 'engagement')),
            PRIMARY KEY (profile_id, group_id)
        )
    `)
}

export async function down(db: any): Promise<void> {
    await db.run(sql`DROP TABLE profile_groups`)
} 