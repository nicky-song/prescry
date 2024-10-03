// Copyright 2022 Prescryptive Health, Inc.

import fs from 'fs'; 
import {parse} from 'csv-parse';
import { ServiceBusClient } from '@azure/service-bus';
import { publishUniqueRecords }  from './publish-records.helper.js';

const serviceBusConnectionString = process.argv[2];
const isTestMode = process.argv[3];
const isPublishMessage = JSON.parse(process.argv[4]);
const batchSize = process.argv[5];
const serviceBusClient = new ServiceBusClient(serviceBusConnectionString);

try {
  const senderForUpdatePerson = serviceBusClient.createSender(
    'topic-person-update'
  );
  const logger = fs.openSync(`ConfluenceUsers_${new Date().getTime()}.log`, 'a');
 
  const removeDuplicates = (array, key) => array.filter((v,i,a)=>a.findIndex(t=>[key].every(k=>t[k] ===v[k]))===i);

  const resultArray = []

  const parser = parse({columns: false}, function (err, records) {
    records.map((record,i) => {
      const isHeaderRow = i === 0;
      if (isHeaderRow) return;
      resultArray.push({
        identifier: record[0],
        phoneNumber: record[1],
        memberId: record[2],
        isMajor: record[3], 
        lastName:record[4],
        firstName: record[5],
        memberDOB:record[6]
      })
    })
  fs.appendFileSync(logger, `Total records in csv: ${resultArray.length} \n `);
  const uniqueRecords =  removeDuplicates(resultArray,'phoneNumber');
  publishUniqueRecords(uniqueRecords,logger, senderForUpdatePerson,isTestMode,isPublishMessage,batchSize); 
});

fs.createReadStream('confluence_user_data.csv').pipe(parser);

} catch (error) {
  console.log(error);
  await serviceBusClient.close();
}