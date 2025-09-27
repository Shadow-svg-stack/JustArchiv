import React from "react";
import { motion } from "framer-motion";
import {
  FileUp,
  LogIn,
  FileEdit,
  FolderPlus,
  Settings,
  Clock,
  User,
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Activity } from "../../types";
import { formatDateTime } from "../../data/mockData";

interface RecentActivityProps {
  activities: Activity[];
  loading?: boolean;
}

const activityIcons = {
  document_upload: FileUp,
  document_edit: FileEdit,
  document_delete: FileText,
  user_login: LogIn,
  user_create: User,
  category_create: FolderPlus,
  system_event: Settings,
};

const activityColors = {
  document_upload: "text-green-600 bg-green-100 dark:bg-green-900/20",
  document_edit: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
  document_delete: "text-red-600 bg-red-100 dark:bg-red-900/20",
  user_login: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
  user_create: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20",
  category_create: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
  system_event: "text-gray-600 bg-gray-100 dark:bg-gray-900/20",
};

export function RecentActivity({
  activities,
  loading = false,
}: RecentActivityProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
              <div className="h-6 bg-muted rounded w-16" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Activité récente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Aucune activité récente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                const colorClass = activityColors[activity.type];

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 group hover:bg-muted/50 p-2 rounded-lg transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${colorClass}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {activity.user && (
                          <div className="flex items-center gap-1">
                            <Avatar className="w-4 h-4">
                              <AvatarImage src={activity.user.avatar} />
                              <AvatarFallback className="text-xs">
                                {activity.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">
                              {activity.user.name}
                            </span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(activity.createdAt)}
                        </span>
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {activity.type === "document_upload" && "Upload"}
                      {activity.type === "document_edit" && "Édition"}
                      {activity.type === "document_delete" && "Suppression"}
                      {activity.type === "user_login" && "Connexion"}
                      {activity.type === "user_create" && "Utilisateur"}
                      {activity.type === "category_create" && "Catégorie"}
                      {activity.type === "system_event" && "Système"}
                    </Badge>
                  </motion.div>
                );
              })}

              {activities.length > 0 && (
                <>
                  <Separator />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                  >
                    <button className="text-sm text-primary hover:text-primary/80 transition-colors">
                      Voir toute l'activité
                    </button>
                  </motion.div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
