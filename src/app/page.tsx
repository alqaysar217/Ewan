import { promises as fs } from 'fs';
import path from 'path';
import { suggestCompatibleVersions } from '@/ai/flows/suggest-compatible-versions';

import { ErrorIdentificationCard } from '@/components/debugger/ErrorIdentificationCard';
import { DependencyCheckCard } from '@/components/debugger/DependencyCheckCard';
import { InstallationSuggestionCard } from '@/components/debugger/InstallationSuggestionCard';
import { VersionCompatibilityCard } from '@/components/debugger/VersionCompatibilityCard';

// Hardcoded data from the user request
const ERROR_DATA = {
  buildOutput: `
./src/components/experience/Experience.tsx:4:1
Module not found: Can't resolve '@react-three/drei'
  2 | import React, { useRef, useMemo, Suspense } from 'react';
  3 | import { useThree, useFrame } from '@react-three/fiber';
> 4 | import { ScrollControls, useScroll, Float, Sparkles, Stars, Text3D, Center, Image as DreiImage } from '@react-three/drei';
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  5 | import { Bloom, EffectComposer, Vignette, Noise } from '@react-three/postprocessing';
  6 | import { useContent } from '@/components/HassaniVerse';
  7 | import { PlaceHolderImages } from '@/lib/placeholder-images';
`,
  missingModule: "@react-three/drei",
  nextJsVersion: "15.5.7",
};

export default async function Home() {
  // 1. Dependency Check
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
  const packageJson = JSON.parse(packageJsonContent);
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  const isInstalled = ERROR_DATA.missingModule in dependencies;

  // 2. Version Compatibility Check (GenAI)
  let aiSuggestions = '';
  try {
    const result = await suggestCompatibleVersions({
      nextJsVersion: ERROR_DATA.nextJsVersion,
      missingModule: ERROR_DATA.missingModule,
    });
    aiSuggestions = result.suggestedVersions;
  } catch (error) {
    console.error("AI suggestion failed:", error instanceof Error ? error.message : String(error));
    aiSuggestions = "Could not retrieve AI suggestions at this time.";
  }

  return (
    <main className="min-h-screen bg-background text-foreground font-body p-4 sm:p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary mb-2">
            Scene Debugger
          </h1>
          <p className="text-lg text-muted-foreground">
            Your automated assistant for resolving build errors.
          </p>
        </header>

        <div className="space-y-8">
          <ErrorIdentificationCard 
            buildOutput={ERROR_DATA.buildOutput} 
            missingModule={ERROR_DATA.missingModule} 
          />
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <DependencyCheckCard 
              isInstalled={isInstalled}
              missingModule={ERROR_DATA.missingModule}
            />

            {!isInstalled && (
              <InstallationSuggestionCard
                missingModule={ERROR_DATA.missingModule}
              />
            )}
          </div>
          
          <VersionCompatibilityCard
            suggestions={aiSuggestions}
          />
        </div>

        <footer className="text-center mt-16 text-sm text-muted-foreground">
          <p>Powered by Firebase and Google AI</p>
        </footer>
      </div>
    </main>
  );
}
