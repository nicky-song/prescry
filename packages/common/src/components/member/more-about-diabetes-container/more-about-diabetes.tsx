// Copyright 2020 Prescryptive Health, Inc.

import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { PrimaryTextBox } from '../../../components/text/primary-text-box/primary-text-box';
import { LineSeparator } from '../line-separator/line-separator';
import { IRecommendationTopProps } from '../recommendation-top/recommendation-top';
import { MoreAboutDiabetesContent } from './more-about-diabetes.content';
import {
  CustomAppInsightEvents,
  guestExperienceCustomEventLogger,
} from '../../../experiences/guest-experience/guest-experience-logger.middleware';
import { ImageAsset } from '../../image-asset/image-asset';
import { moreAboutDiabetesStyle as styles } from './more-about-diabetes.style';
import { FontAwesomeIcon } from '../../icons/font-awesome/font-awesome.icon';
import { goToUrl } from '../../../utils/link.helper';
export interface IMoreAboutDiabetesProps {
  moreInfoUrl?: string;
}
export interface IMoreAboutDiabetesState {
  expandInfoContainer?: boolean;
}

export class MoreAboutDiabetesContainer extends React.Component<
  IRecommendationTopProps & IMoreAboutDiabetesProps
> {
  private videoUrl = this.props.drugInformation?.videoLink;

  public state: IMoreAboutDiabetesState = {
    expandInfoContainer: true,
  };

  public toggleContainerExpand = () => {
    const toggleMessageType = this.state.expandInfoContainer
      ? CustomAppInsightEvents.REDUCE_CONTAINER_SIZE
      : CustomAppInsightEvents.EXPAND_CONTAINER_SIZE;
    guestExperienceCustomEventLogger(toggleMessageType, {});
    this.setState({
      expandInfoContainer: !this.state.expandInfoContainer,
    });
  };

  public renderExpandedBox = () => {
    const onPressVideo = async () => {
      const url = this.videoUrl;
      if (!url) {
        return;
      }

      guestExperienceCustomEventLogger(CustomAppInsightEvents.FOLLOW_LINK, {
        url,
      });
      await goToUrl(url);
    };

    if (this.state.expandInfoContainer) {
      return (
        <View style={styles.videoContainer} testID='videoLinkContainer'>
          <TouchableOpacity
            onPress={onPressVideo}
            style={styles.videoLinkContainer}
          >
            <ImageAsset
              name='diabetesVideoImage'
              resizeMode='contain'
              style={styles.imageStyle}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return;
  };
  public render(): React.ReactNode {
    return (
      <View style={styles.moreAboutDiabetesContainer}>
        <View style={styles.moreAboutDiabetesView}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              onPress={this.toggleContainerExpand}
              style={styles.expandingContainer}
            >
              <PrimaryTextBox
                caption={MoreAboutDiabetesContent.headerText()}
                textBoxStyle={styles.headerText}
              />
              <FontAwesomeIcon
                style={styles.expandingIcon}
                name={
                  this.state.expandInfoContainer
                    ? MoreAboutDiabetesContent.chevronUp
                    : MoreAboutDiabetesContent.chevronDown
                }
              />
            </TouchableOpacity>
          </View>
          {this.renderExpandedBox()}
        </View>
        <LineSeparator viewStyle={styles.lineSeparatorViewStyle} />
      </View>
    );
    return null;
  }
}
