import React from 'react';
import {
	StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import theme from '../../../config';
import DefaultModal from '../DefaultModal';
import deviceStorage from '../../../services/deviceStorage';
import { CheckBox } from 'react-native-elements';
import DefaultButtonShadow from '../../UI/DefaultButtonShadow'
import { updateFilter, updateUserNameFilter, updateFilterUser } from '../../../store/actions/index';
class AdminFilterModal extends React.Component {

    state = { 
      userName: [],
      installers: [],   
    }
	
	async componentDidMount(){
		const installers =  await deviceStorage.getItem('usersInCompany');
		const userName = []
		JSON.parse(installers).map(index => userName.push(index.userDisplayName))
		this.props.onUpdateUsername(userName);
    this.setState({
			installers: JSON.parse(installers),
			userName,
    })
	}
	
	toggleCheckBox = (userName) => {
		this.props.onUpdateFilterUser(userName)
	};

	onSaveButtonPressed = () => {
		this.props.onUpdateFilter(this.props.data.userNamesFilter)
		this.props.toggleFilter()
	};
	
  render() {
      return (
			<DefaultModal
				visible={ this.props.isVisible }
				animationType="slide"
				toggleModal={ this.props.toggleFilter }
				headerText={"Välj installatör"}>
				{
						this.state.installers.map((index,key) => {
						 return ( 
							<CheckBox
								left
								key={key.toString()}
								title={index.userDisplayName}
								onPress={() => this.toggleCheckBox(index.userDisplayName)}
								onIconPress={ () => this.toggleCheckBox(index.userDisplayName)}
								checked={this.props.data.userNamesFilter.includes(index.userDisplayName)}
								containerStyle={styles.signatureCheckBox}
								textStyle={styles.signatureText}
							/>
						 )
					})
				}
				<DefaultButtonShadow 
					buttonTitle={"Spara"}
					onPress={this.onSaveButtonPressed}
				/>
			</DefaultModal>
			)
  }	
}

const styles = StyleSheet.create({
	signatureCheckBox: {
		borderWidth: 0,
		backgroundColor: 'white',
		width: '100%',
		marginLeft: 0,
	},
	signatureText: {
		fontSize: 16,
		color: theme.COLOR_DARK_GREY,
	},
});

const mapStateToProps = (state) => ({
  data: state.bookJobs,
});

const mapDispatchToProps = dispatch => ({
	onUpdateFilter: (data) => dispatch(updateFilter(data)),
	onUpdateUsername: (data) => dispatch(updateUserNameFilter(data)),
	onUpdateFilterUser: (data) => dispatch(updateFilterUser(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminFilterModal);
