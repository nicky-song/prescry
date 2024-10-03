import fs from 'fs';

export const publishUniqueRecords = async (
  uniqueRecords,
  logger,
  senderForUpdatePerson,
  isTestMode,
  isPublishMessage,
  batchSize,
  serviceBusClient
) => {
  let i = 0;
  let publishedRecords = 0;
  let processRecordsLogger = fs.openSync(
    `ProcessedRecords_${new Date().getTime()}.json`,
    'a'
  );

  if (isPublishMessage === false) {
    fs.appendFileSync(processRecordsLogger, '[');
  }
  for (const record of uniqueRecords) {
    fs.appendFileSync(
      logger,
      `Publishing ${record.phoneNumber} Identifier: ${record.identifier}  \n `
    );
    const message = {
      body: {
        action: 'FinishPhoneNumberVerification',
        person: {
          identifier: record.identifier,
          phoneNumber: record.phoneNumber,
        },
      },
    };

    if (isPublishMessage === true) {
      console.log(
        'Calling service bus with this message: ' + JSON.stringify(message)
      );
      await senderForUpdatePerson.sendMessages(message);
    } else {
      fs.appendFileSync(processRecordsLogger, JSON.stringify(message) + ',\n');
    }
    i++;
    publishedRecords++;

    if (Number.isInteger(i / batchSize)) {
      console.log('Beginning the delay of 10000 milliseconds...');
      await new Promise((r) => setTimeout(r, 10000)); // 10secs
      console.log('Finished the delay of 10000 milliseconds.');
    }
  }

  if (fs.existsSync(processRecordsLogger)) {
    fs.appendFileSync(processRecordsLogger, ']');
    fs.closeSync(processRecordsLogger);
  }
  fs.appendFileSync(logger, `published records: ${publishedRecords}`);
  fs.closeSync(logger);
  await serviceBusClient.close();
};
