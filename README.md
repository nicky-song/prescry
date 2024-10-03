# Prescryptive-experiences

## `MAJOR CHANGE`

- You should run most yarn commands from the _root_ folder now.

- There is no longer a need to run a build in watch mode anymore

- Example commands from root:

```
    yarn setup
    yarn myrx
    yarn storybook
    yarn test:common
    yarn serve:debug
```

---

## Table of Contents

- [Prescryptive-experiences](#prescryptive-experiences)
  - [`MAJOR CHANGE`](#major-change)
  - [Table of Contents](#table-of-contents)
  - [Setup](#setup)
    - [`Install packages`](#install-packages)
  - [Running the application](#running-the-application)
    - [`Start`](#start)
      - [Audit Resolutions](#audit-resolutions)
    - [`Storybook`](#storybook)
    - [`Test`](#test)
    - [`Linting`](#linting)
  - [Pre-Requisites](#pre-requisites)
    - [`Install tools`](#install-tools)
    - [`Install VS Code and extensions`](#install-vs-code-and-extensions)
    - [Accessing Private NPM Repository](#accessing-private-npm-repository)
      - [`Windows`](#windows)
        - [`Get VSTS Access Token`](#get-vsts-access-token)
          - [`First Time Setup`](#first-time-setup)
          - [`Regenerate New VSTS Token`](#regenerate-new-vsts-token)
      - [`Mac`](#mac)
        - [`Add your azure devops base64 encoded personal access token to your .npmrc file`](#add-your-azure-devops-base64-encoded-personal-access-token-to-your-npmrc-file)
    - [`Get the code`](#get-the-code)
    - [`Get current environment files`](#get-current-environment-files)
      - [`MyRx Application Environment File`](#myrx-application-environment-file)
      - [`API Environment File`](#api-environment-file)
      - [`Add myrx-api.test.prescryptive.io to hosts file`](#add-test-apiprescryptiveio-to-hosts-file)
  - [Package management](#package-management)
  - [Download FontAwesome Pro fonts](#download-fontawesome-pro-fonts)
    - [Download required files from Teams](#download-required-files-from-teams)
    - [Set your local npmrc to use Font Awesome pro token registry](#set-your-local-npmrc-to-use-font-awesome-pro-token-registry)
    - [Download the fonts](#download-the-fonts)
  - [Development Tools and Guidelines](#development-tools-and-guidelines)
    - [General Development](#general-development)
    - [API Development](#api-development)

## Setup

See [Pre-Requisites](#pre-requisites), below, if you haven't already installed
the required tools.

### `Install packages`

To install the latest packages, simply run `yarn` from the root folder

---

## Running the application

### `Start`

Note: You no longer need to run a build in watch for `common`. It is
automatically bundled with the web and api packages.

Note: Often you can point your local application environment to the QA
installation of the API, in which case you only need to run the MyRx application
itself.

Again, from the _root_ folder:

```
    yarn myrx
    yarn api
```

`yarn myrx` should open 2 browser windows -- one for the Metro Bundler and one
for the actual web application.

Theoretically, you can launch the application in iOS and/or Android emulators
(never tried and probably needs further setup) from the Metro Bundler.

You can click the "Run in web browser" menu item to launch the web application.
Normally, this happens automatically but, if you accidentally close the web
application and you still have the Metro Bundler open, you can re-launch the web
application that way.

You don't need to keep the Metro Bundler open once the web application has
launched (but you can).

### `Start API from Run and Debug`

To do local debugging for guest-member-api and use break points directly in ts
code you can go to Run and Debug option in VSCode select `Debug API - ts node`
option and press Start debugging button or press F5

#### Audit Resolutions

Note: if `yarn api` or `yarn myrx` fails with an audit failure, then
package.json file at root level needs to be updated to have the failed package's
latest version added in resolutions

```
"**/package-name":">=latest-version"
```

if this new resolutions makes the build fail then try to fix by adding a working
build version instead of latest version

```
**/package-name":"working-version"
```

If there is no working version, thats when you will add the package in allowList
of audit-ci's config file

```
 "allowlist": ["package-name"]
```

### `Storybook`

From the root:

```
    yarn storybook
```

This will launch Storybook in a new browser tab. If you are doing component
development, it is strongly encouraged that you use the Storybook. It provides
an exceptionally quick turn-around for style adjustments and encourages properly
isolated components -- i.e. components that are not dependent upon the context
in which they are used.

See [Component Storybook](./README.storybook.md) for more.

### `Test`

As with most other commands, you can run unit tests from the root folder:

```
    yarn test:common
    yarn test:myrx
    yarn test:api
```

If you only want to run tests that match a particular regex, you can specify the
regex pattern at the end of the command:

```
    yarn test:common appointment.screen
    yarn test:common appointment.screen.test
    yarn test:common context-providers
```

Note: Currently, the above commands run lint, TypeScript, and test coverage in
addition to the unit tests themselves. If you want to bypass that (at your
peril), you can run `yarn jest` from the specific package folders. For example:

```
    ./package/common/yarn jest appointment.screen.test
```

---

### `Linting`

Linting is now handled by ESLint instead of TSLint which has been deprecated for
several years. As part of this change, more lint rules have been added to help
us write safer, cleaner, and more-consistent code. In some cases, this results
in _a lot_ of _warnings_. If you're getting some lint _errors_ but they're hard
to find because of too many warnings, you can run the following command from the
_package_ folder (e.g. **/packages/common**) to see only errors:

```
    yarn lint:errors
```

## Pre-Requisites

### `Ensure you have admin rights`

Ensure you have admin rights on your machine. Setting up your environment and
tooling without admin privileges may yield unexpected results.

- Node 16.x
- NPM >=8.1.2
- Yarn
- Expo CLI
- VSCode & extensions

### `Install tools`

- install Node 16 (includes Npm)
  - Recommended: NVM
    - Windows [NVM For Windows](https://github.com/coreybutler/nvm-windows)
    - Mac: In a terminal, run `brew install nvm`
    - After installing nvm, run `nvm install 16`, then `nvm use 16`
  - Direct from Source: https://nodejs.org/
- install Yarn: `npm install -g yarn`
- install Expo CLI: `npm install -g expo-cli@6.1.0`

### `Install VS Code and extensions`

Download VSCode from https://code.visualstudio.com/Download and install.

When opening the repository in VSCode, look for a notification in the bottom
right of the app that asks to install all recommended workplace extensions.
Choose the install option.

### Accessing Private NPM Repository

#### `Windows`

##### `Get VSTS Access Token`

###### `First Time Setup`

After you have installed NodeJS, run the following:

```
    npm install -g vsts-npm-auth
    vsts-npm-auth -config .npmrc
```

> `NOTE`: If you get an error indicating that scripts are disabled, you'll need
> to set the Powershell execution policy to **RemoteSigned**
>
> 1. Open Powershell as an _administrator_ user.
> 1. Execute the following `set-executionpolicy -execution-policy RemoteSigned`
> 1. Answer "Y" to the prompt.
> 1. Re-run the vsts-npm-auth command, above.

###### `Regenerate New VSTS Token`

```
yarn vsts-npm-auth -config .npmrc -F
```

It will generate a new token to access prescryptive npm registry.

-

Note: If yarn setup is not working for you and running yarn vsts-npm-auth
-config .npmrc -F does not generate a new token (credentials for npm registry),
try running the command without -config

```
yarn vsts-npm-auth .npmrc -F
```

#### `Mac`

##### `Add your azure devops base64 encoded personal access token to your .npmrc file`

1. Open
   [Connect to Feed](https://dev.azure.com/prescryptive/Engineering/_artifacts/feed/prescryptive/connect/npm)
2. Click `Other` under `Project Setup`
3. Follow the instructions on screen

> `NOTE` `Copy the code below to your user .npmrc` refers to .npmrc file in your
> root directory `~/.npmrc`

### `Get the code`

- git clone
  https://prescryptive.visualstudio.com/Engineering/_git/prescryptive-experiences

### `Get current environment files`

Both the MyRx application and API require specific environment configurations in
order access external APIs, databases, log telemetry, etc.

#### `MyRx Application Environment File`

From the
[**myrx-ux/env-test**](https://prescryptivehealth.sharepoint.com/:f:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/env-test?csf=1&web=1&e=FigtXP)
folder of the "Files" tab in the
[**Product - MyRx** Teams channel](https://teams.microsoft.com/l/channel/19%3a046628fd662b498baab6c5bcc865a5d6%40thread.skype/Product%2520-%2520MyRx?groupId=eafeeb1c-2120-483b-8237-f83a0a148128&tenantId=d100e6e9-594f-4c5f-abbe-0eaa95dd2870):

1. Download **env.guest-member-web.md**
1. Rename the file to **.env**
1. Copy **.env** to **packages/myrx**
1. Create a mapping between **myrx-api.test.prescryptive.io** and your machine's
   _internal IP address_ in **C:\Windows\System32\drivers\etc\hosts**

Note: If you want to run the application using the QA-deployed API instead of
running the API locally, edit the **.env** file, comment out the "Local API"
environment variables, and uncomment the "QA API" environment variables:

```
#### Local API

#REACT_APP_CONFIG_GUESTMEMBEREXPERIENCE_HOST=myrx-api.test.prescryptive.io
#REACT_APP_CONFIG_GUESTMEMBEREXPERIENCE_PORT=4300

#### QA API

REACT_APP_CONFIG_GUESTMEMBEREXPERIENCE_HOST=test.myrx.io
REACT_APP_CONFIG_GUESTMEMBEREXPERIENCE_PORT=443

```

#### `API Environment File`

From the
[**myrx-ux/env-test**](https://prescryptivehealth.sharepoint.com/:f:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/env-test?csf=1&web=1&e=FigtXP)
folder of the "Files" tab in the
[**Product - MyRx** Teams channel](https://teams.microsoft.com/l/channel/19%3a046628fd662b498baab6c5bcc865a5d6%40thread.skype/Product%2520-%2520MyRx?groupId=eafeeb1c-2120-483b-8237-f83a0a148128&tenantId=d100e6e9-594f-4c5f-abbe-0eaa95dd2870):

1. Download **env.guest-member-api.test.md**
1. Copy the file to **packages/guest-member-api** (_don't_ rename the file to
   **.env**)

#### `Add myrx-api.test.prescryptive.io to hosts file`

On Windows, add the following to **/windows/system32/driver/etc/hosts**

```
127.0.0.1   myrx-api.test.prescryptive.io
```

> **Note**: You may need to specify your machine's local IP, rather than
> 127.0.0.1.

For Mac, you can run `nano /etc/hosts` in your terminal to set your host.

> **End of Pre-Requisites**
>
> Do not run any of the steps below, especially those regarding **FontAwesome
> Pro**, before you finish the [Setup](#setup) step at the start of this README.

---

## Package management

No longer should we be manually editing **package.json** files to add or remove
dependent packages. Just use the normal `yarn` commands:

| Operation                    | Command                        |
| ---------------------------- | ------------------------------ |
| Add run-time dependencies    | `yarn add some_packages`       |
| Add development dependencies | `yarn add --dev some_packages` |
| Remove dependencies          | `yarn remove some-packages`    |

---

## Download FontAwesome Pro fonts

### Download required files from Teams

1. Download **myrx-ux/FontAwesomePro** folder from the "Files" tab in the
   **Product - MyRx** Teams channel. Link to the folder is
   https://prescryptivehealth.sharepoint.com/:f:/r/sites/Engineering/Shared%20Documents/Product%20-%20MyRx/myrx-ux/FontAwesomePro?csf=1&web=1&e=18XPIg

2. It will download FontAwesomePro.zip file

3. Unzip this file. It should have 2 files fontawesome-pro-token.txt and
   package.json

### Set your local npmrc to use Font Awesome pro token registry

1. Open the FontAwesomePro folder in VScode

2. Run below commands in VScode. Replace the TOKEN with the content from
   fontawesome-pro-token.txt

```
npm config set "@fortawesome:registry" https://npm.fontawesome.com/

npm config set "//npm.fontawesome.com/:_authToken" TOKEN
```

### Download the fonts

1. In same VScode terminal run this command

```
yarn add @fortawesome/fontawesome-pro
```

> **Note**: Above command will download latest version of font awesome pro. In
> order to dowload any other version, add that version at the end of command.

```
yarn add @fortawesome/fontawesome-pro@5.13.1
```

2. In FontAwesomePro\mode_modules it will have a new folder @fortawesome

3. Fonts can be found at node_modules\@fortawesome\fontawesome-pro\webfonts

4. The ttf files needs to be renamed and copied in packages\myrx\assets\fonts
   fa-brands-400.ttf to FontAwesome5_Pro_Brands.ttf

   fa-light-300.ttf to FontAwesome5_Pro_Light.ttf

   fa-regular-400.ttf to FontAwesome5_Pro_Regular.ttf

   fa-solid-900.ttf to FontAwesome5_Pro_Solid.ttf

5. Download the glyph maps file from here
   https://github.com/oblador/react-native-vector-icons/blob/master/glyphmaps/FontAwesome5Pro.json
   > **Note**: May need to check if the version we are using is supported here

---

## Troubleshoot

### Here are some potential issues on environment installation for the local setup and steps to solve the problems.

#### - Whiling installing packages from _`yarn`_ command, **_`unauthorized - 404`_** issue can be found. (check below).

```
error An unexpected error occurred: "https://pkgs.dev.azure.com/prescryptive/_packaging/prescryptive/npm/registry/@fortawesome/fontawesome-svg-core/-/fontawesome-svg-core-1.2.36.tgz: Request failed \"401 Unauthorized\"".
```

> **Why?** This happens because there are multiple `.npmrc` files existing at
> both local and global path.

1. Remove _`.npmrc`_ file at `"C:\Users\[your user name]"`.
2. Replace _`.npmrc`_ file at _`npm`_ path (normally
   `"C:\Program Files\nodejsx\node_modules\npm"`) with local _`.npmrc`_ file or
   just copy content to Global _`.npmrc`_ file.
3. For the next step, you should follow
   [Accessing Private NPM Repository](#accessing-private-npm-repository) to
   generate _`VSTS` token_ or just type following command.

   ```
   vsts-npm-auth -config .npmrc
   ```

## Development Tools and Guidelines

### General Development

- [General Code Development](./README.development.md)

### API Development

- [Adding and using API environment variables](./packages/guest-member-api/README.environment-variables.md)

---
