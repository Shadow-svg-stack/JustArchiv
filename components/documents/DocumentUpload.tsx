import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  File,
  X,
  MapPin,
  Tag,
  FileText,
  Folder,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { Progress } from "../ui/progress";
import { mockCategories, mockTags } from "../../data/mockData";

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (documents: any[]) => void;
}

interface FileWithMetadata {
  file: File;
  id: string;
  name: string;
  physicalLocation: string;
  description: string;
  category: string;
  tags: string[];
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
}

export function DocumentUpload({
  isOpen,
  onClose,
  onUpload,
}: DocumentUploadProps) {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newTagInput, setNewTagInput] = useState("");

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles: File[]) => {
    const filesWithMetadata: FileWithMetadata[] = newFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name.split(".").slice(0, -1).join("."),
      physicalLocation: "",
      description: "",
      category: "",
      tags: [],
      progress: 0,
      status: "pending",
    }));

    setFiles((prev) => [...prev, ...filesWithMetadata]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const updateFile = (id: string, updates: Partial<FileWithMetadata>) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
  };

  const addTag = (fileId: string, tag: string) => {
    if (!tag.trim()) return;

    updateFile(fileId, {
      tags: files.find((f) => f.id === fileId)?.tags.includes(tag)
        ? files.find((f) => f.id === fileId)?.tags || []
        : [...(files.find((f) => f.id === fileId)?.tags || []), tag],
    });
  };

  const removeTag = (fileId: string, tagToRemove: string) => {
    updateFile(fileId, {
      tags:
        files
          .find((f) => f.id === fileId)
          ?.tags.filter((tag) => tag !== tagToRemove) || [],
    });
  };

  const validateFiles = (): boolean => {
    let isValid = true;

    files.forEach((file) => {
      const errors: string[] = [];

      if (!file.name.trim()) errors.push("Le nom est requis");
      if (!file.physicalLocation.trim())
        errors.push("L'emplacement physique est requis");
      if (!file.category) errors.push("La catégorie est requise");

      if (errors.length > 0) {
        updateFile(file.id, {
          status: "error",
          error: errors.join(", "),
        });
        isValid = false;
      } else {
        updateFile(file.id, {
          status: "pending",
          error: undefined,
        });
      }
    });

    return isValid;
  };

  const handleUpload = async () => {
    if (!validateFiles()) return;

    setUploading(true);

    // Simule l'upload des fichiers
    for (const file of files) {
      updateFile(file.id, { status: "uploading", progress: 0 });

      // Simule la progression
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        updateFile(file.id, { progress });
      }

      // Simule le succès ou l'échec
      const success = Math.random() > 0.1; // 90% de chance de succès
      updateFile(file.id, {
        status: success ? "success" : "error",
        error: success ? undefined : "Erreur lors de l'upload",
      });
    }

    setUploading(false);

    // Appelle le callback si tous les fichiers ont été uploadés avec succès
    const successfulFiles = files.filter((f) => f.status === "success");
    if (successfulFiles.length > 0) {
      onUpload?.(successfulFiles);
    }

    // Ferme la modal après un délai
    setTimeout(() => {
      onClose();
      setFiles([]);
    }, 2000);
  };

  const canUpload = files.length > 0 && !uploading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Télécharger des documents
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Zone de drop */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              Glissez vos fichiers ici ou cliquez pour sélectionner
            </h3>
            <p className="text-muted-foreground mb-4">
              PDF, Word, images, présentations jusqu'à 10MB chacun
            </p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              id="file-input"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png,.gif"
            />
            <Button asChild>
              <label htmlFor="file-input" className="cursor-pointer">
                Sélectionner des fichiers
              </label>
            </Button>
          </motion.div>

          {/* Liste des fichiers */}
          {files.length > 0 && (
            <div className="space-y-4">
              <Separator />
              <h3 className="font-semibold">
                Fichiers à télécharger ({files.length})
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {files.map((fileData, index) => (
                  <motion.div
                    key={fileData.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Icône et statut */}
                          <div className="relative">
                            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                              <File className="w-6 h-6" />
                            </div>
                            {fileData.status === "success" && (
                              <CheckCircle className="absolute -top-1 -right-1 w-5 h-5 text-green-500 bg-background rounded-full" />
                            )}
                            {fileData.status === "error" && (
                              <AlertCircle className="absolute -top-1 -right-1 w-5 h-5 text-red-500 bg-background rounded-full" />
                            )}
                            {fileData.status === "uploading" && (
                              <Loader2 className="absolute -top-1 -right-1 w-5 h-5 text-primary bg-background rounded-full animate-spin" />
                            )}
                          </div>

                          {/* Contenu principal */}
                          <div className="flex-1 space-y-4">
                            {/* Nom et bouton supprimer */}
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium text-sm text-muted-foreground">
                                  Fichier original: {fileData.file.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(fileData.file.size / 1024 / 1024).toFixed(
                                    2,
                                  )}{" "}
                                  MB
                                </p>
                              </div>
                              {fileData.status === "pending" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeFile(fileData.id)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>

                            {/* Progression */}
                            {fileData.status === "uploading" && (
                              <Progress
                                value={fileData.progress}
                                className="h-2"
                              />
                            )}

                            {/* Erreur */}
                            {fileData.error && (
                              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                                {fileData.error}
                              </div>
                            )}

                            {/* Formulaire de métadonnées */}
                            {fileData.status === "pending" && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nom du document */}
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Nom du document *
                                  </Label>
                                  <Input
                                    value={fileData.name}
                                    onChange={(e) =>
                                      updateFile(fileData.id, {
                                        name: e.target.value,
                                      })
                                    }
                                    placeholder="Nom descriptif du document"
                                  />
                                </div>

                                {/* Catégorie */}
                                <div className="space-y-2">
                                  <Label className="flex items-center gap-2">
                                    <Folder className="w-4 h-4" />
                                    Catégorie *
                                  </Label>
                                  <Select
                                    value={fileData.category}
                                    onValueChange={(value) =>
                                      updateFile(fileData.id, {
                                        category: value,
                                      })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Sélectionnez une catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {mockCategories.map((category) => (
                                        <SelectItem
                                          key={category.id}
                                          value={category.name}
                                        >
                                          {category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Emplacement physique */}
                                <div className="space-y-2 md:col-span-2">
                                  <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Emplacement physique exact *
                                  </Label>
                                  <Input
                                    value={fileData.physicalLocation}
                                    onChange={(e) =>
                                      updateFile(fileData.id, {
                                        physicalLocation: e.target.value,
                                      })
                                    }
                                    placeholder="Ex: Armoire A - Étagère 2 - Dossier 'Contrats 2024'"
                                  />
                                </div>

                                {/* Description */}
                                <div className="space-y-2 md:col-span-2">
                                  <Label>Description</Label>
                                  <Textarea
                                    value={fileData.description}
                                    onChange={(e) =>
                                      updateFile(fileData.id, {
                                        description: e.target.value,
                                      })
                                    }
                                    placeholder="Description optionnelle du document"
                                    rows={2}
                                  />
                                </div>

                                {/* Tags */}
                                <div className="space-y-2 md:col-span-2">
                                  <Label className="flex items-center gap-2">
                                    <Tag className="w-4 h-4" />
                                    Tags
                                  </Label>
                                  <div className="flex flex-wrap gap-2 mb-2">
                                    {fileData.tags.map((tag) => (
                                      <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="gap-1"
                                      >
                                        {tag}
                                        <X
                                          className="w-3 h-3 cursor-pointer"
                                          onClick={() =>
                                            removeTag(fileData.id, tag)
                                          }
                                        />
                                      </Badge>
                                    ))}
                                  </div>
                                  <div className="flex gap-2">
                                    <Input
                                      value={newTagInput}
                                      onChange={(e) =>
                                        setNewTagInput(e.target.value)
                                      }
                                      placeholder="Ajouter un tag"
                                      onKeyPress={(e) => {
                                        if (e.key === "Enter") {
                                          addTag(fileData.id, newTagInput);
                                          setNewTagInput("");
                                        }
                                      }}
                                    />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      onClick={() => {
                                        addTag(fileData.id, newTagInput);
                                        setNewTagInput("");
                                      }}
                                    >
                                      Ajouter
                                    </Button>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {mockTags.map((tag) => (
                                      <Button
                                        key={tag.id}
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 text-xs"
                                        onClick={() =>
                                          addTag(fileData.id, tag.name)
                                        }
                                      >
                                        {tag.name}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {files.length > 0 && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={onClose} disabled={uploading}>
                Annuler
              </Button>
              <Button onClick={handleUpload} disabled={!canUpload}>
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Upload en cours...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Télécharger {files.length} fichier(s)
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
