'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Download, FileSignature, Landmark, Loader2, MapPin, NotebookPen, ShieldCheck, TriangleAlert } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  pattaHolderName: z.string().nullable(),
  villageName: z.string().nullable(),
  coordinates: z.string().nullable(),
  claimStatus: z.string().nullable(),
  additionalNotes: z.string().nullable(),
});

export function DataReview({ data, isProcessing, error, onUpdate }) {
  if (isProcessing) {
    return <ProcessingView />;
  }
  if (error) {
    return <ErrorView message={error} />;
  }
  if (data) {
    return <DataReviewForm initialData={data} onUpdate={onUpdate} />;
  }
  return <IdleView />;
}

function IdleView() {
  return (
    <Card className="h-full flex flex-col justify-center">
      <CardHeader>
        <CardTitle className="font-headline text-xl">2. Review & Export</CardTitle>
        <CardDescription>Upload a document to begin the digitization process.</CardDescription>
      </CardHeader>
      <CardContent className="text-center text-muted-foreground">
        <p>Results will appear here after processing.</p>
      </CardContent>
    </Card>
  );
}

function ProcessingView() {
  return (
    <Card className="h-full flex flex-col justify-center items-center">
      <CardContent className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4 mx-auto" />
        <p className="text-lg font-semibold text-foreground font-headline">Digitizing Document</p>
        <p className="text-sm text-muted-foreground">This may take a moment. AI is hard at work...</p>
      </CardContent>
    </Card>
  );
}

function ErrorView({ message }) {
  return (
    <Card className="h-full border-destructive bg-destructive/10">
      <CardHeader>
        <CardTitle className="font-headline text-xl flex items-center gap-2 text-destructive">
          <TriangleAlert className="h-6 w-6" />
          Processing Failed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-destructive font-medium">An error occurred while processing your document.</p>
        <p className="text-sm text-destructive/80 mt-2">{message}</p>
      </CardContent>
    </Card>
  );
}

function DataReviewForm({ initialData, onUpdate }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const handleExport = () => {
    const currentData = form.getValues();
    const dataStr = JSON.stringify(currentData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fra_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const onSubmit = (values) => {
    onUpdate(values);
  };

  const fieldIconClass = "h-4 w-4 text-muted-foreground";

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline text-xl">2. Review & Export</CardTitle>
        <CardDescription>
          Review the extracted data. You can make corrections before exporting.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            
            {/* Patta Holder Name */}
            <FormField
              control={form.control}
              name="pattaHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <FileSignature className={fieldIconClass} /> Patta Holder Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Not extracted" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Village Name */}
            <FormField
              control={form.control}
              name="villageName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <Landmark className={fieldIconClass} /> Village Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Not extracted" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Coordinates */}
            <FormField
              control={form.control}
              name="coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <MapPin className={fieldIconClass} /> Coordinates
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Not extracted" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Claim Status */}
            <FormField
              control={form.control}
              name="claimStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <ShieldCheck className={fieldIconClass} /> Claim Status
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Not extracted" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Notes */}
            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-2'>
                    <NotebookPen className={fieldIconClass} /> Additional Notes
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="No additional notes." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" type="submit">Save Changes</Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </CardFooter>

        </form>
      </Form>
    </Card>
  );
}
