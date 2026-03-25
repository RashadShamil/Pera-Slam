"use client";
import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { Upload, FileCheck, X } from "lucide-react";
import { motion } from "motion/react";

interface FileUploadProps {
  label?: string;
  error?: string;
  onFileSelect: (file: File | null) => void;
  accept?: string;
}

export function FileUpload({ label, error, onFileSelect, accept = "image/*,.pdf" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label className="text-sm text-foreground/80 tracking-wide">
          {label}
        </label>
      )}
      
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? "border-primary bg-primary/5 scale-[1.02]" 
            : error
            ? "border-destructive hover:border-destructive/80"
            : "border-border hover:border-primary/40"
          }
          ${file ? "bg-accent/10" : ""}
        `}
        whileHover={{ scale: file ? 1 : 1.01 }}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleChange}
          accept={accept}
          className="hidden"
        />
        
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="w-8 h-8 text-primary" />
              <div>
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-2 rounded-full hover:bg-destructive/10 transition-colors"
            >
              <X className="w-5 h-5 text-destructive" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center">
            <Upload className="w-12 h-12 text-primary" />
            <div>
              <p className="font-medium text-foreground">
                Drop your payment receipt here
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                or click to browse (PDF, JPG, PNG)
              </p>
            </div>
          </div>
        )}
      </motion.div>
      
      {error && (
        <span className="text-sm text-destructive">{error}</span>
      )}
    </div>
  );
}
