import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Alert,
} from 'react-native';
import { CheckBox } from 'react-native-elements';
import { connect } from 'react-redux';
import ProtocolInput from './ProtocolInput';
import ProtocolRadioForm from './ProtocolRadioForm';
import HeatPumpList from './HeatPumpList';
import Signature from './Signature';
import ProtocolCamera from './ProtocolCamera';
import ProtocolType from './ProtocolType';
import Label from './Label';
import theme from '../../../config';
import Card from '../../UI/Card';
import DefaultModal from '../DefaultModal';
import { postProtocol } from '../../../store/actions/index';

class ProtocolModal extends React.Component {
  state = {
    selectedJobType: {
      val: 5,
      name: 'Generic',
      key: 'gen',
    },
    general: {
      extraWork: {
        title: 'Extra arbete utöver detta uppdrag?',
        value: null,
      },
      comment: {
        title: 'Kommentar',
        value: '',
      },
      extraPayment: {
        title: 'Extra kostnader enligt överenskommelse med kund (inkl moms)',
        value: '',
      },
      certNumber: null,
    },
    ll: {
      runOffCheck: {
        title: 'Testat avrinning från innedelen?',
        value: null,
      },
      heatPumpOperationWalkthrough: {
        title: 'Instruerat hur värmepumpen fungerar',
        value: null,
      },
      installationCompleted: {
        title: 'Är installationen klar?',
        value: null,
      },
      installedWithPlug: {
        title: 'Installeras med stickpropp?',
        value: null,
      },
      customerElectrician: {
        title: 'Kund ordnar själv med elektriker?',
        value: null,
      },
    },
    lvfl: {
      filterInstalled: {
        title: 'Smutsfiler monterat?',
        value: null,
      },
      circulationPumpVerified: {
        title: 'Kontrollerat cirkulationspump?',
        value: null,
      },
      manometerPressure: {
        title: 'Kontrollerat manometertryck?',
        value: null,
      },
      ventilatedBuilding: {
        title: 'Luftat huset samt nya pannan?',
        value: null,
      },
      valveCheck: {
        title: 'Kontrollera att eventuella avstängningsventiler i cirkulationssystemet är öppna?',
        value: null,
      },
      circulationPumpRate: {
        title: 'Cirkulationspump hastighet %?',
        value: null,
        input: true,
      },
      spillWaterCheck: {
        title: 'Kontrollerat att spillvatten (skvallerrör) är anslutna till golvbrunn alernativt golv?',
        value: null,
      },
      instructionWalkthrough: {
        title: 'Genomgång samt klistrat instuktionen till kunden på pannan?',
        value: null,
      },
      floorHeating: {
        title: 'Kopplades det in Golvvärme vid installation',
        value: null,
      },
      floorHeatingInstallationOnly: {
        title: 'Kopplades den nya pannan endast mot Golvvärme?',
        value: null,
      },
      controlSystemParametersCheck: {
        title: 'Ställdes värmekurvan in efter rätt län i Sverige?',
        value: null,
      },
      clearUp: {
        title: 'Är det grovstädat?',
        value: null,
      },
      ppElectricalInstallation: {
        title: 'Är elinstallationen gjord av Polarpumpen?',
        value: null,
      },
      cableThickness: {
        title: 'Vilken kvadrat på kabel är dragen vid installation?',
        value: null,
        input: true,
      },
      inPower: {
        title: 'Kontrollerat ineffekt?',
        value: null,
      },
      switchCheck: {
        title: 'Kontrollera så att alla switchar står rätt (kolla lathund eller instruktionsbok)?',
        value: null,
      },
      pumpStartCheck: {
        title: 'Kontrollera så att pumpen startar, det tar mellan 5-10 min för kompressor att starta',
        value: null,
      },
      installationNotCompleted: {
        title: 'Återstår någonting utav Installationen eller saknades något?',
        value: null,
      },
    },
    reclaim: {
      productError: {
        title: 'Var det fel på produkten?',
        value: null,
      },
      installationError: {
        title: 'Var det fel på installationen?',
        value: null,
      },
      productMisplaced: {
        title: 'Är produkten felplacerad?',
        value: null,
      },
      buildingError: {
        title: 'Kan huset ha orsakat driftstoppet?',
        value: null,
      },
      errorSolved: {
        title: 'Är felet åtgärdat?',
        value: null,
      },
      /* electricalError: {
title: '',
value: null},
waterSystemError: {
title: '',
value: null},
insidePartError: {
title: '',
value: null},
outsidePartError: {
title: '',
value: null},
userError: {
title: '',
value: null},
noError: {
title: '',
value: null},
revisitRequired: {
title: '',
value: null},
productErrorFromInstallation:  {
title: '',
value: null},
ventilationError: {
title: '',
value: null},
*/
    },
    heatPumps: [{
      name: '',
      serialNumbers: [
        {
          serialNumber: '',
          type: {
            val: 1,
            name: 'inne-del',
          },
        }, {
          serialNumber: '',
          type: {
            val: 2,
            name: 'ute-del',
          },
        }],
    }],
    otherSignature: false,
    rawSignatureData: '', // byte[]
    photoBase64: '', // string
    signatureData: '', // Används ej, hämtas direkt i onSubmitProtocol
    signaturePersonalNumber: '', // string
    signatureDate: '', // DateTime
    installerName: this.props.installerName, // string
    orderNumber: '', // string
    city: '', // string
  }

  onHeatPumpsInputChanged = (value, pumpIndex, type, partIndex) => {
    if (type) { // inne-del eller ute-del
      this.setState((prevState) => {
        const { heatPumps } = prevState;
        heatPumps[pumpIndex].serialNumbers[partIndex].serialNumber = value;
        return { heatPumps };
      });
    } else {
      this.setState((prevState) => {
        const { heatPumps } = prevState;
        heatPumps[pumpIndex].name = value;
        return { heatPumps };
      });
    }
  }

  onAddFullHeatPump = () => {
    this.setState((prevState) => {
      const { heatPumps } = prevState;
      heatPumps.push({
        name: '',
        serialNumbers: [
          {
            serialNumber: '',
            type: {
              val: 1,
              name: 'inne-del',
            },
          },
          {
            serialNumber: '',
            type: {
              val: 2,
              name: 'ute-del',
            },
          },
        ],
      });
      return { heatPumps };
    });
  }

  onUpdateHeatPumpPart = (heatPump, index) => {
    this.setState((prevState) => {
      const { heatPumps } = prevState;
      heatPumps[index] = heatPump;
      return { heatPumps };
    });
  }

  onCommentChanged = (value) => {
    this.setState((prevState) => {
      const { general } = prevState;
      general.comment.value = value;
      return { general };
    });
  }

  onExtraPaymentChanged = (value) => {
    this.setState((prevState) => {
      const { general } = prevState;
      general.extraPayment.value = value;
      return { general };
    });
  }

  onOtherNameChanged = (value) => {
    this.setState({ otherName: value });
  }

  onPersonalNumberChanged = (value) => {
    this.setState({ signaturePersonalNumber: value });
  }

  toggleSignatureCheckBox = () => {
    this.setState(prevState => ({
      otherSignature: !prevState.otherSignature,
    }));
  };

  onJobTypeChanged = (jobItem) => {
    this.setState((prevState) => {
      if (prevState.selectedJobType == jobItem) {
        return {
          selectedJobType: {
            val: 5,
            name: 'Generic',
            key: 'gen',
          },
        };
      }
      return {
        selectedJobType: jobItem,
      };
    });
  }

  onInputChanged = (value, key) => {
  // const jobTypeKey = this.state.selectedJobType.key;
    this.setState((prevState) => {
      const newVal = prevState[this.state.selectedJobType.key];
      newVal[key].value = value ? 1 : 0;
      return { [this.state.selectedJobType.key]: newVal };
    });
  }

  onSaveImage = (photoBase64) => {
    this.setState({ photoBase64 });
  }

  onSubmitProtocol = async (signatureData) => {
    let checkListItems = null;

    const checkList = {};
    if (this.state.selectedJobType.val !== 5 && this.state.selectedJobType.val !== 6) {
      checkListItems = this.state[this.state.selectedJobType.key];
      Object.keys(checkListItems).map((item, index) => {
        checkList[item] = checkListItems[item].value;
      });
      checkList.certNumber = this.state.general.certNumber;
    }

    checkList.extraWork = this.state.general.extraPayment.value || 0;
    checkList.comment = `${this.state.general.comment.value}\n \nExtra avgifter: \n${this.state.general.extraPayment.value}`;

    const post = {
      Title: 'Protokoll',
      OrderId: this.props.job.Id || this.props.job.OrderId || this.props.job.orderId,
      InstallerName: this.state.installerName,
      SignatureName: this.state.otherSignature ? `Ställföreträdares namn: ${this.state.otherName}` : this.props.job.FullName || this.props.job.Description,
      installationProtocolType: { val: this.state.selectedJobType.val, name: this.state.selectedJobType.name },
      otherSignature: this.state.otherSignature,  //bool
      signatureData: `data:image/png;base64,${signatureData}`,
      signaturePersonalNumber: this.state.signaturePersonalNumber,
      PhotoBase64: `data:image/png;base64,${this.state.photoBase64}`,
      checkList,
    };

    if (this.state.selectedJobType.val !== 5 && this.state.selectedJobType.val !== 6) {
      post.heatPumps = this.state.heatPumps;
    }

    console.log(post);
    
    const asyncAlert = async (error = '') => new Promise((resolve) => {
      Alert.alert(
        error || 'Signering lyckades!',
        'Tryck OK för att fortsätta',
        [
          {
            text: 'Ok',
            onPress: () => {
              resolve('YES');
            },
          },
        ],
        { cancelable: false },
      );
    });

    try {
      const res = await this.props.onPostProtocol(post, this.props.job);
      if (res) {
        await asyncAlert();
        this.props.toggleModal();
      } else {
        asyncAlert('Signering misslyckades...');
      }
    } catch (error) {
      asyncAlert('Signering misslyckades...');
      // this.props.toggleModal();
    }
  }

  onRemoveHeatPump = (index) => {
    this.setState((prevState) => {
      const { heatPumps } = prevState;
      heatPumps.splice(index, 1);
      return { heatPumps };
    });
  }

  render() {
    const notGeneric = this.state.selectedJobType.val !== 5 && this.state.selectedJobType.val !== 6;
    return (
      <DefaultModal
        visible={this.props.visible}
        toggleModal={this.props.toggleModal}
        isLoading={this.props.data.isLoading}
        animationType="slide"
        headerText={`Protokoll för order: ${this.props.job.Order_number_on_client}`}
      >
        <Label text="VÄLJ JOBBTYP" />
        <ProtocolType
          selectedType={this.state.selectedJobType}
          onJobTypeChanged={this.onJobTypeChanged}
        />
        {
          notGeneric && (
            <View>
              <Label text="VÄRMEPUMP" />
              <Card>
                {
                  this.state.heatPumps.map((heatPump, index) => (
                    <HeatPumpList
                      key={index}
                      heatPump={heatPump}
                      index={index}
                      onInputChange={this.onHeatPumpsInputChanged}
                      onAddFullHeatPump={this.onAddFullHeatPump}
                      onUpdateHeatPumpPart={this.onUpdateHeatPumpPart}
                      onRemoveHeatPump={this.onRemoveHeatPump}
                    />
                  ))
                }
              </Card>
              <TouchableOpacity
                onPress={this.onAddFullHeatPump}
                style={styles.containerAddHeatPump}
              >
                <Text style={styles.textAddHeatPump}>Lägg till pump</Text>
              </TouchableOpacity>
              <Label text="CHECKLISTA" />
              <Card>
                {
                  Object.keys(this.state[this.state.selectedJobType.key]).map((key, index) => {
                    const item = this.state[this.state.selectedJobType.key][key];
                    if (item.input) {
                      return (
                        <ProtocolInput
                          label={item.title}
                          value={item.value}
                          onInputChange={this.onInputChanged}
                          index={index}
                          key={key}
                          stateKey={key}
                        />
                      );
                    }
                    return (
                      <ProtocolRadioForm
                        titleValue={item.title}
                        index={index}
                        value={item.value}
                        key={key}
                        stateKey={key}
                        onPress={this.onInputChanged}
                      />
                    );
                  })
                }
              </Card>
            </View>
          )
        }
        <Label text="ÖVRIGT" />
        <Card>
          <ProtocolInput
            label={this.state.general.comment.title}
            value={this.state.general.comment.value}
            onInputChange={this.onCommentChanged}
            commentStyle={{
              height: 100,
              borderColor: theme.COLOR_GREY,
              borderWidth: 2,
              borderRadius: 8,
              fontSize: 16,
            }}
            multiline
            numberOfLines={5}
          />
          <ProtocolInput
            label={this.state.general.extraPayment.title}
            value={this.state.general.extraPayment.value}
            onInputChange={this.onExtraPaymentChanged}
            keyboardType="numeric"
            returnKeyType="done"
          />
          <CheckBox
            left
            title="Ej beställarens underskrift"
            onPress={this.toggleSignatureCheckBox}
            onIconPress={this.toggleSignatureCheckBox}
            checked={this.state.otherSignature}
            containerStyle={styles.signatureCheckBox}
            textStyle={styles.signatureText}
          />
          {
            this.state.otherSignature && (
              <View>
                <ProtocolInput
                  label="Ställföreträdare"
                  value={this.state.otherName}
                  onInputChange={this.onOtherNameChanged}
                  returnKeyType="done"
                />
                <ProtocolInput
                  label="Personnummer"
                  value={this.state.signaturePersonalNumber}
                  onInputChange={this.onPersonalNumberChanged}
                  returnKeyType="done"
                  keyboardType="numeric"
                />
              </View>
            )
          }
        </Card>
        <Label text="KAMERA" />
        <Card>
          <ProtocolCamera onSaveImage={this.onSaveImage} />
        </Card>
        <Label text="SIGNATUR" />
        <Card>
          <Signature onSaveSignature={this.onSubmitProtocol} />
        </Card>
      </DefaultModal>
    );
  }
}

const styles = StyleSheet.create({
  containerAddHeatPump: {
    marginTop: 8,
    marginBottom: 24,
    padding: 8,
    borderColor: theme.COLOR_DARK_GREY,
    alignSelf: 'center',
    borderWidth: 2,
    borderRadius: 10,
    width: 140,
  },
  textAddHeatPump: {
    marginRight: 5,
    fontWeight: 'bold',
    color: theme.COLOR_DARK_GREY,
    textAlign: 'center',
    fontSize: 16,
  },
  signatureCheckBox: {
    borderWidth: 0,
    backgroundColor: theme.COLOR_WHITE,
    width: '100%',
    marginLeft: 0,
  },
  signatureText: {
    fontSize: 16,
    color: theme.COLOR_DARK_GREY,
  },
});

const mapStateToProps = state => ({
  data: state.bookJobs,
});

const mapDispatchToProps = dispatch => ({
  onPostProtocol: (body, job) => dispatch(postProtocol(body, job)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProtocolModal);
