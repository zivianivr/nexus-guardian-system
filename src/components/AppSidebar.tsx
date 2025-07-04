
import { useState } from "react";
import { 
  Shield, 
  Brain, 
  Settings, 
  Network, 
  Phone, 
  Database,
  Activity,
  Users,
  MessageSquare,
  HardDrive,
  Globe,
  Zap,
  UserCheck
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Activity },
  { title: "Guardian VoIP", url: "/guardian", icon: Shield },
  { title: "Nexus AI", url: "/nexus", icon: Brain },
  { title: "Sistema", url: "/system", icon: Settings },
];

const guardianItems = [
  { title: "Monitoramento", url: "/guardian/monitoring", icon: Network },
  { title: "Provisionamento", url: "/guardian/provisioning", icon: Phone },
  { title: "Telefonia", url: "/guardian/telephony", icon: Phone },
  { title: "Usuários", url: "/guardian/users", icon: UserCheck },
  { title: "Blocos IP", url: "/guardian/ip-blocks", icon: Globe },
  { title: "Backup", url: "/guardian/backup", icon: HardDrive },
  { title: "Suporte", url: "/guardian/support", icon: MessageSquare },
];

const nexusItems = [
  { title: "Chat IA", url: "/nexus/chat", icon: MessageSquare },
  { title: "Auto-Correção", url: "/nexus/auto-correction", icon: Zap },
  { title: "Desenvolvimento", url: "/nexus/development", icon: Brain },
  { title: "Consenso", url: "/nexus/consensus", icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent className="bg-slate-900 text-white">
        {/* Header */}
        {!isCollapsed && (
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-lg font-bold text-white">Guardian VoIP</h1>
                <p className="text-xs text-slate-400">v3.0 & Nexus AI</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Guardian Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Guardian VoIP</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {guardianItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Nexus AI Modules */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-slate-400">Nexus AI</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nexusItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavCls}>
                      <item.icon className="mr-2 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-auto p-4 border-t border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-xs text-slate-400">Sistema Online</span>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-purple-300">Nexus AI Ativo</span>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
