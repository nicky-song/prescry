// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs';

export const publishUniqueRecords = async (
  uniqueRecords,
  logger,
  senderForUpdatePerson,
  isTestMode,
  isPublishMessage,
  batchSize
) => {
  let i = 0;
  let publishedRecords = 0;
  let processRecordsLogger = fs.openSync(
    `UnPublishedRecords_${new Date().getTime()}.json`,
    'a'
  );

  if (isPublishMessage === false) {
    fs.appendFileSync(processRecordsLogger, '[');
  }
  for (const record of uniqueRecords) {
    if (record.isMajor) {
      const processedPhoneNumber =
        record.phoneNumber.length === 10
          ? `+1${record.phoneNumber}`
          : record.phoneNumber;
      fs.appendFileSync(
        logger,
        `Publishing ${processedPhoneNumber} Identifier: ${record.identifier} MemberId: ${record.memberId}  \n `
      );

      const message = {
        body: {
          action: 'ActivationPhoneNumberUpdate',
          person: {
            memberId: record.memberId,
            activationPhoneNumber: processedPhoneNumber,
            identifier:
              record.identifier.trim().length > 0
                ? record.identifier
                : undefined,
          },
        },
        applicationProperties: {
          isTestMode,
        },
      };

      if (isPublishMessage === true) {
        await senderForUpdatePerson.sendMessages(message);
      } else {
        fs.appendFileSync(
          processRecordsLogger,
          JSON.stringify(message) + ',\n'
        );
      }
      i++;
      publishedRecords++;
    } else {
      fs.appendFileSync(
        logger,
        `Not publishing due to minor : ${record.phoneNumber} Identifier: ${record.identifier} MemberId: ${record.memberId}  \n `
      );
    }

    if (Number.isInteger(i / batchSize)) {
      await new Promise((r) => setTimeout(r, 10000)); // 10secs
    }
  }
  if (isPublishMessage === false) {
    fs.appendFileSync(processRecordsLogger, ']');
  }
  fs.closeSync(processRecordsLogger);
  fs.appendFileSync(logger, `published records: ${publishedRecords}`);
  fs.closeSync(logger);
  senderForUpdatePerson.close();
};
