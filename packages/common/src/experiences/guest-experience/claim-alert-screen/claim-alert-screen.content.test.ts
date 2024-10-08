// Copyright 2021 Prescryptive Health, Inc.

import {
  claimAlertScreenContent,
  IClaimAlertScreenContent,
  IClaimsAlertSavingsProps,
} from './claim-alert-screen.content';

const genericPlanCouldSaveSubstitution: IClaimsAlertSavingsProps = {
  heading: 'Save with the generic',
  subHeading: 'Saving your plan money helps keep premiums low.',
  description: 'Ask your pharmacist to make a switch.',
  imageName: 'errorCircle',
};

const genericYouCouldSaveSubstitution: IClaimsAlertSavingsProps = {
  heading: 'Save with the generic',
  description: 'Ask your pharmacist about switching to a generic equivalent.',
  imageName: 'errorCircle',
};

const alternativeYouCouldSaveContent: IClaimsAlertSavingsProps = {
  heading: 'You could save',
  description:
    'Ask your doctor about alternative drugs below that could treat your condition.',
  imageName: 'alertCircle',
};

const alternativePlanCouldSaveContent: IClaimsAlertSavingsProps = {
  heading: 'Your plan could save',
  subHeading: 'Saving your plan money helps keep premiums low.',
  description: 'Ask your doctor about alternative drugs.',
  imageName: 'alertCircle',
};

const notificationContent: IClaimsAlertSavingsProps = {
  heading: 'Great price',
  description:
    'We analyzed your prescription and you are getting the best deal under your plan at your pharmacy.',
  imageName: 'check-circle',
};

const reversalContent: IClaimsAlertSavingsProps = {
  heading: 'Oops something changed',
  description:
    'Your pharmacy is working on this prescription. Check back before you pick up your prescription to see information that can save your money!',
  imageName: 'yellowBang',
};

describe('claimsAlertSavingsContent', () => {
  it('has expected content', () => {
    const expectedContent: IClaimAlertScreenContent = {
      alternativeYouCouldSaveContent,
      alternativePlanCouldSaveContent,
      genericYouCouldSaveSubstitution,
      genericPlanCouldSaveSubstitution,
      notificationContent,
      reversalContent,
    };

    expect(claimAlertScreenContent).toEqual(expectedContent);
  });
});
