# Component Storybook

The component storybook is an extremely useful tool to add in the development
and visual validation of components. It allows you to develop components
independently from the screens/containers in which they will be used. This, in
turn, speeds up component development time and results in more robust components
because they can be developed without making assumptions about the context in
which they will be used.

## Table of Contents:

- [Running Storybook](#running-storybook)
- [Creating stories](#creating-stories)
  - [The new way](#the-new-way)
  - [The old way](#the-old-way)
- [Further reading](#further-reading)

## Running Storybook

1. In terminal, go to **./packages/common**
1. Execute `yarn storybook`

The storybook should launch in a new browser window (e.g.
http://localhost:60771/) with all of your existing stories listed. Click on a
story and play! Couldn't get much easier than that!

## Creating stories

### The new way

A given component's stories should now be held in a **.stories.tsx** file _in
the same folder_ as the component to which it applies. See
**base-text.stories.tsx** and **primary-button.stories.tsx** for examples.

### The old way

With the old storybook, a separate package was needed (at least how we used it)
for the storybook web application and the code for all of the component stories
was held in **.stories.tsx** files in that separate package. Further, the
storybook application was not built as part of the PR process so it was
frequently broken by component changes that were not also accounted for in the
component story code. These breakages were only discovered after-the-fact by a
developer wanting to update stories for new components and/or component changes.

Also, since the story code was separate from the components themselves, even if
the application was not broken, new component functionality would almost
invariably not have corresponding story updates, making the existing stories
incomplete and less useful over time.

## Further reading

Lots more details can be found at https://storybook.js.org/docs/react.

## Initial setup

These are the steps used to initially set up storybook in this environment. This
is just for reference in case it needs to repeated somewhere else.

From **/packages/common**...

```
npx sb init --type react  (answer "Y" to prompt for eslint plugin)
yarn add @storybook/addon-react-native-web @storybook/addon-a11y --dev
```

Edit **.eslintrc.json**:

```
  ...
  "extends": [
    /*existing extensions*/
    "plugin:storybook/recommended"
  ]
  ...
```

Edit **.storybook/main.js**:

```
module.exports = {
  addons: [
    /*existing addons,*/
    '@storybook/addon-react-native-web',
    '@storybook/addon-a11y'
  ]
}
```
