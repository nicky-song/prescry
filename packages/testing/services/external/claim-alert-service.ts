// Copyright 2023 Prescryptive Health, Inc.

import * as https from 'https';

export class ClaimAlert {
  public static send(data: string) {
    const claimAlertUrl = process.env.CLAIM_ALERT_URL;
    if (!claimAlertUrl) {
      throw new Error('Missing claim alert url');
    }

    const claimAlertAccessToken = process.env.CLAIM_ALERTS_ACCESS_TOKEN;
    if (!claimAlertAccessToken) {
      throw new Error('Missing claim alerts access token');
    }

    const options = {
      hostname: claimAlertUrl,
      port: 443,
      path: '/claims-basic',
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'Content-Length': data.length,
        Authorization: `Basic ${claimAlertAccessToken}`,
      },
    };

    return new Promise<{ statusCode?: number; data: string }>(
      (resolve, reject) => {
        const req = https.request(options, (res) => {
          const { statusCode } = res;

          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('error', (error) => {
            reject(error);
          });

          res.on('end', () => {
            resolve({ statusCode, data });
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.write(data, (e) => {
          if (e) {
            reject(e);
          }
        });

        req.end();
      }
    );
  }
}
