import PropTypes from 'prop-types';
import React, { Children, Component } from 'react';
import { Animated, Easing } from 'react-native';
import styled from 'styled-components/primitives';
import { position } from '../../styles';
import { deviceUtils } from '../../utils';
import AnimatedPagerItem from './AnimatedPagerItem';

const buildPagerAnimation = toValue => ({
  duration: 300,
  easing: Easing.bezier(0.4, 0, 0.2, 1),
  toValue,
  useNativeDriver: true,
});

const Container = styled.View`
  ${position.cover};
`;

export default class AnimatedPager extends Component {
  static propTypes = {
    children: PropTypes.node,
    isOpen: PropTypes.bool.isRequired,
    width: PropTypes.number,
  }

  static defaultProps = {
    width: deviceUtils.dimensions.width - 31,
  }

  translateValues = {
    page1: new Animated.Value(0),
    page2: new Animated.Value(this.props.width),
  }

  componentDidUpdate = () => this.onAnimatePages(this.props.isOpen)

  onAnimatePages = (isOpen) => {
    const { width } = this.props;
    const { page1, page2 } = this.translateValues;

    const page1TargetValue = isOpen ? (width * -1) : 0;
    const page2TargetValue = isOpen ? 0 : width;

    return Animated.parallel([
      Animated.timing(page1, buildPagerAnimation(page1TargetValue)).start(),
      Animated.timing(page2, buildPagerAnimation(page2TargetValue)).start(),
    ]);
  }

  render = () => {
    const { children, ...props } = this.props;
    const pages = Children.toArray(children).slice(0, 2);

    return (
      <Container {...props}>
        <AnimatedPagerItem translateX={this.translateValues.page1}>
          {pages[0]}
        </AnimatedPagerItem>
        <AnimatedPagerItem translateX={this.translateValues.page2}>
          {pages[1]}
        </AnimatedPagerItem>
      </Container>
    );
  }
}
