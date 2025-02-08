import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Secret() {
    const session = await auth();
    if (!session) return redirect('/profile')

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <div className="w-64 bg-white dark:bg-gray-800 shadow-lg">
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">ImpGrowth</h2>
                </div>
                <nav className="mt-4">
                    <Link 
                        href="/secret" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        href="/secret/social-profiles" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Social Profiles
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Tasks
                    </Link>
                    <Link 
                        href="#" 
                        className="block px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        Analytics
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-md">
                    <div className="flex justify-between items-center px-8 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 dark:text-gray-300">{session.user?.name}</span>
                            <img 
                                src={session.user?.image ?? '/default-avatar.png'} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full"
                            />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Stats Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total Tasks</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">12</p>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Projects</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">4</p>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Social Profiles</h3>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">8</p>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {/* Activity Items */}
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300">New task added to Project X</p>
                                    <p className="text-sm text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-gray-600 dark:text-gray-300">Social profile updated</p>
                                    <p className="text-sm text-gray-400">5 hours ago</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}