import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {redirect, RedirectType} from "next/navigation";
import {FC, PropsWithChildren} from "react";

const AuthLayout: FC<PropsWithChildren> = async ({children}) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) redirect("/", RedirectType.replace);
  return (
    <div className="bg-muted flex min-h-screen flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">{children}</div>
    </div>
  );
};

export default AuthLayout;
