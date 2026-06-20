"use client";

import { useEffect, useState } from "react";

export default function ProfilePage() {
const [user, setUser] =
useState(null);

useEffect(() => {
async function fetchUser() {
try {
const token =
localStorage.getItem(
"token"
);


    const response =
      await fetch(
        "/api/profile",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    const data =
      await response.json();

    if (data.success) {
      setUser(data.user);
    }
  } catch (error) {
    console.error(error);
  }
}

fetchUser();


}, []);

if (!user) {
return ( <div className="p-8">
Loading profile... </div>
);
}


return (
  <main className="min-h-screen bg-background text-foreground p-10 transition-colors">

    <h1 className="mb-8 text-3xl font-bold">
      Profile 👤
    </h1>

    <div className="mx-auto max-w-2xl rounded-2xl bg-card border border-border p-10 shadow-sm">

      <div className="space-y-6 text-base">

        <p className="flex justify-between">
          <strong className="text-muted-foreground">
            Name:
          </strong>
          <span className="font-medium text-foreground">
            {user.name}
          </span>
        </p>

        <p className="flex justify-between">
          <strong className="text-muted-foreground">
            Email:
          </strong>
          <span className="font-medium text-foreground">
            {user.email}
          </span>
        </p>

        <p className="flex justify-between">
          <strong className="text-muted-foreground">
            Joined:
          </strong>
          <span className="font-medium text-foreground">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </p>

      </div>

    </div>

  </main>
);
}