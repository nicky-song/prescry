// Copyright 2022 Prescryptive Health, Inc.

import React, { ReactElement } from 'react';
import { View, ScrollView, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';
import HTMLView from 'react-native-htmlview';
import { useMediaQueryContext } from '../../../experiences/guest-experience/context-providers/media-query/use-media-query-context.hook';

export interface IHtmlViewProps {
  htmlContent: string;
  jsonHtmlCss?: string;
  viewStyle?: StyleProp<ViewStyle | TextStyle>;
  maxHeight?: string;
  testID?: string;
}

export const HtmlView = ({
  htmlContent,
  jsonHtmlCss = '{}',
  viewStyle,
  maxHeight,
  testID,
}: IHtmlViewProps): ReactElement => {
  const styles = StyleSheet.create(JSON.parse(jsonHtmlCss));
  const { windowHeight } = useMediaQueryContext();

  return (
    <View
      style={[viewStyle, { maxHeight: maxHeight ?? windowHeight }]}
      testID={testID}
    >
      <ScrollView>
        <HTMLView
          value={htmlContent}
          stylesheet={styles}
        />
      </ScrollView>
    </View>
  );
};