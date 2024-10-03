// Copyright 2022 Prescryptive Health, Inc.

import React, {
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Text } from 'react-native';
import { TransPerfectConstants } from '../../../models/transperfect';
import { BaseText, IBaseTextProps } from '../base-text/base-text';

export const ProtectedBaseText = (
  props: Omit<IBaseTextProps, 'textRef'>
): ReactElement => {
  const textRef: RefObject<Text> = useRef(null);
  const [classApplied, setClassApplied] = useState(false);

  useEffect(() => {
    if (textRef.current) {
      textRef.current.setNativeProps({
        className: TransPerfectConstants.excludeClass,
      });
      setClassApplied(true);
    }
  }, [props.isSkeleton]);

  const { children: baseTextChildren, ...baseTextProps } = props;

  return (
    <BaseText textRef={textRef} {...baseTextProps}>
      {classApplied ? baseTextChildren : undefined}
    </BaseText>
  );
};
