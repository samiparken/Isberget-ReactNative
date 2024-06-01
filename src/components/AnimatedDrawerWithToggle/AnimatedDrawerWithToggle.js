import React from 'react';
import {
  Animated,
  Platform,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import theme from '../../config';

class AnimatedDrawer extends React.Component {
  constructor(props) {
    super(props);

    const subtractedHeight = 100;
    this.cancelMounted = false;

    this.state = {
      height: new Animated.Value(180),
      maxHeight: theme.SIZE_WINDOW_HEIGHT - subtractedHeight,
      startHeight: theme.HEIGHT_ANIMATED_DRAWER,
      drawerAtTop: false,
      currentIcon: theme.ICON_ARROW_UP,
      elevation: 0,
    };
  }

  onTogglePressed = () => {
    const { drawerAtTop, startHeight, maxHeight } = this.state;

    Animated.timing(
      this.state.height,
      {
        toValue: drawerAtTop ? startHeight : maxHeight,
        useNativeDriver: false,
      },
    ).start(() => {
      if (drawerAtTop) {
        this.setState({ elevation: 0 });
      }
    });
    this.setState(prevState => ({
      drawerAtTop: !prevState.drawerAtTop,
      currentIcon: prevState.drawerAtTop ? theme.ICON_ARROW_UP : theme.ICON_ARROW_DOWN,
      elevation: !prevState.drawerAtTop ? 4 : prevState.elevation,
    }));
  }

  render() {
    const { drawerAtTop, height, elevation } = this.state;
    const { children } = this.props;
    return (
      <Animated.View
        style={[
          {
            height,
            elevation,
          },
          drawerAtTop && { backgroundColor: theme.COLOR_WHITE_TRANSPARENT },
          styles.container,
        ]}
      >
        <TouchableOpacity onPress={this.onTogglePressed}>
          <Image
            source={this.state.currentIcon}
            style={{
              marginBottom: drawerAtTop ? 10 : 4,
              ...Platform.select({
                ios: {
                  marginTop: theme.SIZE_WINDOW_HEIGHT === 812 ? 35 : 25,
                  marginTop: drawerAtTop ? theme.SIZE_WINDOW_HEIGHT === 812 ? 35 : 25 : 0,
                },
                android: {
                  marginTop: drawerAtTop ? 25 : 0,
                },
              }),
            }}
          />
        </TouchableOpacity>
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
    zIndex: 999,
  },
});

export default AnimatedDrawer;
