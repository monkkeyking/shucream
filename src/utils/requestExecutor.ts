import axios from 'axios';
import chalk from 'chalk';
import {
  DEFAULT_BASE_URL,
  DEFAULT_STATUS_CODE,
} from '../commands/constants.js';

export const executeRequest = async (
  requestName,
  requestConfig,
  baseUrl,
  generateHtml,
  baseSuccessCode,
) => {
  const validSuccessCode =
    requestConfig.successCode || baseSuccessCode || DEFAULT_STATUS_CODE;

  try {
    const response = await axios({
      method: requestConfig.method,
      url: `${baseUrl || DEFAULT_BASE_URL}${requestConfig.url}`,
      headers: requestConfig.headers,
      data: requestConfig.body,
      validateStatus: (status) => {
        return status === validSuccessCode;
      },
    });

    const details =
      typeof response.data === 'string' &&
      response.data.includes('<!DOCTYPE html>')
        ? response.data
        : JSON.stringify(response.data, null, 2);

    if (generateHtml) {
      return {
        status: 'success',
        message: `Request ${requestName} completed successfully.`,
        details: details,
      };
    }
  } catch (error) {
    const errorMsg = error.response ? error.response.data : error.message;
    console.error(chalk.red(`Error in request ${requestName}: ${errorMsg}`));

    if (generateHtml) {
      return {
        status: 'error',
        message: `Request ${requestName} failed.`,
        details: JSON.stringify(errorMsg, null, 2),
      };
    }
  }
};
