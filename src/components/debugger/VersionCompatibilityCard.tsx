import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

type Props = {
  suggestions: string;
};

export function VersionCompatibilityCard({ suggestions }: Props) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
            <div>
                <CardTitle>Version Compatibility</CardTitle>
                <CardDescription>AI-powered suggestions for compatible versions.</CardDescription>
            </div>
            <Badge variant="outline" className="border-primary/50 text-primary shrink-0">
                <Bot className="w-4 h-4 mr-2"/>
                AI Assistant
            </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {suggestions ? (
          <p className="text-sm text-foreground">{suggestions}</p>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
             <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-primary"></div>
             <span>Loading AI suggestions...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
