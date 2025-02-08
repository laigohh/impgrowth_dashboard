import { auth, signIn, signOut } from "@/auth"
 
export default async function SignIn() {
    const session = await auth();
    const user = session?.user

    return user ? (
        <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome {user.name}</h1>
            <form
                action={async () => {
                    "use server";
                    await signOut();
                }}
            >
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                    Sign Out
                </button>
            </form>
        </div>
    ) : (
        <div className="text-center space-y-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">You are not authenticated. Click below to Sign In</h1>
            <form
                action={async () => {
                    "use server";
                    await signIn("Google", {redirectTo: '/secret'});
                }}
            >
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
                    Sign In
                </button>
            </form>
        </div>
    );
}