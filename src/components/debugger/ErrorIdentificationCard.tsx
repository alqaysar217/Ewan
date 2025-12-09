import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle } from 'lucide-react';

type Props = {
  buildOutput: string;
  missingModule: string;
};

export function ErrorIdentificationCard({ buildOutput, missingModule }: Props) {
  return (
    <Card className="border-destructive/50 shadow-lg shadow-destructive/10">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
        <AlertTriangle className="w-10 h-10 text-destructive flex-shrink-0" />
        <div>
          <CardTitle className="text-xl text-destructive">Error: Module Not Found</CardTitle>
          <CardDescription>The build failed because a required module could not be resolved.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Identified missing module:</p>
            <p className="text-lg font-semibold text-primary">{missingModule}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Relevant Build Output:</h4>
          <pre className="text-sm font-code bg-muted/50 text-foreground whitespace-pre-wrap max-h-40 overflow-auto rounded-lg p-3">
            <code>{buildOutput.trim()}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
