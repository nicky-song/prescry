// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import {
  DrugDetailsText,
  IDrugDetailsTextProps,
} from '../drug-details/drug-details.text';

/**
 * IDrugDetailsTextProps
 *
 * @method conditionProps: returns Partial<IDrugDetailsTextProps>
 * @tuple strength & unit - codependent: both defined or none
 * @tuple quantity & formCode - codependent: both defined or none
 */

/**
 * DrugDetailsText
 *
 * @type (props: IDrugDetailsTextProps) => ReactElement
 *
 * @method conditionProps: ensure codependent props are both defined
 * @tuple strength & unit - codependent: both defined or none
 * @example 100mg (Valid); 100 (Invalid); mg (Invalid);
 * @tuple quantity & formCode - codependent: both defined or none
 * @example 30 tablets (Valid); 30 (Invalid); tablets (Invalid);
 */

export const ClaimAlertDrugDetailsText = (
  props: Partial<IDrugDetailsTextProps>
): ReactElement | null => {
  const conditionProps = (): Partial<IDrugDetailsTextProps> => {
    const hasStrengthAndUnit =
      props.unit !== undefined && props.strength !== undefined;

    const hasFormCodeAndQuantity =
      props.formCode !== undefined && props.quantity !== undefined;

    return {
      ...props,
      strength: hasStrengthAndUnit ? props.strength : undefined,
      unit: hasStrengthAndUnit ? props.unit : undefined,
      formCode: hasFormCodeAndQuantity ? props.formCode : undefined,
      quantity: hasFormCodeAndQuantity ? props.quantity : undefined,
    };
  };

  const {
    viewStyle,
    strength,
    unit,
    formCode,
    quantity,
    refills,
    supply,
    authoredOn,
  } = conditionProps();

  if (formCode && quantity)
    return (
      <DrugDetailsText
        viewStyle={viewStyle}
        strength={strength}
        unit={unit}
        formCode={formCode}
        quantity={quantity}
        refills={refills}
        supply={supply}
        authoredOn={authoredOn}
      />
    );

  return null;
};
