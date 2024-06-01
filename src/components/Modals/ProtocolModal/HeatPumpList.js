import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text
} from 'react-native';
import ProtocolInput from './ProtocolInput';
import HeatPumpModal from './HeatPumpModal';
import theme from '../../../config'; 

const parts = [
  {
    name: "Innedel",
    type: "inne-del",
  },
  {
    name: "Utedel",
    type: "ute-del",
  },
];

class HeatPumpList extends React.Component {
  state = {
    selectedPart: parts[0],
    modalVisible: false,
  }

  onInputChange = (newValue, type, index) => {
      if (!type) { //HEAT PUMP
          this.props.onInputChange(newValue, this.props.index);   
      } else { //INNERDEL OR UTEDEL
          this.props.onInputChange(newValue, this.props.index, type, index);   
      }
  }

  toggleModal = () => {
      this.setState(prevState => ({ modalVisible: !prevState.modalVisible }));
  }

  onRemove = (index) => {
      this.props.heatPump.serialNumbers.splice(index, 1);
      this.props.onUpdateHeatPumpPart(this.props.heatPump, this.props.index);
  }

  render() {
    return (
      <View style={styles.container}>
          <View
              style={styles.containerList}
          >
              <ProtocolInput
                  label='Värmepump'
                  onInputChange={this.onInputChange}
                  value={this.props.heatPump.name.toString()}
              />
              {
                  this.props.heatPump.serialNumbers.map((item, index) => {
                      let title = item.type.name.replace("-","");
                      title = title.charAt(0).toUpperCase() + title.slice(1);
                      return (
                          <ProtocolInput
                              label={title}
                              type={item.type.name}
                              value={item.serialNumber.toString()}
                              key={index}
                              index={index}
                              icon={index > 1 ? theme.ICON_EXIT_WHITE : null}
                              onRemove={index > 1 ? this.onRemove : null}
                              onInputChange={this.onInputChange}
                          />
                      )
                  })
              }
          </View>
          <View
              style={{
                  flexDirection: 'row', 
                  justifyContent: this.props.index != 0 ? 'space-between' : 'flex-end',
                  alignItems: 'center',
                  //marginTop: 8
              }}
          >
          {
            this.props.index != 0 && (
              <TouchableOpacity
                onPress={() => this.props.onRemoveHeatPump(this.props.index)}
              >
                <Text
                  style={[
                    styles.textAddPart,
                    {color: theme.COLOR_RED},
                  ]}
                >
                  {"TA BORT"}
                </Text>
              </TouchableOpacity>
            )
          }
            <TouchableOpacity
              onPress={this.toggleModal}
              style={styles.containerAddPart}
            >
              <Text
                style={[
                    styles.textAddPart,
                    {fontSize: 16},
                ]}
              >Lägg till del</Text>
            </TouchableOpacity>
          </View>
          <HeatPumpModal
            modalVisible={this.state.modalVisible}
            toggleModal={this.toggleModal}
            heatPump={this.props.heatPump}
            index={this.props.index}
            onUpdateHeatPumpPart={this.props.onUpdateHeatPumpPart}
          />
        </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  containerList: {
    paddingVertical: 10,
  },
  containerAddPart: {
    marginRight: 5,
    paddingVertical: 10,
    flexDirection: 'row',
  },
  textAddPart: {
    marginRight: 5,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.8)',
    fontSize: 14,
  }
});

export default HeatPumpList;
