import React from 'react';
import {
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { API } from '../../../api/ApiHandler';
import { API_ENDPOINTS, ORDER_STATUS_TEXT } from '../../../api/constants';
import { deleteEventFromCalendar } from '../../../store/actions/index';
import theme from '../../../config';
import CardContact from './CardContact';
import CardProducts from './CardProducts';
import CardMessage from './CardMessage';
import DefaultModal from '../DefaultModal';
import CardBookDetails from './CardBookDetails';
import CardAnswersView from './CardAnswersView';
import { Navigation } from 'react-native-navigation';
import screens from '../../../routes/screens';

class OrderDetailModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  sendMessageHandler = async (msg) => {
    this.setState({
      isLoading: true,
    });
    const comments = `${msg}\n \n${new Date().toDateString()
    }\n \n${this.props.products.Comment}`;
    const body = {
      param1: this.props.products.OrderId || this.props.products.Id || this.props.products.orderId,
      param2: comments,
    };
    await API.get(API_ENDPOINTS.SetNewOrderComment, body);
    this.props.products.Comment = comments;
    this.setState({
      isLoading: false,
    });
  }

  deleteEventFromCalendar = () => {
    this.props.deleteEventFromCalendar(this.props.products);
    this.props.toggleModal();
  }

  getHeaderText = () => {
    const orderNumber = this.props.products.order_number_on_client
    || this.props.products.Order_number_on_client;
    return `Order: # ${orderNumber}`;
  }

  goToAnswersScreen = () => {
    Navigation.push(this.props.componentId,{
      component:{
        name: screens.CLIENT_ANSWERS_SCREEN,
        passProps: {
          answers: this.props.answers,
          headerText: this.getHeaderText(),
        }
      }
    });
    
    this.props.toggleModal();
  }

  render() {
    return (
      <DefaultModal
        visible={this.props.visible}
        animationType="slide"
        toggleModal={this.props.toggleModal}
        isLoading={this.state.isLoading}
        headerText={this.getHeaderText()}
      >
        <CardContact order={this.props.products} />
        {this.props.products.OrderStatus === ORDER_STATUS_TEXT.bookedWithCustomer
          ? <CardBookDetails 
            onRebookJobSelected={() => this.props.onRebookJobSelected(this.props.products)} 
            order={this.props.products} 
          /> 
          : null
        }
        <CardProducts
          products={this.props.products.ProductList}
        />
        <CardMessage
          comments={this.props.products.Comment}
          onPress={this.sendMessageHandler}
        />
        {this.props.answers && this.props.answers.length > 0 
          && <CardAnswersView onViewAnswers={this.goToAnswersScreen} />
        }
        {
          this.props.showDeleteButton && (
            <TouchableOpacity
              style={[
                styles.buttonStyle,
                styles.buttonCancel,
                { backgroundColor: theme.COLOR_RED },
              ]}
              onPress={() => this.deleteEventFromCalendar()}
            >
              <Image source={theme.ICON_EXIT_WHITE} />
              <Text style={styles.buttonText}>Avboka</Text>
            </TouchableOpacity>
          )
        }
      </DefaultModal>
    );
  }
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: theme.COLOR_PRIMARY,
    borderRadius: 8,
    alignSelf: 'center',
    width: 200,
  },
  buttonCancel: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 40,
    width: '100%',
    shadowColor: theme.COLOR_LIGHT_GREY,
    shadowOffset: { height: 2, width: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    color: theme.COLOR_WHITE,
    textAlign: 'center',
  },
});

const mapDispatchToProps = dispatch => ({
  deleteEventFromCalendar: id => dispatch(deleteEventFromCalendar(id)),
});

export default connect(null, mapDispatchToProps)(OrderDetailModal);
