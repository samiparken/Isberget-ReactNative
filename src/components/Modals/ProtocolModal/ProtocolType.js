import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';
import { Picker } from 'native-base';
import {
  func,
  shape,
  string,
  number,
} from 'prop-types';
import theme from '../../../config';

const types = [
  {
    val: 5,
    name: 'Generic',
    key: 'gen',
  },
  {
    val: 6,
    name: 'Ä.T.A',
    key: 'äta',
  },
  {
    val: 1,
    name: 'Luft-Luft',
    key: 'll',
  },
  {
    val: 2,
    name: 'Luft-Vatten',
    key: 'lvfl',
  },
  {
    val: 3,
    name: 'Frånluft',
    key: 'lvfl',

  },
  {
    val: 4,
    name: 'Reklamation',
    key: 'reclaim',
  },
];

const ProtocolType = ({
  selectedType,
  onJobTypeChanged,
}) => (
  <View style={styles.containerPicker}>
    <Picker
      selectedValue={selectedType.val}
      style={styles.picker}
      textStyle={styles.pickerText}
      iosHeader="Välj jobbtyp"
      onValueChange={(val) => {
        const selected = types.find(item => item.val === val);
        onJobTypeChanged(selected);
      }}
    >
      {
        types.map(obj => (
          <Picker.Item
            key={obj.val}
            label={obj.name}
            value={obj.val}
          />
        ))
      }
    </Picker>
  </View>
);

ProtocolType.propTypes = {
  onJobTypeChanged: func.isRequired,
  selectedType: shape({
    val: number,
    name: string,
    key: string,
  }).isRequired,
};

const styles = StyleSheet.create({
  containerPicker: {
    borderRadius: theme.BORDER_RADIUS_MEDIUM,
    backgroundColor: theme.COLOR_PRIMARY,
    overflow: 'hidden',
    width: '80%',
    alignSelf: 'center',
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowOffset: { height: 1, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    paddingHorizontal: 10,
  },
  picker: {
    width: '100%',
    color: theme.COLOR_WHITE,
    backgroundColor: theme.COLOR_PRIMARY,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerText: {
    color: theme.COLOR_WHITE,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProtocolType;
