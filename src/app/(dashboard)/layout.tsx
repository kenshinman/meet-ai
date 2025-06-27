import {SidebarProvider} from "@/components/ui/sidebar";
import {auth} from "@/lib/auth";
import {DashboardNavbar, DashboardSidebar} from "@/modules/dashboard/ui";
import {headers} from "next/headers";
import {redirect} from "next/navigation";

import {PropsWithChildren} from "react";

const DashboardLayout = async ({children}: PropsWithChildren) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/sign-in");
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-screen">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
