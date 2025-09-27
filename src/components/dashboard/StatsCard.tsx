import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
    isPositive: boolean;
  };
  color?: string;
  loading?: boolean;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  color = "bg-gradient-to-br from-blue-500 to-cyan-500",
  loading = false,
}: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-card/50">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
          <div
            className={`w-full h-full rounded-full ${color} blur-3xl transform translate-x-6 -translate-y-6`}
          />
        </div>

        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div
            className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
            </div>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-foreground mb-1"
              >
                {value}
              </motion.div>
              <p className="text-xs text-muted-foreground">{description}</p>

              {trend && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-1 mt-2"
                >
                  <Badge
                    variant={trend.isPositive ? "default" : "destructive"}
                    className="gap-1 text-xs"
                  >
                    {trend.isPositive ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(trend.value)}%
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {trend.label}
                  </span>
                </motion.div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
