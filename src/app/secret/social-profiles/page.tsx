import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import type { SocialProfile } from "@/types/database";
import SocialProfilesContent from "@/components/SocialProfilesContent";

export default async function SocialProfiles() {
    const session = await auth();
    if (!session) return redirect('/profile');

    // Fetch social profiles
    const { data: profiles, error } = await supabaseServer
        .from('social_profiles')
        .select('*')
        .eq('user_email', session.user?.email)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
    }

    return <SocialProfilesContent profiles={profiles} userEmail={session.user?.email ?? ''} />;
} 