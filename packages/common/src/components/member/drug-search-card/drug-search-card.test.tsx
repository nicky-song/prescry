// Copyright 2021 Prescryptive Health, Inc.

import React from 'react';
import renderer, { ReactTestInstance } from 'react-test-renderer';
import { View } from 'react-native';
import { DrugSearchCard } from './drug-search-card';
import { isDesktopDevice } from '../../../utils/responsive-screen.helper';
import { getDrugSearchCardStyles } from './drug-search-card.style';
import { BaseText } from '../../text/base-text/base-text';
import { SearchButton } from '../../buttons/search/search.button';

jest.mock('../../buttons/search/search.button', () => ({
  SearchButton: () => <div />,
}));

jest.mock('../../../utils/responsive-screen.helper');
const isDesktopDeviceMock = isDesktopDevice as jest.Mock;

describe('DrugSearchCard', () => {
  const expectedTitle = 'Test title';
  const expectedSubtitle = 'Test subtitle';
  const expectedButtonLabelMock = 'search-label-mock';
  const onSearchPressMock = jest.fn();

  beforeEach(() => {
    isDesktopDeviceMock.mockReturnValue(false);
  });

  it.each([[true], [false]])(
    'renders outer view container (isDesktop=%p)',
    (isDesktop: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const styles = getDrugSearchCardStyles(isDesktop);
      const testRenderer = renderer.create(
        <DrugSearchCard
          onSearchPress={onSearchPressMock}
          buttonLabel='search-label-mock'
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.type).toEqual(View);
      expect(container.props.style).toEqual([
        styles.cardContainerViewStyle,
        undefined,
      ]);
      expect(container.props.children.length).toEqual(3);
    }
  );

  it.each([[true], [false]])(
    'renders outer view container with passed in styles (isDesktop=%p)',
    (isDesktop: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const styles = getDrugSearchCardStyles(isDesktop);
      const testRenderer = renderer.create(
        <DrugSearchCard
          onSearchPress={onSearchPressMock}
          viewStyle={{ marginTop: 0 }}
          buttonLabel='search-label-mock'
        />
      );

      const container = testRenderer.root.children[0] as ReactTestInstance;

      expect(container.type).toEqual(View);
      expect(container.props.style).toEqual([
        styles.cardContainerViewStyle,
        { marginTop: 0 },
      ]);
      expect(container.props.children.length).toEqual(3);
    }
  );

  it.each([[true], [false]])(
    'renders and passes title (isDesktop=%p)',
    (isDesktop: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const styles = getDrugSearchCardStyles(isDesktop);
      const testRenderer = renderer.create(
        <DrugSearchCard
          onSearchPress={onSearchPressMock}
          title='Test title'
          buttonLabel='search-label-mock'
        />
      );

      const card = testRenderer.root.findByType(DrugSearchCard);

      expect(card.props.title).toEqual(expectedTitle);
      const element = testRenderer.root.findAllByType(BaseText)[0];
      expect(element.props.children).toEqual(expectedTitle);
      expect(element.props.style).toEqual(styles.titleTextStyle);
    }
  );

  it.each([[true], [false]])(
    'renders and passes subtitle (isDesktop=%p)',
    (isDesktop: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const styles = getDrugSearchCardStyles(isDesktop);
      const testRenderer = renderer.create(
        <DrugSearchCard
          onSearchPress={onSearchPressMock}
          subtitle='Test subtitle'
          buttonLabel='search-label-mock'
        />
      );

      const card = testRenderer.root.findByType(DrugSearchCard);

      expect(card.props.subtitle).toEqual(expectedSubtitle);
      const element = testRenderer.root.findAllByType(BaseText)[1];
      expect(element.props.children).toEqual(expectedSubtitle);
      expect(element.props.style).toEqual(styles.subtitleTextStyle);
    }
  );

  it.each([[true], [false]])(
    'renders drug search button (isDesktop=%p)',
    (isDesktop: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const styles = getDrugSearchCardStyles(isDesktop);
      const testRenderer = renderer.create(
        <DrugSearchCard
          title='Test title'
          subtitle='Test subtitle'
          onSearchPress={onSearchPressMock}
          buttonLabel='search-label-mock'
        />
      );

      const cardCont = testRenderer.root.findByType(DrugSearchCard);
      const card = testRenderer.root.findByType(View);
      const search = card.props.children[2];
      const searchBar = search.props.children;

      expect(cardCont.props.onSearchPress).toEqual(onSearchPressMock);
      expect(search.props.style).toEqual(styles.searchButtonContainerViewStyle);
      expect(searchBar.type).toEqual(SearchButton);
      expect(searchBar.props.onPress).toEqual(onSearchPressMock);
      expect(searchBar.props.testID).toEqual('drugSearchCardSearchButton');
    }
  );

  it.each([[true], [false]])(
    'renders drug search button with correct content when buttonLabel is passed (isDesktop=%p)',
    (isDesktop: boolean) => {
      isDesktopDeviceMock.mockReturnValue(isDesktop);
      const styles = getDrugSearchCardStyles(isDesktop);
      const testRenderer = renderer.create(
        <DrugSearchCard
          title='Test title'
          subtitle='Test subtitle'
          onSearchPress={onSearchPressMock}
          buttonLabel='search-label-mock'
        />
      );

      const cardCont = testRenderer.root.findByType(DrugSearchCard);
      const card = testRenderer.root.findByType(View);
      const search = card.props.children[2];
      const searchBar = search.props.children;

      expect(cardCont.props.onSearchPress).toEqual(onSearchPressMock);
      expect(search.props.style).toEqual(styles.searchButtonContainerViewStyle);
      expect(searchBar.type).toEqual(SearchButton);
      expect(searchBar.props.label).toEqual(expectedButtonLabelMock);
      expect(searchBar.props.testID).toEqual('drugSearchCardSearchButton');
    }
  );
});
