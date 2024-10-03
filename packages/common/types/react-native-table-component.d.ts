import React from 'react';
import { TextStyle, ViewStyle, StyleProp } from 'react-native';

export type Measure = number | string;
export type FlexType = number | string;

export interface ICell {
  data: React.ReactNode;
  borderStyle?: StyleProp<ViewStyle>;
  flex?: FlexType;
  height?: Measure;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  width?: Measure;
}
declare class Cell extends React.Component<ICell, any> {}

export interface IRow {
  data: React.ReactNode[];
  flexArr?: FlexType[];
  height?: Measure;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  widthArr?: Measure[];
}
declare class Row extends React.Component<IRow, any> {}

export interface IRows {
  data: React.ReactNode[][];
  flexArr?: FlexType[];
  heightArr?: Measure[];
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  widthArr?: Measure[];
}
declare class Rows extends React.Component<IRows, any> {}

export interface ITable {
  borderStyle?: ViewStyle;
  style?: StyleProp<ViewStyle>;
}
declare class Table extends React.Component<ITable, any> {}

export interface ITableWrapper {
  style?: StyleProp<ViewStyle>;
}
declare class TableWrapper extends React.Component<ITableWrapper, any> {}
