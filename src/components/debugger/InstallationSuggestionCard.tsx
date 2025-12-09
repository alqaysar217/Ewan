"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Copy, Check } from 'lucide-react';
import { useState } from 'react';

type Props = {
  missingModule: string;
};

export function InstallationSuggestionCard({ missingModule }: Props) {
  const npmCommand = `npm install ${missingModule}`;
  const yarnCommand = `yarn add ${missingModule}`;

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (command: string, type: string) => {
    navigator.clipboard.writeText(command);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Card className="bg-accent/20 border-accent h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-accent-foreground">Next Step: Install</CardTitle>
          <Terminal className="w-6 h-6 text-accent-foreground"/>
        </div>
        <CardDescription className="text-accent-foreground/80">Install the missing dependency to resolve the error.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-accent-foreground">Using npm</label>
          <div className="flex items-center gap-2">
            <code className="font-code text-sm bg-background/70 p-2 rounded-md w-full overflow-x-auto">{npmCommand}</code>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(npmCommand, 'npm')} aria-label="Copy npm command">
              {copied === 'npm' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-accent-foreground">Using yarn</label>
          <div className="flex items-center gap-2">
            <code className="font-code text-sm bg-background/70 p-2 rounded-md w-full overflow-x-auto">{yarnCommand}</code>
            <Button variant="ghost" size="icon" onClick={() => handleCopy(yarnCommand, 'yarn')} aria-label="Copy yarn command">
              {copied === 'yarn' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
