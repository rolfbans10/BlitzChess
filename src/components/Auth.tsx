"use client";

import { signIn, signOut, useSession } from "next-auth/react";

const Auth = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <>
          <img
            src={session.user?.image!}
            alt="Avatar"
            className="w-10 h-10 rounded-full"
          />
          <span>{session.user?.name}</span>
          <button
            onClick={() => signOut()}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn("google")}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign in with Google
        </button>
      )}
    </div>
  );
};

export default Auth;
