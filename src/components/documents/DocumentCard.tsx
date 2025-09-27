import React from "react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  FileText,
  FileImage,
  File,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
} from "lucide-react";
import { cn } from "../ui/utils";

interface DocumentCardProps {
  document: {
    id: string;
    name: string;
    type: string;
    size: number;
    uploadedAt: string;
    category: string;
    tags: string[];
    uploadedBy: string;
    url?: string;
  };
  onView?: (doc: any) => void;
  onEdit?: (doc: any) => void;
  onDelete?: (doc: any) => void;
  onDownload?: (doc: any) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onView,
  onEdit,
  onDelete,
  onDownload,
  canEdit = false,
  canDelete = false,
}) => {
  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return FileImage;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      contrats: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      factures:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rapports:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      presentations:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      autres: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[category as keyof typeof colors] || colors.autres;
  };

  const FileIcon = getFileIcon(document.type);

  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
            <FileIcon className="w-6 h-6 text-accent-foreground" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate text-sm">{document.name}</h3>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(document.size)}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className={cn("text-xs", getCategoryColor(document.category))}
              >
                {document.category}
              </Badge>
              {document.tags.length > 0 && (
                <div className="flex gap-1">
                  {document.tags.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {document.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{document.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(document.uploadedAt)}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {document.uploadedBy}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView?.(document)}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDownload?.(document)}
            className="h-8 w-8 p-0"
          >
            <Download className="w-4 h-4" />
          </Button>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit?.(document)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete?.(document)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
