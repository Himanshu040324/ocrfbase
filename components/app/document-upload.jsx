"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { FileUp, FileText, Loader2, X } from "lucide-react";

export function DocumentUpload({ isProcessing, onProcess }) {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };

  const onDragEnter = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleProcessClick = useCallback(() => {
    if (file) {
      onProcess(file);
    }
  }, [file, onProcess]);

  const removeFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const placeholderImage = PlaceHolderImages.find(
    (p) => p.id === "doc-upload-placeholder"
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl">
          1. Upload Document
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {file && previewUrl ? (
          <div className="space-y-4">
            {/* Preview Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
              <Image
                src={previewUrl}
                alt="Document preview"
                fill
                className="object-contain"
              />
            </div>

            {/* File Details */}
            <div className="flex items-center justify-between rounded-lg border bg-secondary/50 p-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <FileText className="h-6 w-6 text-primary shrink-0" />
                <span className="text-sm font-medium truncate">
                  {file.name}
                </span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={removeFile}
                disabled={isProcessing}
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors cursor-pointer",
              isDragging
                ? "border-primary bg-accent/20"
                : "border-border hover:border-primary/50"
            )}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              className="hidden"
              accept="image/*,application/pdf"
            />

            {/* Placeholder Image */}
            {placeholderImage && (
              <Image
                src={placeholderImage.imageUrl}
                alt={placeholderImage.description}
                width={150}
                height={100}
                className="mb-4 opacity-10"
                data-ai-hint={placeholderImage.imageHint}
              />
            )}

            <FileUp className="h-10 w-10 text-muted-foreground mb-2" />

            <p className="font-semibold">
              Drag & drop a document or{" "}
              <span className="text-primary">click to browse</span>
            </p>

            <p className="text-xs text-muted-foreground mt-1">
              Supports PDF, PNG, JPG files.
            </p>
          </div>
        )}

        {/* Process Button */}
        <Button
          onClick={handleProcessClick}
          disabled={!file || isProcessing}
          size="lg"
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Process Document"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
