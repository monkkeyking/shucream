import { Command } from 'commander';
import { loadConfig } from '../utils/configLoader.js';
import { parseRange } from '../utils/rangeParser.js';
import { executeRequest } from '../utils/requestExecutor.js';
import { generateHtmlOutput } from '../utils/htmlGenerator.js';

const askCommand = new Command('ask')
  .argument(
    '<name>',
    'Name(s) of the request(s) to execute. You can provide a range (e.g., "1..3" or "1..=3")',
  )
  .option('--responses', 'Generate HTML responses')
  .description('Execute a request from cream.js')
  .action(async (name, options) => {
    try {
      const generateHtml = options.responses;
      const config = await loadConfig();
      const { baseUrl } = config.default;
      const { baseSuccessCode } = config.default;

      const requestNames = name.includes('..')
        ? parseRange(name).map(String)
        : [name];
      const results = [];

      let successCount = 0;
      let errorCount = 0;

      for (const requestName of requestNames) {
        const request = config.default.requests[requestName];

        if (!request) {
          console.error(`Request ${requestName} not found in cream.js`);
          continue;
        }

        const result = await executeRequest(
          requestName,
          request,
          baseUrl,
          generateHtml,
          baseSuccessCode,
        );
        if (result) results.push(result);

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        result?.status === 'success' ? successCount++ : errorCount++;
      }

      if (generateHtml) await generateHtmlOutput(results);
    } catch (error) {
      console.error('Error:', error.message);
    }
  });

export { askCommand };
