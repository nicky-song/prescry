// Copyright 2022 Prescryptive Health, Inc.

import React, {
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { View, ViewProps } from 'react-native';
import { TransPerfectConstants } from '../../../models/transperfect';

export const TranslatableView = (props: ViewProps): ReactElement => {
  const viewRef: RefObject<View> = useRef(null);

  const [classApplied, setClassApplied] = useState(false);

  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.setNativeProps({
        className: TransPerfectConstants.includeClass,
      });
      setClassApplied(true);
    }
  }, []);

  const { children: viewChildren, ...viewProps } = props;

  return (
    <View {...viewProps} ref={viewRef}>
      {classApplied ? viewChildren : undefined}
    </View>
  );
};
