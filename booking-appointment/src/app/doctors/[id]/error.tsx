"use client";
import { useEffect } from "react";

export default function DoctorError({ error }: { error: Error }) {
  useEffect(() => {
    console.error("Doctor page error", error);
  }, [error]);
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        We couldn't load the doctor's profile. Please try again later.
      </p>
      <div className="pt-4">
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          ← Back to Home
        </a>
      </div>
    </main>
  );
}
