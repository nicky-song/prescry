// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import renderer from 'react-test-renderer';
import { TouchableOpacity, View } from 'react-native';
import { MoreAboutDiabetesContainer } from './more-about-diabetes';
import { moreAboutDiabetesStyle as styles } from './more-about-diabetes.style';
import { ImageAsset } from '../../image-asset/image-asset';
import { PrimaryTextBox } from '../../text/primary-text-box/primary-text-box';
import { MoreAboutDiabetesContent } from './more-about-diabetes.content';
import { LineSeparator } from '../line-separator/line-separator';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { goToUrl } from '../../../utils/link.helper';
import { IDrugInformation } from '../../../experiences/guest-experience/claim-alert-screen/claim-alert-screen';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../experiences/guest-experience/guest-experience-logger.middleware';
import { getChildren } from '../../../testing/test.helper';

jest.mock('../../icons/font-awesome/font-awesome.icon', () => ({
  FontAwesomeIcon: () => <div />,
}));

jest.mock(
  '../../../experiences/guest-experience/guest-experience-logger.middleware'
);
const guestExperienceCustomEventLoggerMock =
  guestExperienceCustomEventLogger as jest.Mock;

jest.mock('../../../utils/link.helper');
const goToUrlMock = goToUrl as jest.Mock;

const containerProps = {
  count: 40,
  daysSupply: 0,
  dose: '2',
  drugName: 'Lyrica',
  form: 'capsule',
  isScreenFocused: true,
  refillCount: 0,
  rxId: 'mock-rx-20',
  units: 'ml',
  medicationId: '00002771501',
  useDiabetesLink: true,
};

describe('MoreAboutDiabetesContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders expected elements with expected properties', () => {
    const testRenderer = renderer.create(
      <MoreAboutDiabetesContainer {...containerProps} />
    );
    const views = testRenderer.root.findAllByType(View);
    const outerContainer = views[0];
    expect(outerContainer.props.style).toEqual(
      styles.moreAboutDiabetesContainer
    );

    const innerView = views[1];
    expect(innerView.props.style).toEqual(styles.moreAboutDiabetesView);

    const headerView = views[2];
    expect(headerView.props.style).toEqual(styles.headerContainer);

    const infoIcon = testRenderer.root.findByType(ImageAsset);
    expect(infoIcon.props.style).toEqual(styles.imageStyle);

    const links = testRenderer.root.findAllByType(TouchableOpacity);
    const expandingLink = links[0];
    expect(expandingLink.props.style).toEqual(styles.expandingContainer);

    const videoLink = links[1];
    expect(videoLink.props.style).toEqual(styles.videoLinkContainer);
    expect(videoLink.props.onPress).toEqual(expect.any(Function));

    const headerText = testRenderer.root.findByType(PrimaryTextBox);
    expect(headerText.props.textBoxStyle).toEqual(styles.headerText);
    expect(headerText.props.caption).toEqual(
      MoreAboutDiabetesContent.headerText()
    );

    const expandingIcon = testRenderer.root.findByType(FontAwesomeIcon);
    expect(expandingIcon.props.style).toEqual(styles.expandingIcon);
    const lineSeparator = testRenderer.root.findByType(LineSeparator);
    expect(lineSeparator.props.viewStyle).toEqual(
      styles.lineSeparatorViewStyle
    );
  });

  it.each([[undefined], ['video-link']])(
    'handles video link press (videoLink: %p)',
    async (videoLinkMock: undefined | string) => {
      const drugInformationMock: Partial<IDrugInformation> = {
        videoLink: videoLinkMock,
      };

      const testRenderer = renderer.create(
        <MoreAboutDiabetesContainer
          {...containerProps}
          drugInformation={drugInformationMock as IDrugInformation}
        />
      );

      const videoLinkContainer = testRenderer.root.findByProps({
        testID: 'videoLinkContainer',
      });
      const touchableOpacity = getChildren(videoLinkContainer)[0];
      await touchableOpacity.props.onPress();

      if (videoLinkMock) {
        expect(guestExperienceCustomEventLoggerMock).toHaveBeenCalledWith(
          CustomAppInsightEvents.FOLLOW_LINK,
          {
            url: drugInformationMock.videoLink,
          }
        );
        expect(goToUrlMock).toHaveBeenCalledWith(drugInformationMock.videoLink);
      } else {
        expect(guestExperienceCustomEventLoggerMock).not.toHaveBeenCalled();
        expect(goToUrlMock).not.toHaveBeenCalled();
      }
    }
  );

  it('does not render rest of container when expanding container reduced', () => {
    const testRenderer = renderer.create(
      <MoreAboutDiabetesContainer {...containerProps} />
    );
    testRenderer.root.instance.setState({
      expandInfoContainer: false,
    });
    const views = testRenderer.root.findAllByType(View);
    const outerContainer = views[0];
    expect(outerContainer.props.style).toEqual(
      styles.moreAboutDiabetesContainer
    );

    const innerView = views[1];
    expect(innerView.props.style).toEqual(styles.moreAboutDiabetesView);

    const headerView = views[2];
    expect(headerView.props.style).toEqual(styles.headerContainer);

    const expandingLink = testRenderer.root.findByType(TouchableOpacity);
    expect(expandingLink.props.style).toEqual(styles.expandingContainer);

    const headerText = testRenderer.root.findByType(PrimaryTextBox);
    expect(headerText.props.textBoxStyle).toEqual(styles.headerText);
    expect(headerText.props.caption).toEqual(
      MoreAboutDiabetesContent.headerText()
    );

    const expandingIcon = testRenderer.root.findByType(FontAwesomeIcon);
    expect(expandingIcon.props.style).toEqual(styles.expandingIcon);
  });
});
