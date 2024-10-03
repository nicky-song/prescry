// Copyright 2023 Prescryptive Health, Inc.

import * as fs from 'fs';
import { ClaimNcpdpItem } from './process-template';

const targetDir = './utilities/claim-alerts/';

const writeToFiles = (ndc: string, claimInfo: ClaimNcpdpItem) => {
  const today = new Date();

  const todayString = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  const timeString = `${today.getHours()}${today.getMinutes()}${today.getSeconds()}`;
  const dirName = `run-${todayString}-${timeString}`;
  const dirPath = `${targetDir}${dirName}`;

  fs.mkdirSync(dirPath);

  const fileName = `${ndc}-${todayString}-TBD.json`;

  const filePath = `${dirPath}/${fileName}`;

  fs.writeFileSync(filePath, JSON.stringify(claimInfo));
};

export default writeToFiles;
