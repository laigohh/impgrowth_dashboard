import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function SecretLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) return redirect('/profile');

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 overflow-auto">
                {children}
            </div>
        </div>
    );
} 