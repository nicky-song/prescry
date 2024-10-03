# Code Development Tools and Guidelines

## Table of Contents:

- [Debugging](#debugging)
- [Working with Text](#working-with-text)
  - [BaseText](#basetext)
  - [Specifying font family, weight, and style](#specifying-font-family-weight-and-style)
  - [Specifying font size](#specifying-font-size)
- [Dates and Time](#dates-and-time)
  - [Getting the current date/time](#getting-the-current-datetime)
- [Navigation](#navigation)
  - [Navigation stack](#navigation-stacks)
  - [Getting a component's navigation context](#getting-a-components-navigation-context)
  - [Passing properties to screens](#passing-properties-to-screens)
- [Test ids](#test-ids)
- [VSC Snippets](#vsc-snippets)

---

## Debugging

### API

The command `yarn debug:api` will start the API project in debug mode (using
`ts-node`). This will enable breakpoints to be set in VSCode. The GUI debugger
can also be used (`ctrl + shift + D`) to launch the script option `Debug API`.
Debugging mode will also allow inspection of in scope variable values and the
call stack.

## Working with Component Text

### `BaseText`

When adding text elements to a component, we should no longer be directly using
the React Native `Text` component. Instead, use the `BaseText` component. Using
this component gives us the default font attributes we want for our application.
Only in cases where we wish to deviate from the default body style (e.g.
different weight, family, size) do we need to specify anything for the
`textStyle` property of `BaseText`.

### `Specifying font family, weight, and style`

With Expo, we can no longer directly specify the `fontFamily`, `fontWeight`, and
`fontStyle` style properties for text component as, for some fonts, these are
all determined by the specific font file selected. To encapsulate this
complexity, the utility method `getFontFace()` should be used.

**Old way**

```
  const textStyle: TextStyle = {
    fontFamily: 'Poppins',
    fontWeight: FontWeight.bold,
    fontStyle: 'italic'
  };
```

**New way**

```
  const textStyle: TextStyle = {
    ...getFontFace({ family: 'Poppins', weight: FontWeight.bold, style: 'italic' })
  };
```

All `getFontFace()` method properties default. If not otherwise specified, the
following defaults are assumed:

```
  family: 'OpenSans'
  weight: regular
  style: undefined
```

So, for example, if you only need to set the weight on the default font to bold,
you need/should only, use this:

```
  ...getFontFace({ weight: FontWeight.bold })
```

### `Specifying font size`

Accessibility guidelines dictate that text line height should be no less than
1.5 times the font size in order to provide sufficient spacing between lines. To
help conform to this guideline, we should no longer directly set the `fontSize`
style property. Instead, use the `getFontDimensions()` utility method which will
return both the `fontSize` and `lineHeight` properties with the latter being the
pixel size calculated from the specified `fontSize`.

**Old way**

```
  const textStyle: TextStyle = {
    fontSize: FontSize.small
  };
```

**New way**

```
  const textStyle: TextStyle = {
    ...getFontDimensions(FontSize.small)
  };
```

By default, `getFontDimensions()` assumes a line height scale factor of 1.5.
Rarely, you may need a different line height. In these cases, you can specify
the desired line height scale factor as a second argument. For example,

```
  const textStyle: TextStyle = {
    ...getFontDimensions(FontSize.large, 2)
  };

```

---

## Dates and Time

### `Getting the current date/time`

Avoid using `new Date()` or `Date.now()` in non-test code as it can be awkward
to mock properly in unit tests and, if done incorrectly, can result in sporadic
test failures due to different execution speeds in different environments.
Instead, use the `getNewDate()` utility method. For example:

**Don't**

```
  const now = new Date();
```

**Do**

```
  const now = getNewDate();
```

Then, in unit tests, we can simply mock `getNewDate()` to return a known value:

```
import { getNewDate } from '../../../utils/date-time/get-new-date';
...
jest.mock('../../../utils/date-time/get-new-date');
const getNewDateMock = getNewDate as jest.Mock;
...
const nowMock = new Date();
getNewDateMock.mockReturnValue(nowMock);
...
expect(something).toEqual(nowMock);
```

---

## Navigation

### `Navigation stacks`

Navigation stacks define related screens and the properties, if any, those
screens take. Further, they define the context(s) available to all screens
within the stack. For example, the "Drug search" stack is the only place the
drug search context is available.

To add a new screen to a given stack navigator (e.g. in
**root.stack-navigator.tsx**):

1. Add the screen name property to the "ParamList" type (don't specify a
   `Screen` suffix). If the screen has no route properties (see
   [Passing properties to screens](#passing-properties-to-screens)), specify
   `undefined` as the property type; otherwise, specify the route properties
   interface type:

```
export type RootStackParamList = {
  Splash: undefined;
  FatalError: undefined;
  SupportError: undefined;
  UnauthHome: undefined;
  PhoneNumberLogin: IPhoneNumberLoginScreenRouteProps;
  PhoneNumberVerification: IPhoneNumberVerificationScreenRouteProps;
  VerifyIdentityVerificationCode: undefined;
  LoginPin: ILoginPinScreenRouteProps;
  CreateAccount: ICreateAccountScreenRouteProps;
  Home: IHomeScreenRouteProps;
  DrugSearchStack: Partial<{
    screen: DrugSearchStackScreenName;
    params: unknown;
  }>;
};
```

2. Create a `StackNavigationProp` type for the screen. This is what you'll
   specify to type the `useNavigation()` hook:

```
export type PhoneNumberLoginNavigationProp = ScreenNavigationProp<'PhoneNumberLogin'>;
```

3. If the screen has route properties, create a `RouteProp` type for the screen.
   This is what you'll specify to type the `useRoute()` hook:

```
export type PhoneNumberLoginRouteProp = ScreenRouteProp<'PhoneNumberLogin'>;
```

4. Add the screen as a child of the `Stack.Navigator` component:

```
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name='Splash' component={SplashScreenConnected} />
        <Stack.Screen name='FatalError' component={ConnectedFatalErrorScreen} />
        <Stack.Screen
          name='SupportError'
          component={ConnectedSupportErrorScreen}
        />
        <Stack.Screen name='UnauthHome' component={UnauthHomeScreen} />
        <Stack.Screen
          name='PhoneNumberLogin'
          component={PhoneNumberLoginScreenConnected}
        />
        <Stack.Screen
          name='PhoneNumberVerification'
          component={PhoneNumberVerificationScreenConnected}
        />
        <Stack.Screen
          name='VerifyIdentityVerificationCode'
          component={VerifyIdentityVerificationCodeScreenConnected}
        />
        <Stack.Screen name='LoginPin' component={ConnectedLoginPinScreen} />
        <Stack.Screen name='Home' component={HomeScreenConnected} />
        <Stack.Screen
          name='DrugSearchStack'
          component={DrugSearchStackNavigator}
        />
      </Stack.Navigator>
    </NavigationContainer>
```

### `Getting a component's navigation context`

You can get the navigation context for a _functional_ component with the
`useNavigation()` hook typed to the screen's navigation type (defined in the
screen's stack navigator):

```

const navigation = useNavigation<HomeNavigationProp>();

```

Use the navigation context to navigate onwards (often, by passing the context to
async actions).

Navigating back in the stack is a simple `navigation.goBack()` call.

For consistency, make the `useNavigation()` call the first line in the
component.

**Note:** Use `useNavigation()` from **@react-navigation/native** instead of
**@react-navigation/core**. I don't think there's a functional difference
between the two but you can avoid annoying test failures if you accidentally
mock out a different`useNavigation()` than the one used in the component being
tested. If we always use the same one, it's easier to figure out.

### `Passing properties to screens`

#### `Sending`

Sending is easy. Just include an object in the 2nd parameter of
`navigation.navigate()`. Example:

```

navigation.navigate('LoginPin', pinScreenParams)

```

#### `Receiving`

Unfortunately, React Navigation doesn't send properties to screens the way we're
used to with Redux. Properties passed through navigation don't come through as
component properties but, rather, must be retrieved from the screen's route
information with the `useRoute()` hook.

For example, in **loginPinScreen.tsx**, we have:

```

const { params } = useRoute<LoginPinRouteProp>(); const { workflow, isUpdatePin
= false } = params;

```

To facilitate this, we create an interface in the screen file defining "route"
properties:

```

export interface ILoginPinScreenRouteProps { isUpdatePin?: boolean; workflow?:
Workflow; }

```

---

## Test ids

When defining the string for a `testID` property, use the _camelcase_ name of
the parent component followed by the name of the type of sub-component, if
applicable. For the outermost, sub-component, just use the name of the parent
component itself.

For example, if you had a search box sub-component in the
`FindYourPharmacyScreen` component, the testID would be specfied like this:

> testID='findYourPharmacyScreen'

> testID='findYourPharmacyScreenSearchBox'

Sometimes, the testID element attribute can be dynamic. In these cases, the
standard is to dynamic put separated with a `-` character.

Some examples:

> testID={\`findYourPharmacyCard-${pharmacy.ncpdp}\`}

> testID={\`appointmentScreen-${caption}-Button\`}

---

## VSC snippets

A number of Visual Studio Code (VSC) snippets have been developed to simplify
common tasks. Type the snippet name into VSC in a file of the appropriate type
and select the snippet from the dropdown list.

Some snippets take paramaters. In those cases, the snippet will be presented
with the cursor positioned where the first parameters will be place. Type in the
parameter name and press the <tab> key to complete the snippet or advance to the
next parameter.

| Snippet name      | Command      | Description                                  | Applies to | Parameters                  |
| ----------------- | ------------ | -------------------------------------------- | ---------- | --------------------------- |
| Component         | `comp`       | Generate component skeleton                  | .tsx       | component name              |
| Content           | `cont`       | Generate component content file skeleton     | .ts        | component name              |
| Copyright         | `copy`       | Inserts copyright notice for current year    | .ts, .tsx  | n/a                         |
| ImportReact       | `ireact`     | Insert React import statement                | .tsx       | n/a                         |
| ImportReactNative | `irn`        | Insert React Native import statement         | .ts,.tsx   | component/type name(s)      |
| MockReact         | `mockreact`  | Insert mock statement for React function     | .tsx       | function name               |
| Stories           | `copy`       | Generate component stories file skeleton     | .tsx       | component name; story group |
| Styles            | `styles`     | Generate component styles file skeleton      | .ts        | component name              |
| Test              | `test`       | Generate generic test file skeleton          | .ts        | test name                   |
| TestComponent     | `test`       | Generate component test file skeleton        | .tsx       | component name              |
| TestStyles        | `teststyles` | Generate component styles test file skeleton | .ts        | component name              |

---

## TODO

- Component files (naming, styles, etc.) -- see README-development.md in /myrx
  folder
