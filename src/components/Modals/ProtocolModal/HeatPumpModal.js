import React from 'react';
import {
    View,
    TouchableOpacity,
    Modal,
    Text,
    StyleSheet
} from 'react-native';
import theme from '../../../config';

const parts = [
    {
        val: 1,
        name: "inne-del",
        title: "Innedel"
    },
    {
        val: 2,
        name: "ute-del",
        title: "Utedel"
    }
];

class HeatPumpModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedPart: parts[0],
        }
    }

    onHeatPumpPartChanged = index => {
        this.setState({selectedPart: parts[index]});
    }

    onSubmit = () => {
        this.props.toggleModal();

        this.props.heatPump.serialNumbers.push({
            serialNumber: '',
            type: {
                val: this.state.selectedPart.val,
                name: this.state.selectedPart.name
            }
        });

        this.props.onUpdateHeatPumpPart(this.props.heatPump, this.props.index);
    }
    
    render() {
        return (
            <Modal
                animationType='fade'
                transparent={true}
                visible={this.props.modalVisible}
                onRequestClose={this.props.toggleModal}
                style={{
                    flex: 1
                }}
            >
                <View style={{
                    flex: 1,
                    backgroundColor: theme.COLOR_MODAL_BACKGROUND,
                    padding: 30,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            width: '80%',
                            borderRadius: 5,
                            padding: 10
                        }}
                    >
                    <View style={styles.containerButtonPart}>
                        <TouchableOpacity
                            onPress={() => 
                                this.onHeatPumpPartChanged(0)
                            }
                            style={[
                                styles.buttonPart,
                                this.state.selectedPart.val === 1 && styles.buttonPartSelected
                            ]}
                        >
                            <Text
                                style={[
                                    styles.textPart,
                                    this.state.selectedPart.val === 1 && styles.textPartSelected
                                ]}
                            >INNEDEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => 
                                this.onHeatPumpPartChanged(1)
                            }
                            style={[
                                styles.buttonPart,
                                this.state.selectedPart.val === 2 && styles.buttonPartSelected
                            ]}
                        >
                            <Text
                                style={[
                                    styles.textPart,
                                    this.state.selectedPart.val === 2 && styles.textPartSelected
                                ]}
                            >UTEDEL</Text>
                        </TouchableOpacity>
                    </View>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity
                                onPress={this.props.toggleModal}
                                style={[
                                    styles.buttonAction,
                                    {backgroundColor: theme.COLOR_RED}
                                ]}
                            >
                                <Text
                                    style={styles.textAction}
                                >{"Avbryt"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={this.onSubmit}
                                style={[
                                    styles.buttonAction,
                                    {backgroundColor: theme.COLOR_PRIMARY}
                                ]}
                            >
                                <Text
                                    style={styles.textAction}
                                >{"Välj"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
const styles = StyleSheet.create({
    containerButtonPart: {
        marginBottom: 20
    },
    buttonPart: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: theme.COLOR_GREY,
        backgroundColor: 'white',
        marginBottom:10
    },
    textPart: {
        fontSize: 18,
        color: theme.COLOR_GREY,
    },
    buttonPartSelected: {
        backgroundColor: theme.COLOR_PRIMARY,
        borderColor: theme.COLOR_PRIMARY
    },
    textPartSelected: {
        color: 'white'
    },
    buttonAction: {
        fontSize: 18,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 4,
        flex: 1
    },
    textAction: {
        color: 'white',
        padding: 8,
        fontSize: 18
    }
});
export default HeatPumpModal;