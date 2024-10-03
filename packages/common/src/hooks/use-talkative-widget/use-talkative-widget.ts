// Copyright 2022 Prescryptive Health, Inc.

import { useEffect } from 'react';
import { hideTalkativeElementStyleDisplay } from './helpers/hide-talkative-element-style-display';
import { showTalkativeElementStyleDisplay } from './helpers/show-talkative-element-style-display';
import { useIsFocused } from '@react-navigation/native';

export interface ITalkativeWidgetProps {
  showHeader?: boolean;
  forceExpandedView?: boolean;
}

export const useTalkativeWidget = ({
  showHeader,
  forceExpandedView,
}: ITalkativeWidgetProps): void => {
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      showTalkativeElementStyleDisplay({
        showHeader,
        forceExpandedView,
      });
    }

    return () => {
      hideTalkativeElementStyleDisplay();
    };
  }, [isFocused]);
};
