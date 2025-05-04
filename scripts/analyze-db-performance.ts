import { db } from '../src/db/client';
import { socialProfiles, facebookGroups, profileGroups } from '../src/db/schema';
import { sql, eq } from 'drizzle-orm';

/**
 * This script helps analyze database query performance by running the same queries
 * used in the social-profiles page and measuring their execution time.
 * 
 * Run with: npx tsx scripts/analyze-db-performance.ts
 */

async function measureQueryTime<T>(name: string, queryFn: () => Promise<T>): Promise<T> {
  console.log(`Running query: ${name}...`);
  const startTime = performance.now();
  try {
    const result = await queryFn();
    const endTime = performance.now();
    console.log(`✅ Query "${name}" completed in ${(endTime - startTime).toFixed(2)}ms`);
    return result;
  } catch (error) {
    const endTime = performance.now();
    console.error(`❌ Query "${name}" failed after ${(endTime - startTime).toFixed(2)}ms`);
    console.error(error);
    throw error;
  }
}

async function main() {
  console.log('🔍 Analyzing database query performance...\n');

  // Test 1: Total count of profiles
  await measureQueryTime('Count all profiles', async () => {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(socialProfiles);
    console.log(`  Total profiles: ${result[0].count}`);
    return result;
  });

  // Test 2: Group counts
  await measureQueryTime('Group counts', async () => {
    const result = await db
      .select({
        id: facebookGroups.id,
        name: facebookGroups.name,
        url: facebookGroups.url,
        admin_count: sql<number>`
          COUNT(CASE WHEN ${profileGroups.role} = 'admin' THEN 1 END)
        `.as('admin_count'),
        engagement_count: sql<number>`
          COUNT(CASE WHEN ${profileGroups.role} = 'engagement' THEN 1 END)
        `.as('engagement_count'),
      })
      .from(facebookGroups)
      .leftJoin(profileGroups, eq(facebookGroups.id, profileGroups.group_id))
      .groupBy(facebookGroups.id);
    
    console.log(`  Total groups: ${result.length}`);
    return result;
  });

  // Test 3: Paginated profile query
  await measureQueryTime('Paginated profiles (first 10)', async () => {
    const result = await db
      .select()
      .from(socialProfiles)
      .limit(10)
      .offset(0);
    
    console.log(`  Profiles fetched: ${result.length}`);
    return result;
  });

  // Test 4: Alternative query strategy without groupBy
  await measureQueryTime('Alternative group counts (no groupBy)', async () => {
    // Admin counts
    const adminCounts = await db
      .select({
        group_id: profileGroups.group_id,
        count: sql<number>`count(*)`.as('count')
      })
      .from(profileGroups)
      .where(eq(profileGroups.role, 'admin'))
      .groupBy(profileGroups.group_id);
    
    // Engagement counts
    const engagementCounts = await db
      .select({
        group_id: profileGroups.group_id,
        count: sql<number>`count(*)`.as('count')
      })
      .from(profileGroups)
      .where(eq(profileGroups.role, 'engagement'))
      .groupBy(profileGroups.group_id);
    
    // Groups with info
    const groups = await db
      .select()
      .from(facebookGroups);
    
    // Create a map for faster lookups
    const adminCountMap = new Map(adminCounts.map(item => [item.group_id, item.count]));
    const engagementCountMap = new Map(engagementCounts.map(item => [item.group_id, item.count]));
    
    // Combine the results
    const result = groups.map(group => ({
      ...group,
      admin_count: adminCountMap.get(group.id) || 0,
      engagement_count: engagementCountMap.get(group.id) || 0
    }));
    
    console.log(`  Total groups: ${result.length}`);
    return result;
  });

  console.log('\n✨ Analysis complete!');
  console.log('Recommendations:');
  console.log('1. If "Alternative group counts" is faster than "Group counts", consider updating your code to use that approach');
  console.log('2. Indexes have been added to improve query performance');
  console.log('3. Pagination has been implemented to limit data transfer');
  console.log('4. Connection pooling and caching mechanisms have been added');
  
  process.exit(0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
}); 