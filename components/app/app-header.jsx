import { FileJson } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-lg sticky top-0 z-30">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <FileJson className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-headline font-bold text-foreground tracking-tight">
              FRA Digitalizer
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
