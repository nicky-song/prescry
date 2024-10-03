// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement, ReactNode } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { useContent } from '../../../experiences/guest-experience/context-providers/session/ui-content-hooks/use-content';
import { useSessionContext } from '../../../experiences/guest-experience/context-providers/session/use-session-context.hook';
import { CmsGroupKey } from '../../../experiences/guest-experience/state/cms-content/cms-group-key';
import {
  formatQuantityWithForm,
  formatRefills,
  formatStrength,
  formatSupply,
} from '../../../utils/formatters/drug.formatter';
import { BaseText } from '../base-text/base-text';
import { IDrugDetailsTextContent } from './drug-details.text.content';
import { drugDetailsTextStyles } from './drug-details.text.styles';

export interface IDrugDetailsTextProps {
  viewStyle?: StyleProp<ViewStyle>;
  strength?: string;
  unit?: string;
  formCode: string;
  quantity: number;
  refills?: number;
  supply?: number;
  authoredOn?: string;
}

export const DrugDetailsText = ({
  viewStyle,
  strength,
  unit,
  formCode,
  quantity,
  refills,
  supply,
  authoredOn,
}: IDrugDetailsTextProps): ReactElement => {
  const styles = drugDetailsTextStyles;

  const { sessionState } = useSessionContext();
  const { drugFormMap } = sessionState;

  const { content, isContentLoading } = useContent<IDrugDetailsTextContent>(
    CmsGroupKey.drugDetailsText,
    2
  );

  const detailComponents: ReactNode[] = [];

  const pushDelimiter = (keyPrefix: string) => {
    if (detailComponents.length) {
      detailComponents.push(
        <BaseText key={`${keyPrefix}-delimiter`}> | </BaseText>
      );
    }
  };

  if (strength && strength.trim()) {
    const formattedStrength = formatStrength(strength, unit);
    detailComponents.push(
      <BaseText key={`strength-${strength}`}>{formattedStrength}</BaseText>
    );
  }

  if (quantity && formCode) {
    pushDelimiter('quantity');

    const formattedQuantity = formatQuantityWithForm(
      quantity,
      formCode,
      drugFormMap
    );
    detailComponents.push(
      <BaseText key={`quantity-${quantity}`}>{formattedQuantity}</BaseText>
    );
  }

  if (supply) {
    pushDelimiter('supply');

    const formattedSupply = formatSupply(supply, content);
    detailComponents.push(
      <BaseText key={`supply-${supply}`} isSkeleton={isContentLoading}>
        {formattedSupply}
      </BaseText>
    );
  }

  if (refills) {
    pushDelimiter('refills');

    const formattedRefills = formatRefills(refills, authoredOn, content);
    detailComponents.push(
      <BaseText key={`refills-${refills}`} isSkeleton={isContentLoading}>
        {formattedRefills}
      </BaseText>
    );
  }

  return (
    <View style={[styles.viewStyle, viewStyle]} testID='drugDetailsText'>
      {detailComponents}
    </View>
  );
};
