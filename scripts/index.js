import { execSync } from 'child_process';

const folderName = process.argv[2];

if (!folderName) {
  console.error('Please provide a folder name');
  process.exit(1);
}

console.log(`Start: ${folderName}`);

try {
  execSync(`jest --testPathPatterns="${folderName}"`, {
    stdio: 'inherit',
    cwd: process.cwd(),
  });
} catch (error) {
  process.exit(error.status || 1);
}
