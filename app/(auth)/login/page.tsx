"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.SubmitEvent) => {
    e.preventDefault();
    // Logic for auth goes here
    router.push("/customers"); // Redirect to dashboard after login
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Welcome to IMS</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input type="email" placeholder="Email" className="w-full p-3 border rounded" required />
          <input type="password" placeholder="Password" className="w-full p-3 border rounded" required />
          <button type="submit" className="w-full p-3 text-white bg-blue-600 rounded hover:bg-blue-700">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}