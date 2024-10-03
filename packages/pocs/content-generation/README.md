# Installation

Run `npm install`

# Setting up JSON content file

## Naming Convention

Example: `something-relevant.content.json`

## Setting up properties in JSON content file

- inputJsFileName: name of the JS content file.  This is the file that will drive the process.
- outputTsFileName: name of the TS content file.  This will be used in the actual experiences codebase to supply the content.
- relativeOutputPath: relative output path where the JSON and TS content files will be placed.  Both files should be checked into source control.
- relativeIUIContentInterfacePath: Sets the path to the package that contains interface IUIContent
- tsExportFunctionName: The function name that will supply the various localizations of the screen's content
- supportedLanguageCodes: An array of supported localizations.  Values should be language codes such as 'en', 'es', etc.
- content: An array of objects that contains the localizations.  When setting this up initially, define the key property as the english content you wished translated.

### Example content file
```
{
    "inputJsFileName": "home-page.content.json",
    "outputTsFileName": "home-page.content-wrapper.ts",
    "relativeOutputPath": "../common/src/experiences/guest-experience/state/cms-content/cms-content-wrappers/home-page",
    "relativeIUIContentInterfacePath": "../../../../../../models",
    "tsExportFunctionName": "homePageContent",	
    "supportedLanguageCodes": [
        "en",
        "es",
	    "vi"
    ],
   "content":[
      {
         "key": "The boy reads the book."
      },
      {
         "key": "The girl goes to the mall."
      }
   ]
}
```

## Executing the node file

Run `ts-node create-content-file.ts <path of the JSON file>`
- For example: `ts-node create-content-file.ts home-page.content.json`, assuming the home-page.content.json is located in the content-generation folder

## Output files

inputJsFileName & outputTsFileName files will be placed at the location specified in value relativeOutputPath