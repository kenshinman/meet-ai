"use client";
import {Button} from "@/components/ui/button";
import {authClient} from "@/lib/auth-client";
import Link from "next/link";

export default function Home() {
  const {data: session} = authClient.useSession();

  if (session)
    return (
      <div className="flex flex-col p-4 gap-y">
        <p>Logged in as {session?.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );

  return (
    <div>
      <h3>
        Welcome{" "}
        <Link href="/sign-in" className="underline underline-offset-4">
          Sign In{" "}
        </Link>
      </h3>
    </div>
  );
}
