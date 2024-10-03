// Copyright 2022 Prescryptive Health, Inc.

import { readFileSync } from 'fs';

const readJSonFileAndParseIt = (path: string) =>
  JSON.parse(readFileSync(path).toString());

export default readJSonFileAndParseIt;
