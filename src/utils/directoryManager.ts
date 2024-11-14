import { promises as fs } from 'fs';
import path from 'path';
import chalk from 'chalk';

export const ensureResponsesDir = async () => {
  const responsesDir = path.resolve(process.cwd(), 'responses');
  try {
    await fs.mkdir(responsesDir, { recursive: true });
  } catch (error) {
    console.error(chalk.red('Failed to create responses directory:', error));
  }
};
