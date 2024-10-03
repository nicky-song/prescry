// Copyright 2023 Prescryptive Health, Inc.

import {
  ClaimExperienceScreen,
  RecommendedAlternativesScreen,
  GreatPriceScreen,
} from '../pages/claims';
import { test as base } from './test-scoped-page-context-fixture';
import { ClaimType, ClaimUserType } from '../types';
import { ClaimLinkService, PhoneService } from '../services';
import { Locator, expect } from '@playwright/test';
import { MessageEnvelopeRepository } from '../data-access/rx-assistance';

export const test = base.extend<{
  claimExperienceScreen: ClaimExperienceScreen;
  recommendedAlternativesScreen: RecommendedAlternativesScreen;
  greatPriceScreen: GreatPriceScreen;
  generateClaimLink: (
    person: ClaimUserType,
    scenario: ClaimType
  ) => Promise<string>;
  claimAlertsMedicationTagsValidator: (props: {
    medications: 1 | 2;
    tagsSavesActive: 'both' | 'onlyMember' | 'onlyPlan';
  }) => Promise<void>;
  retrieveClaimLink: (
    phoneNumber: string,
    referenceNumber: string
  ) => Promise<string>;
}>({
  claimExperienceScreen: async ({ page }, use) => {
    await use(new ClaimExperienceScreen(page));
  },
  recommendedAlternativesScreen: async ({ page }, use) => {
    await use(new RecommendedAlternativesScreen(page));
  },
  greatPriceScreen: async ({ page }, use) => {
    await use(new GreatPriceScreen(page));
  },
  generateClaimLink: async (
    { waitForPhoneNumber, retrieveClaimLink },
    use,
    testInfo
  ) => {
    await use(async (person, scenario) => {
      if (!person) {
        throw new Error('You need a person in order to generate a claim');
      }
      // eslint-disable-next-line no-console
      console.log(`Begin claim alert for ${person.phoneNumber}`);
      const beginLockTime = Date.now();
      const exclusiveLock = await waitForPhoneNumber(person.phoneNumber);
      try {
        // eslint-disable-next-line no-console
        console.log(`Phone locked ${exclusiveLock.key} for ${scenario}`);
        const beginTime = await test.step('Get the last message time', () =>
          PhoneService.getLastMessageTime(person.phoneNumber)
        );
        if (Date.now() - beginLockTime > 5000) {
          // eslint-disable-next-line no-console
          console.log(`Claim alert phone is slow for ${person.phoneNumber}`);
          test.slow();
        }
        const claims = await test.step('Generate claim by phone', () =>
          ClaimLinkService.generate(person, scenario)
        );
        test.expect(claims, 'Number of Claims generated').toHaveLength(1);
        test.expect(claims[0].statusCode, 'Status of claim').toBe(201);
        testInfo.annotations.push({
          type: 'info',
          description: `Claim data: ${claims[0].data}`,
        });
        const referenceNumber = claims[0].key;
        const phoneNumberWithCountryCode =
          PhoneService.phoneNumberWithCountryCode({
            countryCode: person.phoneNumberDialingCode,
            phoneNumber: person.phoneNumber,
          });
        let link = await retrieveClaimLink(
          phoneNumberWithCountryCode,
          referenceNumber
        );
        try {
          await expect
            .poll(
              async () => {
                const shortLink = await test.step('Try get short link', () =>
                  ClaimLinkService.getShortLink(person.phoneNumber, beginTime)
                );
                if (shortLink) {
                  link = shortLink;
                  return true;
                }
                return false;
              },
              {
                message: 'Wait for short link in SMS',
                timeout: 5000,
                intervals: [1000, 2000, 2000],
              }
            )
            .toBeTruthy();
        } catch (error) {
          testInfo.annotations.push({
            type: 'warn',
            description: `Failed to get sms with claim link. ${error}`,
          });
        }
        if (Date.now() - beginLockTime > 10000) {
          // eslint-disable-next-line no-console
          console.log(
            `Claim alert retrieval is slow for ${person.phoneNumber} and link ${link}`
          );
          test.slow();
        }
        return link ?? '';
      } catch (error) {
        throw new Error(`Error generating claim alert ${error}`);
      } finally {
        await exclusiveLock.unlock();
        // eslint-disable-next-line no-console
        console.log(`Released lock claim alert for ${person.phoneNumber}`);
      }
    });
  },
  claimAlertsMedicationTagsValidator: async (
    { recommendedAlternativesScreen },
    use
  ) => {
    await use(
      async (props: {
        medications: 1 | 2;
        tagsSavesActive: 'both' | 'onlyMember' | 'onlyPlan';
      }) => {
        const { medications, tagsSavesActive } = props;

        const [firstMedicationMemberTagLoc, firstMedicationPlanTagLoc] =
          recommendedAlternativesScreen.getFirstMedicationReplacementLocatorTags();
        const [secondMedicationMemberTagLoc, secondMedicationPlanTagloc] =
          recommendedAlternativesScreen.getSecondMedicationReplacementLocatorTags();

        const assertVisibility = (
          memberOrPlanSavesTagLocator: Locator,
          tagVisible?: boolean
        ) => {
          if (tagVisible) {
            return expect(memberOrPlanSavesTagLocator).toBeVisible();
          } else {
            return expect(memberOrPlanSavesTagLocator).toBeHidden();
          }
        };

        const memberSavesTagVisible =
          tagsSavesActive === 'both' || tagsSavesActive === 'onlyMember';
        const planSavesTagVisible =
          tagsSavesActive === 'both' || tagsSavesActive === 'onlyPlan';

        await assertVisibility(
          firstMedicationMemberTagLoc,
          memberSavesTagVisible
        );
        await assertVisibility(firstMedicationPlanTagLoc, planSavesTagVisible);

        if (medications === 1) {
          await assertVisibility(secondMedicationMemberTagLoc);
          await assertVisibility(secondMedicationPlanTagloc);
        } else {
          await assertVisibility(
            secondMedicationMemberTagLoc,
            memberSavesTagVisible
          );
          await assertVisibility(
            firstMedicationPlanTagLoc,
            planSavesTagVisible
          );
        }
      }
    );
  },
  retrieveClaimLink: async ({ rxAssistanceDbContext }, use) => {
    await use(async (phoneNumber, referenceNumber) => {
      let link: string | undefined;
      const context = await rxAssistanceDbContext();
      const messageEnvelopeRepository = new MessageEnvelopeRepository(context);
      await expect
        .poll(
          async () => {
            const message = await test.step('Try get message envelope', () =>
              messageEnvelopeRepository.findByReferenceNumber(
                phoneNumber,
                referenceNumber
              )
            );
            const identifier = message?.pendingPrescriptionList?.identifier;
            if (identifier) {
              link = `https://${process.env.MY_PRESCRYPTIVE_URL}/${identifier}`;
              return true;
            }
            return false;
          },
          {
            message: 'Waiting for the claim link in message envelope',
            timeout: 10000,
            intervals: [1000, 2000, 3000],
          }
        )
        .toBeTruthy();
      return link ?? '';
    });
  },
});
