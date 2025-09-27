import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Plus, Bell, Calendar, Filter } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
  title: string;
  onNewDocument?: () => void;
  onSearch?: (query: string) => void;
  showNewButton?: boolean;
  showSearch?: boolean;
}

export function Header({
  title,
  onNewDocument,
  onSearch,
  showNewButton = true,
  showSearch = true,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canCreateDocuments =
    user && ["headmaster", "admin", "editor"].includes(user.role);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-16 bg-background border-b border-border flex items-center justify-between px-6"
    >
      {/* Left side - Title and date */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {getCurrentDate()}
          </p>
        </div>
      </div>

      {/* Right side - Search and actions */}
      <div className="flex items-center gap-4">
        {/* Search */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher des documents..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-80 bg-background"
            />
          </motion.div>
        )}

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filtres
          </Button>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="w-5 h-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
        </motion.div>

        {/* New Document Button */}
        {showNewButton && canCreateDocuments && onNewDocument && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button onClick={onNewDocument} className="gap-2">
              <Plus className="w-4 h-4" />
              Nouveau document
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
