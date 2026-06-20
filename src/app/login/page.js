
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id);

        router.push("/dashboard");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors p-4">

    <div className="w-full max-w-md rounded-2xl bg-card border border-border p-6 sm:p-8 shadow-xl transition hover:shadow-2xl">

      <h1 className="mb-6 text-center text-2xl sm:text-3xl font-bold">
        Welcome Back
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* EMAIL */}
        <div className="relative">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="peer w-full rounded-lg border border-border bg-background text-foreground px-3 pt-5 pb-2 text-sm sm:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
          />
          <label className="absolute left-3 top-2 text-xs sm:text-sm text-muted-foreground transition-all peer-focus:text-blue-500">
            Email
          </label>
        </div>

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="peer w-full rounded-lg border border-border bg-background text-foreground px-3 pt-5 pb-2 text-sm sm:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-500"
          />
          <label className="absolute left-3 top-2 text-xs sm:text-sm text-muted-foreground">
            Password
          </label>

          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 cursor-pointer text-xs text-blue-600 dark:text-blue-400"
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 p-3 text-sm sm:text-base font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          {loading && (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
          )}
          {loading ? "Logging in..." : "Login"}
        </button>

      </form>

      <p className="mt-5 text-center text-xs sm:text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <span
          onClick={() => router.push("/signup")}
          className="cursor-pointer font-semibold text-blue-600 dark:text-blue-400 hover:underline"
        >
          Sign Up
        </span>
      </p>

    </div>

  </div>
);
}