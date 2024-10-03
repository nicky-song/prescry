// Copyright 2020 Prescryptive Health, Inc.

import React, { ReactElement, useEffect, useState } from 'react';
import { phoneMaskInputContent } from './phone.mask.input.content';
import {
  IPrimaryTextInputProps,
  PrimaryTextInput,
} from '../../primary-text/primary-text.input';
import { cleanPhoneNumber } from '../../../../utils/formatters/phone-number.formatter';

export interface IPhoneMaskInputProps
  extends Pick<
    IPrimaryTextInputProps,
    | 'isRequired'
    | 'editable'
    | 'onSubmitEditing'
    | 'viewStyle'
    | 'label'
    | 'errorMessage'
  > {
  phoneNumber?: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
  testID?: string;
}

export const PhoneMaskInput = ({
  phoneNumber,
  onPhoneNumberChange,
  testID,
  ...props
}: IPhoneMaskInputProps): ReactElement => {
  const extractFromMask = (value: string) => {
    const PhoneNumberMask = [
      /['(']/,
      /[1-9]/,
      /\d/,
      /\d/,
      /[')']/,
      /[' ']/,
      /\d/,
      /\d/,
      /\d/,
      /['\-']/,
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];

    const arrayValue = value.split('');

    const unMasked = arrayValue
      .map((substring, i) => {
        if (i > PhoneNumberMask.length - 1) {
          return null;
        }

        const isMatch = PhoneNumberMask[i].exec(substring);

        if (isMatch) {
          if (isNaN(parseInt(substring, 10))) {
            return null;
          }
          return substring;
        } else {
          if (!isNaN(parseInt(substring, 10))) {
            return substring;
          }

          return null;
        }
      })
      .filter((n) => n !== null)
      .join('');

    return { unMasked, masked: maskValue(unMasked) };
  };

  const maskValue = (unMasked: string) => {
    const splited = unMasked.split('');
    const length = splited.length;

    let masked = '';

    if (length === 0) {
      return '';
    }

    splited.forEach((s, i) => {
      if (i === 0) {
        masked += `(${s}`;
      } else if (i === 2 && i !== length - 1) {
        masked += `${s}) `;
      } else if (i === 5 && i !== length - 1) {
        masked += `${s}-`;
      } else {
        masked += s;
      }
    });

    return masked;
  };

  const [maskedPhoneNumber, setMaskedPhoneNumber] = useState<string>('');

  useEffect(() => {
    setMaskedPhoneNumber(maskValue(cleanPhoneNumber(phoneNumber)));
  }, [phoneNumber]);

  const onChangeHandler = (value: string) => {
    const { unMasked, masked } = extractFromMask(value);
    onPhoneNumberChange(unMasked);
    setMaskedPhoneNumber(masked);
  };

  return (
    <PrimaryTextInput
      textContentType='telephoneNumber'
      value={maskedPhoneNumber}
      onChangeText={onChangeHandler}
      placeholder={phoneMaskInputContent.placeholder}
      keyboardType='phone-pad'
      testID={testID}
      {...props}
    />
  );
};
