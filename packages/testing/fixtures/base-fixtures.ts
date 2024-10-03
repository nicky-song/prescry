// Copyright 2023 Prescryptive Health, Inc.

import { test as base } from '@playwright/test';
import { existsSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { decode } from 'jsonwebtoken';
import moment from 'moment';
import { UnableToUseLocalStorageForLogin } from '../exceptions/unable-to-use-local-storage-for-login';
import { CashUserType, LoginInfo, PbmUserType, UserOptions } from './../types';
import { deviceIdentifierService } from '../services/device-identifier-service';
import readJSonFileAndParseIt from '../utilities/json-reader';
import {
  getAppSettings,
  getLocalStorageName,
} from '../utilities/local-storage-helper';
import {
  AccountInformationScreen,
  AccountLockedScreen,
  AppointmentConfirmationScreen,
  AppointmentScreen,
  AuthHomePage,
  CreateAccountScreen,
  CreatePinScreen,
  DrugSearchHomeScreen,
  FavoritePharmacyScreen,
  FindLocationScreen,
  FindYourPharmacyScreen,
  DigitalIdCardScreen,
  HomeScreen,
  LoadingOverlay,
  LoginPinScreen,
  LoginScreen,
  MedicineCabinetScreen,
  OrderConfirmationScreen,
  PastProceduresListScreen,
  PharmacyLocationsScreen,
  PhoneNumberLoginScreen,
  PhoneNumberVerificationScreen,
  PickAPharmacy,
  RecoveryEmailModal,
  SelectLanguageScreen,
  ServicesList,
  SmartPriceScreen,
  SplashScreen,
  StripeCheckoutScreen,
  UnauthHomePage,
  VerifyIdentityScreen,
  VerifyIdentitySendCodeScreen,
  VerifyIdentityVerificationCodeScreen,
  VerifyPinScreen,
  VerifyPrescriptionScreen,
  WhatComesNextScreen,
  PbmMemberBenefitsPage,
} from '../pages';

import { waitForPhoneNumber } from '../tests/test-partials';
import {
  AccountLockService,
  PhoneService,
  PinService,
  IdentityService,
  UserService,
  BenefitService,
} from '../services';
import { getOTPMessage } from '../utilities';
import { accountTemplate } from '../test-data';
import { PatientAccountService } from '../services/external';
import { PersonRepository } from '../data-access';
import { RxAssistanceDbContext } from '../data-access/rx-assistance';

const LOCAL_STORAGE_SETTINGS_KEY = 'appSettings';

export const test = base.extend<{
  accountLockedScreen: AccountLockedScreen;
  accountInformationScreen: AccountInformationScreen;
  appointmentConfirmationScreen: AppointmentConfirmationScreen;
  appointmentScreen: AppointmentScreen;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appSettings: () => Promise<any | undefined>;
  authHomePage: AuthHomePage;
  createAccountScreen: CreateAccountScreen;
  createPinScreen: CreatePinScreen;
  drugSearchHomeScreen: DrugSearchHomeScreen;
  favoritePharmacyScreen: FavoritePharmacyScreen;
  findLocationScreen: FindLocationScreen;
  findYourPharmacyScreen: FindYourPharmacyScreen;
  digitalIdCardScreen: DigitalIdCardScreen;
  homeScreen: HomeScreen;
  loginPinScreen: LoginPinScreen;
  loadingOverlay: LoadingOverlay;
  login: (loginInfo: LoginInfo) => Promise<void>;
  loginScreen: LoginScreen;
  loginWithOTP: (loginInfo: LoginInfo) => Promise<void>;
  medicineCabinetScreen: MedicineCabinetScreen;
  oneTimePassword: (
    phoneNumber: string,
    trigger?: () => Promise<void>
  ) => Promise<void>;
  orderConfirmationScreen: OrderConfirmationScreen;
  pastProceduresListScreen: PastProceduresListScreen;
  pharmacyLocationsScreen: PharmacyLocationsScreen;
  phoneNumberVerificationScreen: PhoneNumberVerificationScreen;
  phoneNumberLogin: PhoneNumberLoginScreen;
  pickAPharmacy: PickAPharmacy;
  recoveryEmailModal: RecoveryEmailModal;
  selectLanguageScreen: SelectLanguageScreen;
  servicesList: ServicesList;
  smartPriceScreen: SmartPriceScreen;
  splashScreen: SplashScreen;
  stripeCheckoutScreen: StripeCheckoutScreen;
  tryLoginWithStorage: (loginInfo: LoginInfo) => Promise<void>;
  unauthHomePage: UnauthHomePage;
  verifyIdentityScreen: VerifyIdentityScreen;
  verifyIdentitySendCodeScreen: VerifyIdentitySendCodeScreen;
  verifyIdentityVerificationCodeScreen: VerifyIdentityVerificationCodeScreen;
  verifyPinScreen: VerifyPinScreen;
  verifyPrescriptionScreen: VerifyPrescriptionScreen;
  whatComesNextScreen: WhatComesNextScreen;
  pbmMemberBenefitsPage: PbmMemberBenefitsPage;
  waitUntilProgressBarDisappeared: (
    triggerAction: () => Promise<void>,
    timeoutForProgressBarToDisappear?: number
  ) => Promise<void>;
  waitUntilOverlayLoadingDisappeared: (
    triggerAction: () => Promise<void>,
    timeoutForLoadingOverlayToDisappear?: number
  ) => Promise<void>;
  waitForAccount: <T>(
    phoneNumber: string,
    isShared: boolean,
    previousKey?: string,
    query?: () => Promise<T>
  ) => Promise<{
    key: string;
    queryResult?: T;
    unlock: () => Promise<void>;
  }>;
  waitForPhoneNumber: (phoneNumber: string) => Promise<{
    key: string;
    unlock: () => Promise<void>;
    consumedTime: number;
  }>;
  generateLocalStorage: (
    phoneNumberDialingCode: string,
    phoneNumber: string
  ) => Promise<void>;
  createPin: (loginInfo: LoginInfo) => Promise<void>;
  getPbmUser: (pbmUser, options?: UserOptions) => Promise<PbmUserType>;
  getCashUser: (
    user: CashUserType,
    exclusive?: boolean
  ) => Promise<{ unlock: () => Promise<void> }>;
  rxAssistanceDbContext: () => Promise<RxAssistanceDbContext>;
}>({
  accountLockedScreen: async ({ page }, use) => {
    await use(new AccountLockedScreen(page));
  },
  accountInformationScreen: ({ page }, use) =>
    use(new AccountInformationScreen(page)),
  appSettings: async ({ baseURL, context }, use) => {
    await use(async () => {
      const storageState = await context.storageState();

      return getAppSettings(
        storageState.origins,
        baseURL as string,
        LOCAL_STORAGE_SETTINGS_KEY
      );
    });
  },
  appointmentConfirmationScreen: async ({ page }, use) => {
    await use(new AppointmentConfirmationScreen(page));
  },
  appointmentScreen: async ({ page }, use) => {
    await use(new AppointmentScreen(page));
  },
  authHomePage: async ({ page }, use) => {
    await use(new AuthHomePage(page));
  },
  createAccountScreen: async ({ page }, use) => {
    await use(new CreateAccountScreen(page));
  },
  createPinScreen: async ({ page }, use) => {
    await use(new CreatePinScreen(page));
  },
  drugSearchHomeScreen: async ({ page }, use) => {
    await use(new DrugSearchHomeScreen(page));
  },
  favoritePharmacyScreen: async ({ page }, use) => {
    await use(new FavoritePharmacyScreen(page));
  },
  findLocationScreen: async ({ page }, use) => {
    await use(new FindLocationScreen(page));
  },
  digitalIdCardScreen: async ({ page }, use) => {
    await use(new DigitalIdCardScreen(page));
  },
  loadingOverlay: async ({ page }, use) => {
    await use(new LoadingOverlay(page));
  },
  loginWithOTP: async (
    {
      unauthHomePage,
      waitUntilOverlayLoadingDisappeared,
      oneTimePassword,
      loginPinScreen,
      generateLocalStorage,
    },
    use
  ) =>
    await use(async (loginInfo: LoginInfo) => {
      const { phoneNumberDialingCode, phoneNumber, pin } = loginInfo;

      await unauthHomePage.goto();
      await unauthHomePage.goToLogin();
      await oneTimePassword(phoneNumber);
      // Login with Pin
      await loginPinScreen.enterPin(pin);
      await waitUntilOverlayLoadingDisappeared(loginPinScreen.login, 30 * 1000);

      await generateLocalStorage(phoneNumberDialingCode, phoneNumber);
    }),
  login: async (
    { tryLoginWithStorage, loginWithOTP, waitForPhoneNumber },
    use
  ) =>
    await use(async (loginInfo: LoginInfo) => {
      const { phoneNumberDialingCode, phoneNumber, pin } = loginInfo;
      if (!phoneNumber || !phoneNumberDialingCode || !pin) {
        throw new Error(`Wrong login info ${JSON.stringify(loginInfo)}`);
      }
      const exclusiveLock = await test.step(
        `Waiting for phone ${loginInfo.phoneNumber}`,
        async () => {
          return await waitForPhoneNumber(loginInfo.phoneNumber);
        }
      );
      if (exclusiveLock.consumedTime > 10000) {
        test.slow();
      }
      try {
        await test.step('Login with local storage', () =>
          tryLoginWithStorage(loginInfo)
        );
      } catch (error) {
        if (error instanceof UnableToUseLocalStorageForLogin) {
          test.slow();
          await test.step(
            `Login with One Time Password for ${phoneNumber}`,
            async () => {
              await loginWithOTP(loginInfo);
            }
          );
        } else {
          throw error;
        }
      } finally {
        await test.step(
          `Phone login unlocked ${loginInfo.phoneNumber}`,
          async () => {
            await exclusiveLock?.unlock();
          }
        );
      }
    }),
  loginScreen: async ({ page }, use) => {
    await use(new LoginScreen(page));
  },
  loginPinScreen: async ({ page }, use) => {
    await use(new LoginPinScreen(page));
  },
  homeScreen: async ({ page }, use) => {
    await use(new HomeScreen(page));
  },
  medicineCabinetScreen: async ({ page }, use) => {
    await use(new MedicineCabinetScreen(page));
  },
  pharmacyLocationsScreen: async ({ page }, use) => {
    await use(new PharmacyLocationsScreen(page));
  },
  phoneNumberVerificationScreen: async ({ page }, use) => {
    await use(new PhoneNumberVerificationScreen(page));
  },
  phoneNumberLogin: async ({ page }, use) => {
    await use(new PhoneNumberLoginScreen(page));
  },
  pickAPharmacy: async ({ page }, use) => {
    await use(new PickAPharmacy(page));
  },
  pastProceduresListScreen: async ({ page }, use) => {
    await use(new PastProceduresListScreen(page));
  },
  oneTimePassword: async (
    {
      page,
      phoneNumberLogin,
      phoneNumberVerificationScreen,
      waitUntilOverlayLoadingDisappeared,
    },
    use
  ) => {
    await use(async (phoneNumber, trigger) => {
      if (!trigger) {
        await phoneNumberLogin.fillPhoneNumber(phoneNumber);
        await phoneNumberLogin.acceptTermsAndConditions();
      }
      const beginTime = await test.step(
        `Get the last message time for phone number ${phoneNumber}`,
        async () => await PhoneService.getLastMessageTime(phoneNumber)
      );
      const requestPromise = page.waitForRequest(
        `https://${process.env.MY_PRESCRYPTIVE_URL}/api/one-time-password/send`
      );
      if (trigger) {
        await trigger();
      } else {
        await phoneNumberLogin.continueWithLogin();
      }
      const response = await (await requestPromise).response();
      test.expect(response?.status()).toBe(200);
      test
        .expect(
          'One time password abnormal failure check. It may be caused because of too many requests',
          await response?.json()
        )
        .not.toEqual({
          message: 'Check OTP not to be Internal Server Error',
          status: 'failure',
        });
      const phoneNumberVerificationCode = await test.step(
        `Get OTP Message for phone number ${phoneNumber} and fill it`,
        () =>
          getOTPMessage(page, {
            twilioPhoneNumber: phoneNumber,
            delay: 500,
            beginTime,
          })
      );

      await phoneNumberVerificationScreen.fillPhoneVerificationCode(
        phoneNumberVerificationCode
      );

      await waitUntilOverlayLoadingDisappeared(
        phoneNumberVerificationScreen.confirmPhoneVerificationCode
      );
      // eslint-disable-next-line no-console
      console.log(`End OTP for ${phoneNumber}`);
    });
  },
  orderConfirmationScreen: async ({ page }, use) => {
    await use(new OrderConfirmationScreen(page));
  },
  recoveryEmailModal: async ({ page }, use) => {
    await use(new RecoveryEmailModal(page));
  },
  findYourPharmacyScreen: ({ page }, use) =>
    use(new FindYourPharmacyScreen(page)),
  smartPriceScreen: ({ page }, use) => use(new SmartPriceScreen(page)),
  selectLanguageScreen: async ({ page }, use) => {
    await use(new SelectLanguageScreen(page));
  },
  servicesList: async ({ page }, use) => {
    await use(new ServicesList(page));
  },
  splashScreen: async ({ page }, use) => {
    await use(new SplashScreen(page));
  },
  stripeCheckoutScreen: async ({ page }, use) => {
    await use(new StripeCheckoutScreen(page));
  },
  waitUntilProgressBarDisappeared: async ({ splashScreen }, use) => {
    await use(async (triggerAction, timeoutForProgressBarToDisappear) => {
      await test.step(
        'Waiting for the application to end loading',
        async () => {
          await Promise.all([
            triggerAction(),
            splashScreen.waitUntilContentIsShown(),
          ]);
          await splashScreen.waitUntilContentIsHidden(
            timeoutForProgressBarToDisappear
          );
        }
      );
    });
  },
  whatComesNextScreen: async ({ page }, use) => {
    await use(new WhatComesNextScreen(page));
  },
  pbmMemberBenefitsPage: async ({ page }, use) => {
    await use(new PbmMemberBenefitsPage(page));
  },
  tryLoginWithStorage: async (
    {
      baseURL,
      loginPinScreen,
      unauthHomePage,
      waitUntilOverlayLoadingDisappeared,
      waitUntilProgressBarDisappeared,
      page,
    },
    use
  ) =>
    await use(async (loginInfo: LoginInfo) => {
      const { phoneNumberDialingCode, phoneNumber, pin } = loginInfo;

      // Get Local Storage File Name
      const localStorageName = getLocalStorageName(
        phoneNumberDialingCode,
        phoneNumber
      );

      // Check if Local Storage exists for the Phone
      if (!existsSync(localStorageName)) {
        test.info().annotations.push({
          type: 'info',
          description: `No local storage for phone ${phoneNumber}`,
        });
        throw new UnableToUseLocalStorageForLogin();
      }

      const storageState = readJSonFileAndParseIt(localStorageName);

      // Get Application Settings
      const appSettings = getAppSettings(
        storageState.origins,
        baseURL as string,
        LOCAL_STORAGE_SETTINGS_KEY
      );

      if (!appSettings) {
        test.info().annotations.push({
          type: 'info',
          description: `Missing settings for phone ${phoneNumber}`,
        });
        throw new UnableToUseLocalStorageForLogin();
      }

      // Validate Device Token expiration time
      const decodedToken = decode(appSettings.deviceToken) as jwt.JwtPayload;

      const epochNow = moment(moment.now());
      if (epochNow.isAfter((decodedToken.exp as number) * 1000)) {
        test.info().annotations.push({
          type: 'info',
          description: `Token expired for phone ${phoneNumber}`,
        });
        throw new UnableToUseLocalStorageForLogin();
      }

      // Store Device Identifier for the Phone
      await deviceIdentifierService.storeDeviceIdentifier(
        phoneNumberDialingCode,
        phoneNumber,
        decodedToken.deviceIdentifier,
        JSON.stringify({
          deviceToken: appSettings.deviceToken,
        })
      );

      // Removing token from appSettings to always go to Enter Pin screen
      delete appSettings.token;
      const appSettingsStringified = JSON.stringify(appSettings);

      await unauthHomePage.goto();

      // Set AppSettings in the Page
      await page.evaluate(
        `window.localStorage.setItem('${LOCAL_STORAGE_SETTINGS_KEY}', '${appSettingsStringified}');`
      );

      await waitUntilProgressBarDisappeared(
        () => unauthHomePage.goto(),
        60 * 1000
      );

      // Login with Pin
      await loginPinScreen.enterPin(pin);
      await waitUntilOverlayLoadingDisappeared(loginPinScreen.login, 60 * 1000);
    }),
  unauthHomePage: async ({ page }, use) => {
    await use(new UnauthHomePage(page));
  },
  verifyIdentityScreen: async ({ page }, use) => {
    await use(new VerifyIdentityScreen(page));
  },
  verifyIdentitySendCodeScreen: async ({ page }, use) => {
    await use(new VerifyIdentitySendCodeScreen(page));
  },
  verifyIdentityVerificationCodeScreen: async ({ page }, use) => {
    await use(new VerifyIdentityVerificationCodeScreen(page));
  },
  verifyPinScreen: async ({ page }, use) => {
    await use(new VerifyPinScreen(page));
  },
  verifyPrescriptionScreen: async ({ page }, use) => {
    await use(new VerifyPrescriptionScreen(page));
  },

  waitUntilOverlayLoadingDisappeared: async ({ loadingOverlay }, use) => {
    await use(async (triggerAction, timeoutForLoadingOverlayToDisappear) => {
      await test.step(
        'Waiting for the application to end loading',
        async () => {
          await Promise.all([
            triggerAction(),
            loadingOverlay.waitUntilContentIsShown(
              timeoutForLoadingOverlayToDisappear
            ),
          ]);
          await loadingOverlay.waitUntilContentIsHidden(
            timeoutForLoadingOverlayToDisappear
          );
        }
      );
    });
  },
  waitForAccount: async ({ page }, use, testInfo) => {
    await use(async (phoneNumber: string, isShared, previousKey, query) => {
      const DEFAULT_TIMEOUT = 180000;
      const expires = Date.now() + DEFAULT_TIMEOUT;
      return await test.step(
        `Wait for account ${phoneNumber}, shared ${isShared}`,
        async () => {
          let delay = 15000;
          try {
            while (Date.now() < expires) {
              const accountLock = await AccountLockService.lock(
                phoneNumber,
                DEFAULT_TIMEOUT,
                isShared,
                previousKey
              );
              if (accountLock) {
                return {
                  key: accountLock.key,
                  unlock: async () => {
                    await test.step(`Release phone number ${phoneNumber}`, () =>
                      accountLock.unlock()
                    );
                  },
                };
              }
              // eslint-disable-next-line no-console
              console.log(
                `Waiting for account ${phoneNumber} and shared ${isShared} delay ${delay} expires ${new Date(
                  expires
                )}`
              );
              const jitter = Math.random() * 1000;
              await page.waitForTimeout(delay + jitter);
              if (query) {
                const queryResult = await test.step(
                  `Query for account with phone number ${phoneNumber}`,
                  () => query()
                );
                if (queryResult) {
                  // eslint-disable-next-line no-console
                  console.log(
                    `Lock account cancelled phone number ${phoneNumber}`
                  );
                  return {
                    key: '',
                    queryResult,
                    unlock: () => Promise.resolve(),
                  };
                } else {
                  // eslint-disable-next-line no-console
                  console.log(
                    `Account is not ready yet for phone number ${phoneNumber}`
                  );
                }
              }
              delay *= 0.9;
            }
            throw new Error(`max retries for lock account ${testInfo.title}`);
          } catch (error) {
            throw new Error(`Lock account failed: ${error}`);
          }
        }
      );
    });
  },
  waitForPhoneNumber: async ({ page }, use, testInfo) => {
    await use(async (phoneNumber: string) => {
      const DEFAULT_TIMEOUT = 180000;
      return await waitForPhoneNumber(
        page,
        phoneNumber,
        DEFAULT_TIMEOUT,
        testInfo.title ?? 'No title'
      );
    });
  },
  generateLocalStorage: async ({ page }, use) => {
    await use(async (phoneNumberDialingCode: string, phoneNumber: string) => {
      await page.context().storageState({
        path: getLocalStorageName(phoneNumberDialingCode, phoneNumber),
      });
    });
  },
  createPin: (
    {
      createPinScreen,
      verifyPinScreen,
      waitUntilOverlayLoadingDisappeared,
      generateLocalStorage,
    },
    use
  ) =>
    // Create and verify pin
    use(async (loginInfo: LoginInfo) => {
      await test.step('Creating and confirming a PIN', async () => {
        await createPinScreen.enterPin(loginInfo.pin);
        await createPinScreen.clickNextButton();
        await verifyPinScreen.enterPin(loginInfo.pin);
        await waitUntilOverlayLoadingDisappeared(
          verifyPinScreen.clickVerifyButton
        );
      });

      await test.step(
        `Refresh the Storage file for the newly created account with a Login`,
        async () =>
          await generateLocalStorage(
            loginInfo.phoneNumberDialingCode,
            loginInfo.phoneNumber
          )
      );
    }),
  getPbmUser: async ({ waitForAccount }, use) => {
    await use(async (pbmUser, options?: UserOptions) => {
      // eslint-disable-next-line no-console
      console.log('Begin get PBM user');
      const beginLockTime = Date.now();
      const withoutAccount =
        (options?.withoutAccount || options?.withActivationPhone) ?? false;
      const isShared = !(options?.exclusive || withoutAccount) ?? true;
      let resultLock = await waitForAccount(pbmUser.phoneNumber, isShared);
      if (Date.now() - beginLockTime > 10000) {
        // eslint-disable-next-line no-console
        console.warn(
          `Get PBM user is waiting too long for account with number ${pbmUser.phoneNumber}`
        );
        test.slow();
      }
      const phoneNumberWithCountryCode =
        PhoneService.phoneNumberWithCountryCode(pbmUser);
      const pin = await test.step(
        `Get pin for phone number ${pbmUser.phoneNumber}`,
        () => PinService.get(phoneNumberWithCountryCode)
      );
      if (withoutAccount) {
        const reference = PhoneService.phoneNumberHash(
          phoneNumberWithCountryCode
        );
        const accountResult = await test.step(
          'Check if the account already exists',
          () => PatientAccountService.getByReference(reference)
        );
        let activated = pin || accountResult.length > 0;
        if (!activated && options?.withActivationPhone) {
          const personDocument = await PersonRepository.get(
            phoneNumberWithCountryCode
          );
          if (
            !personDocument?.activationPhoneNumber ||
            personDocument.isPhoneNumberVerified
          ) {
            activated = true;
          }
        }
        if (activated) {
          const newPerson = await test.step(
            'User already exists. Reset account and create a benefit plan',
            async () => {
              return await UserService.createPbmUser(pbmUser, options);
            }
          );
          return {
            ...resultLock,
            ...pbmUser,
            ...newPerson,
            uniqueId: newPerson.primaryMemberRxId,
          };
        } else {
          const phoneData = {
            countryCode: pbmUser.phoneNumberDialingCode,
            phoneNumber: pbmUser.phoneNumber,
          };
          const benefitPerson = await test.step(
            'Get benefits for PBM user',
            () => BenefitService.get(phoneData)
          );
          if (benefitPerson) {
            return {
              ...resultLock,
              ...pbmUser,
              ...benefitPerson,
            };
          }
          const newBenefitPerson = await test.step(
            'Create benefit for PBM user',
            () => BenefitService.create(phoneData)
          );
          return {
            ...resultLock,
            ...pbmUser,
            ...newBenefitPerson,
            uniqueId: newBenefitPerson.primaryMemberRxId,
          };
        }
      }
      const pinMatches =
        !pin ||
        (pin.accountKey === accountTemplate.accountKey &&
          pin.pinHash === accountTemplate.pinHash);
      let person = pinMatches
        ? await test.step('Try get the PBM user', () =>
            UserService.getPbmUser(pbmUser)
          )
        : null;
      if (!person) {
        await resultLock.unlock();
        const exclusiveLock = await waitForAccount(
          pbmUser.phoneNumber,
          false,
          resultLock.key,
          () =>
            test.step('Query for PBM user', () =>
              UserService.getPbmUser(pbmUser)
            )
        );
        if (Date.now() - beginLockTime > 10000) {
          // eslint-disable-next-line no-console
          console.warn(
            `Get PBM user is waiting too long for exclusive lock with number ${pbmUser.phoneNumber}`
          );
          test.slow();
        }
        try {
          if (!exclusiveLock.queryResult) {
            person = await test.step('Create a PBM user', () =>
              UserService.createPbmUser(pbmUser)
            );
          } else {
            // eslint-disable-next-line no-console
            console.log('PBM user is being reused from another worker');
            person = exclusiveLock.queryResult;
          }
        } catch (error) {
          throw new Error(`Failed to create PBM account with error ${error}`);
        } finally {
          await exclusiveLock.unlock();
        }
        resultLock = await waitForAccount(pbmUser.phoneNumber, true);
      } else {
        // eslint-disable-next-line no-console
        console.log('PBM user is being reused from previous test');
      }
      await test.step('Clear pin and identity if account locked', () =>
        Promise.all([
          PinService.unlock(phoneNumberWithCountryCode),
          IdentityService.unlock(phoneNumberWithCountryCode),
        ])
      );
      return { ...resultLock, ...person };
    });
  },
  getCashUser: async ({ waitForAccount }, use) => {
    await use(async (cashUser, exclusive?: boolean) => {
      // eslint-disable-next-line no-console
      console.log('Begin get Cash user');
      const beginLockTime = Date.now();
      let resultLock = await waitForAccount(cashUser.phoneNumber, !exclusive);
      if (Date.now() - beginLockTime > 10000) {
        // eslint-disable-next-line no-console
        console.warn(
          `Get Cash user is waiting too long for account with number ${cashUser.phoneNumber}`
        );
        test.slow();
      }
      let person;
      const phoneNumberWithCountryCode =
        PhoneService.phoneNumberWithCountryCode({
          phoneNumber: cashUser.phoneNumber,
          countryCode: cashUser.phoneNumberDialingCode,
        });
      const pin = await test.step(
        `Get pin for phone number ${cashUser.phoneNumber}`,
        () => PinService.get(phoneNumberWithCountryCode)
      );
      if (
        !pin ||
        (pin.accountKey === accountTemplate.accountKey &&
          pin.pinHash === accountTemplate.pinHash)
      ) {
        person = await test.step('Get cash user', () =>
          UserService.getCashUser(cashUser)
        );
      }
      if (!person) {
        await resultLock.unlock();
        const exclusiveLock = await waitForAccount(
          cashUser.phoneNumber,
          false,
          resultLock.key,
          () => UserService.getCashUser(cashUser)
        );
        if (Date.now() - beginLockTime > 10000) {
          // eslint-disable-next-line no-console
          console.warn(
            `Get Cash user is waiting too long for exclusive lock with number ${cashUser.phoneNumber}`
          );
          test.slow();
        }
        try {
          if (!exclusiveLock.queryResult) {
            person = await test.step('Create a new cash user', () =>
              UserService.createCashUser(cashUser)
            );
          } else {
            // eslint-disable-next-line no-console
            console.log('Cash user is being reused from another worker');
            person = exclusiveLock.queryResult;
          }
        } catch (error) {
          throw new Error(`Failed to create Cash account with error ${error}`);
        } finally {
          await exclusiveLock.unlock();
        }
        resultLock = await waitForAccount(cashUser.phoneNumber, !exclusive);
      } else {
        // eslint-disable-next-line no-console
        console.log('Cash user is being reused from previous test');
      }
      await Promise.all([
        PinService.unlock(phoneNumberWithCountryCode),
        IdentityService.unlock(phoneNumberWithCountryCode),
      ]);
      return { ...resultLock, ...person };
    });
  },
  // eslint-disable-next-line no-empty-pattern
  rxAssistanceDbContext: async ({}, use) => {
    const connectionStringUri = process.env.DATABASE_CONNECTION_STRING;
    const databaseName = process.env.DATABASE_NAME;
    if (!connectionStringUri) {
      throw new Error('Missing connection string environment variable');
    }
    if (!databaseName) {
      throw new Error('Missing database name environment variable');
    }
    const context = new RxAssistanceDbContext(
      connectionStringUri,
      databaseName
    );
    await use(async () => {
      await test.step('Connecting to the Rx assistance database', () =>
        context.connect()
      );
      return context;
    });
    await test.step('Disconnecting from Rx assistance database', () =>
      context.close()
    );
  },
});
