// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs';
import { closeLoggerFile } from '../utils/logger-file.js';
import { sleep } from '../utils/sleep-interval.js';

export const publishRecordsToInsertMasterIdField = async (
  serviceBusClient,
  validatedUsers,
  batchSize,
  sleepInterval,
  isPublish,
  progessLogger
) => {
  const personUpdateTopicName = process.env.TOPIC_PERSON_UPDATE;
  const senderForUpdatePerson = serviceBusClient.createSender(
    personUpdateTopicName
  );

  let publishedRecords = 0;
  for (const record of validatedUsers) {
    if (record.isValid === true) {
      const message = {
        body: {
          action: 'PersonUpdate',
          person: {
            identifier: record.identifier,
            masterId: record.masterId,
          },
        },
      };

      if (isPublish) {
        await senderForUpdatePerson.sendMessages(message);
      }

      fs.appendFileSync(
        progessLogger,
        JSON.stringify({
          body: {
            ...message.body,
            person: {
              ...message.body.person,
              phoneNumber: record.phoneNumber,
              primaryMemberRxId: record.memberId,
              firstName: record.firstName,
              lastName: record.lastName,
              masterId: record.masterId,
            },
          },
        }) + ',\n'
      );
      publishedRecords++;

      if (Number.isInteger(publishedRecords / batchSize)) {
        console.log(
          `Total ${
            isPublish ? 'published' : 'unpublished'
          } messages so far: ${publishedRecords}`
        );
        console.log(`Beginning the delay of ${sleepInterval} milliseconds...`);
        await sleep(sleepInterval);
        console.log(`Finished the delay of ${sleepInterval} milliseconds.`);
      }
    } else {
      fs.appendFileSync(
        progessLogger,
        `Unable to publish record : isValid = false, phoneNumber: ${record.phoneNumber}. Find more details of this record in ExceptionLogger\n`
      );
    }
  }

  console.log(
    `Total ${isPublish ? 'published' : 'unpublished'} users found: ${
      validatedUsers.length
    }`
  );
  serviceBusClient.close();
  await closeLoggerFile(progessLogger);
};
