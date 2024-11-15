import path from 'path';
import fs from 'fs';

const fileURL = (filePath: string) => {
  return `file://${filePath.replace(/\\/g, '/')}`;
};

const configPath = path.resolve(process.cwd(), 'cream.js');

const loadConfig = async () => {
  if (!fs.existsSync(configPath)) {
    console.error('cream.js not found in the project root directory.');
    process.exit(1);
  }

  const configModule = await import(fileURL(configPath));

  return configModule;
};

export { loadConfig };
