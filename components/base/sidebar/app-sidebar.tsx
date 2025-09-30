"use client";
import { useSession } from "next-auth/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { sidebarLinks } from "@/lib/placeholder";
import { NavUser } from "./nav-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AppSidebar() {
  const { data: session } = useSession();
  const baseFileUrl = process.env.NEXT_PUBLIC_FILE_URL;
  const userRoles = session?.user.user_info?.roles.map((r) => r.name) ?? [];
  return (
    <Sidebar side="right">
      <SidebarHeader>
        <div className="w-full border-2 rounded-md flex items-center px-2 py-1 gap-2">
          <Avatar className="h-12 w-12 rounded-lg">
            <AvatarImage src="/imgs/logo.png" alt="/imgs/logo.png" />
            <AvatarFallback className="rounded-lg">Logo</AvatarFallback>
          </Avatar>
          <div className="font-semibold tracking-wider text-sm py-4">
            مركز القمر
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel>qr</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarLinks
                .filter((item) => !item.role || userRoles.includes(item.role))
                .map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            id: session?.user.user_info?.id ?? 0,
            name: session?.user.user_info?.name ?? "Guest",
            email: session?.user.user_info?.email ?? "Guest",
            image: session?.user.user_info?.image
              ? baseFileUrl + session?.user.user_info?.image
              : "/imgs/shadcn-avatar.jpeg",
            roles: session?.user.user_info?.roles ?? [],
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
