"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import PageTransition from "@/components/PageTransition";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Simple authentication - replace with real auth
    if (email && password) {
      // Store auth state
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("clientName", email.split("@")[0]);
      router.push("/dashboard");
    } else {
      setError("Please enter email and password");
    }
  };

  return (
    <>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-LDX1BJYQ47"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LDX1BJYQ47');
            `,
          }}
        />
      </head>
      <PageTransition>
        <main className="min-h-screen bg-[var(--background)]">
          <Navigation />

        <section className="pt-32 pb-16 px-6">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
                Client Login
              </h1>
              <p className="text-[var(--text-secondary)]">
                Access your Operations Hub
              </p>
            </div>

            <div className="bg-[var(--card-bg)] rounded-xl p-8 border border-[var(--border)]">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1] transition-colors"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--text-primary)] focus:outline-none focus:border-[#6366F1] transition-colors"
                    placeholder="Enter your password"
                  />
                </div>

                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-[#6366F1] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#5558E3] transition-all hover:scale-105 shadow-lg shadow-[#6366F1]/20"
                >
                  Sign In
                </button>
              </form>

              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-[#6366F1] hover:underline">
                  Forgot your password?
                </a>
              </div>
            </div>
          </div>
        </section>

          <Footer />
        </main>
      </PageTransition>
    </>
  );
}
