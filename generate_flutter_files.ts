import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { FLUTTER_PROJECT_FILES } from './src/data/flutterProject.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Generating physical flutter project files from metadata source...");

// Loop over all files and write them to the filesystem
FLUTTER_PROJECT_FILES.forEach(file => {
  // Ensure the target path is inside flutter_project
  const relativePath = file.path;
  const fullPath = path.join(__dirname, 'flutter_project', relativePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(fullPath, file.code, 'utf8');
  console.log(`Created file: flutter_project/${relativePath}`);
});

console.log("Successfully generated all production-ready Flutter workspace files!");
