import { Hero } from "@/components/ui/Hero";
import Link from "next/link";

export default function SignIn() {
  return (
    <>
      <Hero 
        headline="Welcome Back" 
        subtext="Sign in to your account to manage your journey, access MyWalk, and track support."
      />

      <section className="py-section bg-muted min-h-[50vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-md">
          <div className="bg-white p-8 border border-earth-100 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-earth-900 mb-6 text-center">Sign In</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1">Email Address</label>
                <input type="email" className="w-full px-4 py-3 border border-earth-100 rounded focus:ring-2 focus:ring-red-500 outline-none transition-shadow" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-earth-900 mb-1">Password</label>
                <input type="password" className="w-full px-4 py-3 border border-earth-100 rounded focus:ring-2 focus:ring-red-500 outline-none transition-shadow" placeholder="••••••••" />
              </div>
              
              <div className="flex items-center justify-between text-sm mt-2">
                <label className="flex items-center text-muted-foreground cursor-pointer">
                  <input type="checkbox" className="mr-2 rounded text-red-500" />
                  Remember me
                </label>
                <Link href="#" className="flex text-red-500 hover:text-red-800 transition-colors">Forgot password?</Link>
              </div>

              <button type="button" className="w-full bg-earth-900 text-white font-semibold py-3 rounded mt-6 hover:bg-earth-500 transition-colors cursor-pointer">
                Sign In
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-muted-foreground pt-6 border-t border-earth-100">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-red-500 hover:text-red-800 font-medium transition-colors">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
