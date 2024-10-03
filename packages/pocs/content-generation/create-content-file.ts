// Copyright 2023 Prescryptive Health, Inc.

/* eslint-disable no-console */

import * as fs from 'fs';
import { translate } from 'bing-translate-api';
import * as util from 'util';

interface ILocalization {
  locale: string;
  translation: string;
  allowAPITranslation: boolean;
}

interface IContent {
  key: string;
  allowAPITranslation: boolean;
  localizations: ILocalization[];
}

interface IContentFile {
  inputJsFileName: string;
  outputTsFileName: string;
  relativeOutputPath: string;
  relativeIUIContentInterfacePath: string;
  tsExportFunctionName: string;
  supportedLanguageCodes: string[];
  content: IContent[];
}

interface ITsLocalization {
  locale: string;
  translation: string;
}

interface ITsContent {
  key: string;
  localizations: ITsLocalization[];
}

interface ITsContentFile {
  content: ITsContent[];
}

const writeFilePromisified = util.promisify(fs.writeFile);

const processReadFile = async (data: string): Promise<IContentFile> => {
  const contentFile: IContentFile = JSON.parse(data);

  const contentFileOutput: IContentFile = {
    outputTsFileName: contentFile.outputTsFileName,
    inputJsFileName: contentFile.inputJsFileName,
    relativeOutputPath: contentFile.relativeOutputPath,
    relativeIUIContentInterfacePath: contentFile.relativeIUIContentInterfacePath,
    tsExportFunctionName: contentFile.tsExportFunctionName,    
    supportedLanguageCodes: contentFile.supportedLanguageCodes,
    content: [],
  };

  for (let i = 0; i < contentFile.content.length; i++) {
    const content: IContent = contentFile.content[i];
    if (contentFile.content[i].allowAPITranslation === false) {
      contentFileOutput.content.push(content);
      continue;
    }

    content.allowAPITranslation = true;

    if (!content.localizations) {
      content.localizations = [];
      for (let j = 0; j < contentFile.supportedLanguageCodes.length; j++) {
        const localization: ILocalization = {
          locale: contentFile.supportedLanguageCodes[j],
          translation: '',
          allowAPITranslation: true,
        };
        content.localizations.push(localization);
      }
    }

    for (let j = 0; j < contentFile.supportedLanguageCodes.length; j++) {
      const localization: ILocalization = contentFile.content[
        i
      ].localizations.filter(
        (x) => x.locale === contentFile.supportedLanguageCodes[j]
      )[0];
      if (localization.allowAPITranslation === false) {
        continue;
      }
      localization.allowAPITranslation = true;
      localization.locale = contentFile.supportedLanguageCodes[j];

      await translate(
        contentFile.content[i].key,
        'en',
        contentFile.supportedLanguageCodes[j],
        false
      )
        .then((res) => {
          console.log(
            'Locale being processed: ' + contentFile.supportedLanguageCodes[j]
          );
          console.log('From translation text: ' + contentFile.content[i].key);
          console.log('To translation text: ' + res.translation);
          localization.translation = res.translation;
        })
        .catch((err) => {
          console.error(err);
        });
    }
    contentFileOutput.content.push(content);
  }
  return contentFileOutput;
};

const updateContentFile = async (
  contentFileOutput: IContentFile
): Promise<void> => {
  const data = JSON.stringify(contentFileOutput, null, 4);
  const path = `${contentFileOutput.relativeOutputPath}/${contentFileOutput.inputJsFileName}`
  await writeFilePromisified(path, data);
};

const getExportUIContentLocalizationsFunctionText = (
  jsContentFile: IContentFile,
  tsContentFile: ITsContentFile
): string => {
  const data = JSON.stringify(tsContentFile.content, null, 4);
  const exportUIContentLocalizationsFunctionText = `// Copyright ${new Date().getFullYear()} Prescryptive Health, Inc.

import { IUIContent } from ${`'../../../../../../models/ui-content-v2'`};

export const ${jsContentFile.tsExportFunctionName}: IUIContent[] =
${data.replace(/"([^"]+)":/g, '$1:')};`;
  return exportUIContentLocalizationsFunctionText;
};

const generateExportUIContentLocalizationsFunction = async (
  jsContentFile: IContentFile,
  tsContentFile: ITsContentFile
): Promise<void> => {
  const path = `${jsContentFile.relativeOutputPath}/${jsContentFile.outputTsFileName}`
  await writeFilePromisified(
    path,
    getExportUIContentLocalizationsFunctionText(jsContentFile, tsContentFile)
  );
};

const getTsContentBasedOnJsonContent = (
  jsonContentFile: IContentFile
): ITsContentFile => {
  const tsContentFile: ITsContentFile = {
    content: [],
  };
  for (let i = 0; i < jsonContentFile.content.length; i++) {
    const tsContent: ITsContent = {
      key: jsonContentFile.content[i].key,
      localizations: [],
    };
    for (let j = 0; j < jsonContentFile.content[i].localizations.length; j++) {
      const tsLocalization: ITsLocalization = {
        locale: jsonContentFile.content[i].localizations[j].locale,
        translation: jsonContentFile.content[i].localizations[j].translation,
      };
      tsContent.localizations.push(tsLocalization);
    }
    tsContentFile.content.push(tsContent);
  }
  return tsContentFile;
};

async function init() {
  try {
    const nameOfInputJsInputFile = process.argv.slice(2)[0];
    const data = await fs.promises.readFile(nameOfInputJsInputFile);
    const contentFileOutput = await processReadFile(data as unknown as string);
    await updateContentFile(contentFileOutput);
    const tsContentFile: ITsContentFile = await getTsContentBasedOnJsonContent(
      contentFileOutput
    );
    generateExportUIContentLocalizationsFunction(
      contentFileOutput,
      tsContentFile
    );
  } catch (err) {
    console.log(err);
  }
}

init();
