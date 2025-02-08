import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile - ImpGrowth Dashboard",
  description: "User profile and authentication",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
} 