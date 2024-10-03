// Copyright 2022 Prescryptive Health, Inc.

import React, {
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Text } from 'react-native';
import { TransPerfectConstants } from '../../models/transperfect';
import { DefaultText, IDefaultTextProps } from './default-text';

export const ProtectedDefaultText = (
  props: Omit<IDefaultTextProps, 'textRef'>
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
  }, []);

  const { children: defaultTextChildren, ...defaultTextProps } = props;

  return (
    <DefaultText textRef={textRef} {...defaultTextProps}>
      {classApplied ? defaultTextChildren : undefined}
    </DefaultText>
  );
};
