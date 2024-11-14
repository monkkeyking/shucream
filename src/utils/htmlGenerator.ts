import { promises as fs } from 'fs';
import path from 'path';
import { ensureResponsesDir } from './directoryManager.js';

export const generateHtmlOutput = async (results) => {
  const totalRequests = results.length;
  const successRequests = results.filter(
    (result) => result.status === 'success',
  ).length;
  const successPercentage = ((successRequests / totalRequests) * 100).toFixed(
    2,
  );

  let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Command Results</title>
  <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <style>
    html, body { height: 100%; }
    .container-fluid { min-height: 100vh; display: flex; flex-direction: column; }
    .content { flex: 1; }
    .footer { font-size: 0.9em; color: #666; padding: 10px 0; }
    iframe { width: 100%; height: 300px; border: 1px solid #ccc; margin-top: 10px; }
    .header-logo { height: 50px; }
  </style>
</head>
<body>
  <div class="container-fluid d-flex flex-column">
    <header class="py-3 ">
      <div class="container d-flex justify-content-center align-items-center">
        <h1>Results</h1>
      </div>
    </header>
    <div class="content container my-4">
      <h4 class="text-center text-muted mb-4">Success Rate: ${successPercentage}%</h4>`;

  for (const result of results) {
    htmlContent += `
      <div class="alert alert-${result.status === 'success' ? 'success' : 'danger'}" role="alert">
        <strong>${result.status === 'success' ? 'Success' : 'Error'}:</strong> ${result.message}
      </div>`;

    if (result.details.startsWith('<!DOCTYPE html>')) {
      const base64Content = Buffer.from(result.details).toString('base64');
      htmlContent += `
      <iframe src="data:text/html;base64,${base64Content}" title="Rendered HTML Content"></iframe>`;
    } else {
      htmlContent += `
      <pre class="bg-light p-3 border rounded">${result.details}</pre>`;
    }
  }

  htmlContent += `
    </div>
    <footer class="footer text-center mt-auto bg-light py-3">
      <div class="container">
        <p class="mb-1">Powered by <a href="https://github.com/monkkeyking/shucream.git" target="_blank">Shucream Library</a></p>
        <p class="mb-1">Developed by monkkeyking • Licensed under MIT</p>
        <p class="mb-0">Contact: <a href="mailto:chelpanovandrej@gmail.com">chelpanovandrej@gmail.com</a></p>
      </div>
    </footer>
  </div>
</body>
</html>`;

  await ensureResponsesDir();
  const outputHtmlPath = path.join(
    process.cwd(),
    'responses',
    'all_requests_results.html',
  );
  await fs.writeFile(outputHtmlPath, htmlContent);
  console.log(`Results saved to ${outputHtmlPath}`);
};
