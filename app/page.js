"use client";

import { useState } from "react";
import { AppHeader } from "@/components/app/app-header";
import { DocumentUpload } from "@/components/app/document-upload";
import { DataReview } from "@/components/app/data-review";
import { processDocument } from "@/app/actions";
 import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [structuredData, setStructuredData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();

  const handleProcessDocument = async (file) => {
    setIsProcessing(true);
    setStructuredData(null);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const dataUri = reader.result;
      const result = await processDocument(dataUri);

      if (result.success && result.data) {
        setStructuredData(result.data);
        toast({
          title: "Processing Complete",
          description: "Document successfully digitized.",
        });
      } else {
        setError(result.error || "An unknown error occurred.");
        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: result.error || "Could not process the document.",
        });
      }
      setIsProcessing(false);
    };

    reader.onerror = () => {
      setError("Failed to read the file.");
      toast({
        variant: "destructive",
        title: "File Error",
        description: "There was a problem reading your file.",
      });
      setIsProcessing(false);
    };
  };

  const handleDataUpdate = (data) => {
    setStructuredData(data);
    toast({
      title: "Data Updated",
      description: "Your changes have been saved locally.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <DocumentUpload
              isProcessing={isProcessing}
              onProcess={handleProcessDocument}
            />
          </div>
          <div className="lg:col-span-3">
            <DataReview
              data={structuredData}
              isProcessing={isProcessing}
              error={error}
              onUpdate={handleDataUpdate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
