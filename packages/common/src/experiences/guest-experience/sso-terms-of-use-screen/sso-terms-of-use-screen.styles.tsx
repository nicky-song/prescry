// Copyright 2022 Prescryptive Health, Inc.

import { ViewStyle } from 'react-native';
import { Spacing } from '../../../theming/spacing';
import type { IPbmMemberBenefitsScreenStyles } from '../screens/unauth/pbm-member-benefits/pbm-member-benefits.screen.styles';

export interface ISsoTermsOfUseScreenStyles
  extends IPbmMemberBenefitsScreenStyles {
  termsAndConditionsContainerViewStyles: ViewStyle;
  cobrandingImageContainer: ViewStyle;
}
export const ssoTermsOfUseScreenStyles: ISsoTermsOfUseScreenStyles = {
  titleTextStyle: {
    marginBottom: Spacing.base,
  },
  instructionsTextStyle: {
    flexGrow: 0,
  },
  separatorViewStyle: {
    marginTop: Spacing.times1pt5,
    marginBottom: Spacing.times1pt5,
  },
  bodyContainerViewStyle: { display: 'flex', flexDirection: 'column', flex: 1 },
  bottomContentViewStyle: {
    marginTop: Spacing.times1pt5,
    flex: 1,
    justifyContent: 'flex-end',
  },
  termsAndConditionsContainerViewStyles: {
    marginBottom: Spacing.times1pt5,
  },
  cobrandingImageContainer: {
    marginTop: Spacing.half,
    marginBottom: Spacing.times1pt5,
  },
};
