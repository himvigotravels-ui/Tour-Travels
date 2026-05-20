"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { RiUploadCloud2Line, RiCloseLine, RiImageLine } from "react-icons/ri";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

export function ImageUpload({ value, onChange, folder = "general", className }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        onChange(data.secure_url);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }, [folder, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      handleUpload(file);
    }
  }, [handleUpload]);

  return (
    <div className={className}>
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-border bg-muted aspect-video">
          <img src={value} alt="Upload" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => onChange("")}
              className="gap-1"
            >
              <RiCloseLine className="w-4 h-4" /> Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
            ${dragOver ? "border-emerald-500 bg-emerald-500/5" : "border-border hover:border-muted-foreground/50"}`}
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            id={`upload-${folder}`}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <label htmlFor={`upload-${folder}`} className="cursor-pointer flex flex-col items-center gap-3">
            {uploading ? (
              <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <RiUploadCloud2Line className="w-6 h-6 text-muted-foreground" />
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">
                {uploading ? "Uploading..." : "Click or drag to upload"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 10MB</p>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

// Multi-image upload variant
interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
  max?: number;
}

export function MultiImageUpload({ value, onChange, folder = "general", max = 5 }: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        onChange([...value, data.secure_url]);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((url, i) => (
          <div key={i} className="relative group rounded-xl overflow-hidden border border-border bg-muted aspect-video">
            <img src={url} alt={`Image ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <RiCloseLine className="w-4 h-4" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <label className="border-2 border-dashed border-border rounded-xl aspect-video flex flex-col items-center justify-center cursor-pointer hover:border-muted-foreground/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
            {uploading ? (
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <RiImageLine className="w-6 h-6 text-muted-foreground mb-1" />
                <span className="text-xs text-muted-foreground">Add Image</span>
              </>
            )}
          </label>
        )}
      </div>
    </div>
  );
}
