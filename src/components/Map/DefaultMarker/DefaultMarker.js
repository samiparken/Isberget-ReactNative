import React from 'react';
import { Platform } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import CustomCallOut from '../CustomCallOut';
import { ORDER_STATUS_TEXT } from '../../../api/constants';

const IS_IOS = Platform.OS === 'ios';

class DefaultMarker extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.selected && !this.props.selected) {
      this.marker.hideCallout();
      this.props.onToggleCallout(false);
    } else if (!prevProps.selected && this.props.selected) {
      setTimeout(() => {
        this.marker.showCallout();
        this.props.onToggleCallout(true);
      }, 1700);
    }
  }

  closeCallout = () => {
    if (IS_IOS) {
      this.marker.hideCallout();
    }
    this.props.onToggleCallout(false);
  }

  onMarkedSelected = () => {
    const {
      selected,
      onToggleCallout,
      onPressed,
      callOutData,
    } = this.props;
    if (selected) {
      if (this.props.calloutVisible) {
        this.marker.hideCallout();
        onToggleCallout(false);
      } else {
        this.marker.showCallout();
        onToggleCallout(true);
      }
    } else {
      onPressed(callOutData);
    }
  }

  render() {
    let { coordinate } = this.props;
    if (!coordinate) {
      coordinate = {
        latitude: '',
        longitude: '',
      };
    }

    const {
      selected,
      selectedForDate,
      imageSource,
      callOutData,
      onBookJobSelected,
      toggleOrderDetailModal,
    } = this.props;

    let opacity = 1;
    if (callOutData.OrderStatus !== ORDER_STATUS_TEXT.accepted
      && (selected !== null || selectedForDate !== null)) {
      opacity = selected || selectedForDate ? 1 : 0.3;
    }

    return (
      <Marker
        ref={ref => this.marker = ref}
        onPress={(e) => {
          e.stopPropagation();
          this.onMarkedSelected();
        }}
        coordinate={coordinate}
        image={imageSource}
        opacity={opacity}
        onCalloutPress={this.onCalloutSelected}
      >
        {
          IS_IOS && (
            <Callout tooltip={false}>
              <CustomCallOut
                ref={ref => this.callout = ref}
                callOutData={callOutData}
                onBookJobSelected={onBookJobSelected}
                closeCallout={this.closeCallout}
                toggleOrderDetailModal={toggleOrderDetailModal}
              />
            </Callout>
          )
        }
      </Marker>
    );
  }
}

export default DefaultMarker;
