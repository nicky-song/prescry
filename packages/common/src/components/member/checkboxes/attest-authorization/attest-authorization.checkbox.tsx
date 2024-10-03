// Copyright 2023 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';
import { useContent } from '../../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { CmsGroupKey } from '../../../../experiences/guest-experience/state/cms-content/cms-group-key';
import { ISignInContent } from '../../../../models/cms-content/sign-in.ui-content';
import { PrimaryCheckBox } from '../../../checkbox/primary-checkbox/primary-checkbox';
import { attestAuthorizationCheckboxStyles as styles } from './attest-authorization.checkbox.styles';

export interface IAttestAuthorizationCheckboxProps {
  onPress: (checkBoxChecked: boolean, checkBoxValue: string) => void;
  viewStyle?: StyleProp<ViewStyle>;
}

export const AttestAuthorizationCheckbox = ({
  onPress,
  viewStyle,
}: IAttestAuthorizationCheckboxProps): ReactElement => {
  const groupKey = CmsGroupKey.signIn;
  const { content } = useContent<ISignInContent>(groupKey, 2);

  return (
    <View style={viewStyle} testID='checkboxAttestAuthorization'>
      <PrimaryCheckBox
        testID='attestAuthorizationCheckbox'
        checkBoxValue='attestAuthorizationCheckbox'
        checkBoxLabel={content.attestAuthorizationCheckboxLabel}
        onPress={onPress}
        checkBoxImageStyle={styles.checkBoxImageStyle}
      />
    </View>
  );
};
