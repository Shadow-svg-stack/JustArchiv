import React from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Archive,
  Users,
  Settings,
  LogOut,
  Shield,
  BarChart3,
  Database,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  {
    id: "dashboard",
    label: "Tableau de bord",
    icon: LayoutDashboard,
    roles: ["headmaster", "admin", "editor", "reader"],
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    roles: ["headmaster", "admin", "editor", "reader"],
  },
  {
    id: "categories",
    label: "Catégories",
    icon: Archive,
    roles: ["headmaster", "admin", "editor"],
  },
  {
    id: "users",
    label: "Utilisateurs",
    icon: Users,
    roles: ["headmaster", "admin"],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    roles: ["headmaster", "admin"],
  },
  { id: "admin", label: "Administration", icon: Shield, roles: ["headmaster"] },
  { id: "system", label: "Système", icon: Database, roles: ["headmaster"] },
  {
    id: "settings",
    label: "Paramètres",
    icon: Settings,
    roles: ["headmaster", "admin", "editor", "reader"],
  },
];

const roleLabels = {
  headmaster: "Headmaster",
  admin: "Administrateur",
  editor: "Éditeur",
  reader: "Lecteur",
};

const roleColors = {
  headmaster: "bg-gradient-to-r from-purple-500 to-pink-500",
  admin: "bg-gradient-to-r from-blue-500 to-cyan-500",
  editor: "bg-gradient-to-r from-green-500 to-emerald-500",
  reader: "bg-gradient-to-r from-gray-500 to-slate-500",
};

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme, effectiveTheme } = useTheme();

  if (!user) return null;

  const userInitials = user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      default:
        return Monitor;
    }
  };

  const ThemeIcon = getThemeIcon();

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(user.role),
  );

  return (
    <motion.div
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-3"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-lg">
            <Archive className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">
              JustArchiv
            </h1>
            <p className="text-sm text-sidebar-foreground/60">
              Gestion documentaire
            </p>
          </div>
        </motion.div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-sidebar-border">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sidebar-foreground truncate">
              {user.name}
            </p>
            <Badge
              variant="secondary"
              className={`${roleColors[user.role]} text-white border-0 text-xs`}
            >
              {roleLabels[user.role]}
            </Badge>
          </div>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * (index + 3) }}
            >
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start h-11 px-3 ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                } transition-all duration-200`}
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 w-1 h-6 bg-sidebar-primary rounded-r-full"
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </nav>

      <Separator className="bg-sidebar-border" />

      {/* Footer Actions */}
      <div className="p-2 space-y-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start h-11 px-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={toggleTheme}
          >
            <ThemeIcon className="w-5 h-5 mr-3" />
            Thème:{" "}
            {theme === "auto" ? "Auto" : theme === "light" ? "Clair" : "Sombre"}
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="ghost"
            className="w-full justify-start h-11 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={signOut}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
