# **App Name**: Scene Debugger

## Core Features:

- Error Identification: Parses the build output to identify the specific module that couldn't be resolved, such as '@react-three/drei' in the user's case.
- Dependency Check: Checks the project's package.json file to verify if the missing module is listed as a dependency.
- Installation Suggestion: Provides a direct command for installing the missing dependency (e.g., 'npm install @react-three/drei' or 'yarn add @react-three/drei').
- Version Compatibility Checker: Analyzes the project's Next.js version (15.5.7) and the required module's versions to check for compatibility issues and suggest compatible versions if necessary. Use LLM as a tool.

## Style Guidelines:

- Primary color: Deep blue (#293B5F) to convey stability and reliability.
- Background color: Light gray (#F0F0F0) for a clean, neutral backdrop.
- Accent color: Soft yellow (#E6C463) for important information and actionable items.
- Body and headline font: 'Inter' (sans-serif) for a clean and modern look. Using 'Source Code Pro' for commands in installation suggestions.
- Code font: 'Source Code Pro' for displaying commands in installation suggestions.
- Use simple, clear icons to represent different types of errors or suggestions.
- Clearly structured layout with distinct sections for error identification, dependency check, and installation suggestion.