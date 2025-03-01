"use client"

import * as React from "react"
import { NavMain } from "@/components/layout/app-sidebar/nav-main"
import { NavProjects } from "@/components/layout/app-sidebar/nav-projects"
import { NavUser } from "@/components/layout/app-sidebar/nav-user"
import { TeamSwitcher } from "@/components/layout/app-sidebar/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { data } from "@/components/layout/app-sidebar/data"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
