import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PackageCheck, PackageX } from 'lucide-react';

type Props = {
  isInstalled: boolean;
  missingModule: string;
};

export function DependencyCheckCard({ isInstalled, missingModule }: Props) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>Dependency Check</CardTitle>
          {isInstalled ? (
            <PackageCheck className="w-6 h-6 text-foreground" />
          ) : (
            <PackageX className="w-6 h-6 text-destructive" />
          )}
        </div>
        <CardDescription>Verifying <code className="font-code text-xs bg-muted p-1 rounded-sm">{missingModule}</code> in <code className="font-code text-xs bg-muted p-1 rounded-sm">package.json</code></CardDescription>
      </CardHeader>
      <CardContent>
        {isInstalled ? (
          <p className="text-sm">
            <span className="font-semibold text-primary">Status:</span> Found. The module is listed in your dependencies. The error might stem from an incomplete installation or version mismatch.
          </p>
        ) : (
          <p className="text-sm">
              <span className="font-semibold text-destructive">Status:</span> Not Found. The module is missing from your project's dependencies.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
