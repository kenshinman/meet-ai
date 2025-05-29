"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {authClient} from "@/lib/auth-client";
import {useState} from "react";

export default function Home() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const {data: session} = authClient.useSession();
  const onSubmit = () => {
    if (!email || !name || !password) {
      alert("all fields are required!");
      return;
    }
    authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onError: (context) => {
          console.log(context.error);
          alert("Something went wrong\n" + context.error.message);
        },
        onSuccess: (context) => {
          alert("Success" + context.data);
        },
      }
    );
  };
  const onLogin = () => {
    if (!email || !password) {
      alert("all fields are required!");
      return;
    }
    authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: (context) => {
          console.log(context.error);
          alert("Something went wrong\n" + context.error.message);
        },
        onSuccess: (context) => {
          alert("Success" + context.data);
        },
      }
    );
  };

  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={() => authClient.signOut()}>Sign Out</Button>
      </div>
    );
  }
  return (
    <>
      <div className="max-w-2xs mx-auto py-8 flex flex-col space-y-4">
        <p className="text-xl font-bold">Sign up</p>
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          placeholder="email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={onSubmit}>Create User</Button>
      </div>
      <div className="max-w-2xs mx-auto py-8 flex flex-col space-y-4">
        <p className="text-xl font-bold">Login</p>
        <Input
          placeholder="email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          placeholder="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button onClick={onLogin}>Login</Button>
      </div>
    </>
  );
}
