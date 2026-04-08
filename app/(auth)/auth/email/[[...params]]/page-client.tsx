"use client";

import Link from "next/link";

import { useEffect, useState } from "react";

export default function EmailVerificationClient() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      const pendingEmail = sessionStorage.getItem("pendingVerificationEmail");
      if (pendingEmail) {
        setEmail(pendingEmail);
        sessionStorage.removeItem("pendingVerificationEmail");
      }
    } catch {}
  }, []);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 text-center">
        <h1 className="text-2xl font-bold">Check your email</h1>
        <p className="text-sm text-gray-600">
          We sent a sign-in link to{" "}
          {email ? (
            <span className="font-medium text-black">{email}</span>
          ) : (
            "your email"
          )}
          .
        </p>
        <p className="text-sm text-gray-600">
          Click the link in the email to sign in. It may take a minute to
          arrive.
        </p>
        <p className="text-sm text-gray-500">
          Check your spam/junk folder if you don&apos;t see it.
        </p>
        <div className="pt-4">
          <Link
            href="/login"
            className="text-sm text-gray-500 underline hover:text-black"
          >
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
