import { sql } from "drizzle-orm"

export async function up(db: any): Promise<void> {
    await db.run(sql`
        CREATE TABLE facebook_groups (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            url TEXT NOT NULL UNIQUE
        )
    `)
}

export async function down(db: any): Promise<void> {
    await db.run(sql`DROP TABLE facebook_groups`)
} 