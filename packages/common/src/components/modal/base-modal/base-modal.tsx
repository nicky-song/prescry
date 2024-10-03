// Copyright 2018 Prescryptive Health, Inc.

import React, { Component } from 'react';
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { GreyScale } from '../../../theming/theme';
import { animateOpacity } from '../../../utils/animation.helper';
import { CloseButton } from '../../buttons/close-button/close-button';

export interface IBaseModalProps {
  children: React.ReactNode;
  modalContainerStyle?: ViewStyle;
  closeModal?: () => void;
  showCloseButton?: boolean;
}
export interface IBaseModalState {
  opacity: Animated.Value;
}
export class BaseModal extends Component<IBaseModalProps, IBaseModalState> {
  public state = {
    opacity: new Animated.Value(0),
  };
  public componentDidMount() {
    animateOpacity(this.state.opacity, 500, 1);
  }

  public closeModal = (): void => {
    if (this.props.closeModal) {
      animateOpacity(this.state.opacity, 0, 0, this.props.closeModal);
    }
  };
  public renderCloseButton = () => {
    return (
      this.props.showCloseButton && (
        <View style={styles.closeBtnContainer}>
          <CloseButton imageName='closeGreyButton' onPress={this.closeModal} />
        </View>
      )
    );
  };

  public renderBaseModal = (): React.ReactNode => {
    const { children, modalContainerStyle }: IBaseModalProps = this.props;
    return (
      <View style={[styles.modalInnerContainerView, modalContainerStyle]}>
        {this.renderCloseButton()}
        {children}
      </View>
    );
  };

  public render() {
    return (
      <Animated.View
        style={[styles.modalContainerView, { opacity: this.state.opacity }]}
      >
        <TouchableOpacity
          onPress={this.closeModal}
          style={styles.modalContainerView}
          activeOpacity={1}
        />
        {this.renderBaseModal()}
      </Animated.View>
    );
  }
}

const modalContainerView: ViewStyle = {
  alignItems: 'center',
  backgroundColor: 'rgba(52,52,52,0.5)',
  bottom: 0,
  justifyContent: 'center',
  left: 0,
  position: 'absolute',
  right: 0,
  top: 0,
};
const modalInnerContainerView: ViewStyle = {
  alignItems: 'center',
  backgroundColor: GreyScale.lightest,
  bottom: 20,
  flexDirection: 'column',
  flexGrow: 0,
  justifyContent: 'center',
  left: 20,
  minHeight: 250,
  position: 'absolute',
  right: 20,
};
const styles = StyleSheet.create({
  closeBtnContainer: {
    position: 'absolute',
    right: 20,
    top: 30,
  },
  modalContainerView,
  modalInnerContainerView,
});
