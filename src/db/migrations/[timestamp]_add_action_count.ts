import { sql } from "drizzle-orm"

export async function up(db: any): Promise<void> {
    await db.run(sql`
        ALTER TABLE tasks ADD COLUMN action_count INTEGER;
    `)
} 