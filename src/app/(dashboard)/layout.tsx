import {SidebarProvider} from "@/components/ui/sidebar";
import {DashboardNavbar, DashboardSidebar} from "@/modules/dashboard/ui";

import {PropsWithChildren} from "react";

const DashboardLayout = ({children}: PropsWithChildren) => {
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
