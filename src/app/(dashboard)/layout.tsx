import {SidebarProvider} from "@/components/ui/sidebar";
import {DashboardSidebar} from "@/modules/dashboard/ui";
import {PropsWithChildren} from "react";

const DashboardLayout = ({children}: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex flex-col h-screen w-scree">{children}</main>
    </SidebarProvider>
  );
};

export default DashboardLayout;
