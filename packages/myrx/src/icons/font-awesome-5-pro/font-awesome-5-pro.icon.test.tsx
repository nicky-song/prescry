// Copyright 2022 Prescryptive Health, Inc.

import React from 'react';
import { createIconSet } from '@expo/vector-icons';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import brandsFont from '../../../assets/fonts/FontAwesome5_Pro_Brands.ttf';
import lightFont from '../../../assets/fonts/FontAwesome5_Pro_Light.ttf';
import regularFont from '../../../assets/fonts/FontAwesome5_Pro_Regular.ttf';
import solidFont from '../../../assets/fonts/FontAwesome5_Pro_Solid.ttf';
import glyphMap from '../../../assets/fonts/FontAwesome5Pro.json';
import { FontAwesome5ProIcon } from './font-awesome-5-pro.icon';

jest.mock('@expo/vector-icons');
const createIconSetMock = createIconSet as jest.Mock;

describe('FontAwesome5ProIcon', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    createIconSetMock.mockReturnValue(() => <div />);
  });

  it.each([['brand'], ['regular'], ['solid'], ['light'], [undefined]])(
    'renders as FontAwesome5 Pro icon (font set: %p)',
    (fontSetMock: string | undefined) => {
      const nameMock = 'search';
      const sizeMock = 1;
      const colorMock = 'blue';
      const styleMock = { width: 1 };

      const IconMock = () => <div />;
      createIconSetMock.mockReturnValue(IconMock);

      const testRenderer = renderer.create(
        <FontAwesome5ProIcon
          brand={fontSetMock === 'brand' ? true : undefined}
          regular={fontSetMock === 'regular' ? true : undefined}
          solid={fontSetMock === 'solid' ? true : undefined}
          light={fontSetMock === 'light' ? true : undefined}
          name={nameMock}
          size={sizeMock}
          color={colorMock}
          style={styleMock}
        />
      );

      expect(createIconSetMock).toHaveBeenCalledTimes(1);

      const expectedFontName = new Map([
        ['brand', 'FontAwesome5_Pro_Brands'],
        ['regular', 'FontAwesome5_Pro_Regular'],
        ['solid', 'FontAwesome5_Pro_Solid'],
        ['light', 'FontAwesome5_Pro_Light'],
      ]);
      const expectedFontFile = new Map([
        ['brand', brandsFont],
        ['regular', regularFont],
        ['solid', solidFont],
        ['light', lightFont],
      ]);

      expect(createIconSetMock).toHaveBeenCalledWith(
        glyphMap,
        expectedFontName.get(fontSetMock ?? 'regular'),
        expectedFontFile.get(fontSetMock ?? 'regular')
      );

      const icon = testRenderer.root.children[0] as ReactTestInstance;

      expect(icon.type).toEqual(IconMock);
      expect(icon.props.name).toEqual(nameMock);
      expect(icon.props.size).toEqual(sizeMock);
      expect(icon.props.color).toEqual(colorMock);
      expect(icon.props.style).toEqual(styleMock);
    }
  );
});
