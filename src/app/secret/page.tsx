import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function Secret() {
    const session = await auth();
    if (!session) return redirect('/profile')

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white shadow-sm">
                    <div className="flex justify-between items-center px-8 py-4">
                        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">{session.user?.name}</span>
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
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 text-sm font-medium">Total Tasks</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 text-sm font-medium">Active Projects</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">4</p>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-gray-500 text-sm font-medium">Social Profiles</h3>
                            <p className="text-3xl font-bold text-gray-900 mt-2">8</p>
                        </div>
                    </div>

                    {/* Recent Activity Section */}
                    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                        <div className="space-y-4">
                            {/* Activity Items */}
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <div>
                                    <p className="text-gray-600">New task added to Project X</p>
                                    <p className="text-sm text-gray-400">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <div>
                                    <p className="text-gray-600">Social profile updated</p>
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