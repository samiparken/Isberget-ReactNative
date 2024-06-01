import React, {Component} from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Pages } from 'react-native-pages';
import AppWalkthroughPage from '../../components/UI/AppWalkthroughPage';
import theme from '../../config';
import routes from '../../routes/index';

const text = ["Klicka på en oaccepterad (blå) pin. I listan visas då två " +
	"val: grön för att acceptera och röd för att neka jobbet.",
	"Välj dag genom att klicka på ett datum. Färgerna visar hur många bokade" +
	" jobb och bokningar ej bekräftade av kund som finns på respektive dag." +
	" Klicka på en obokad pin (orange) och välja BOKA i listan.",
	"När du klickat på BOKA kan du välja tid för installationen. Du kan även" +
	" se vilka tider du har jobb den dagen. Välj sedan om du vill skicka tidsförslaget" +
	" till kund eller om du vill boka in det direkt.",
	"Här kan du se alla dagens jobb samt om produkten finns hos kund. Härifrån kommer du " +
	"även åt installationsprotokollet. När protokollet är ifyllt och signerat är ordern markerad" +
	" som klar!"]

const title = ["Acceptera jobb", "Boka jobb", "Boka jobb", "Dagens jobbs"]
const PAGES_REF = 'pages';

class AppWalkthrough extends Component {
	onClose = () => {
		routes.dismissAllModals();
	}

	onChangePage = (index) => {
		if (!(index < 0 || index >= text.length)) {
			this.refs[PAGES_REF].scrollToPage(index);
		}
	}

	render() {
		return (
			<SafeAreaView style={styles.container}>
				<Pages
					indicatorColor={theme.COLOR_PRIMARY}
					ref={PAGES_REF}
				>
				{
					text.map((value, index) => (
						<AppWalkthroughPage
							key={index}
							onClose={this.onClose}
							index={index}
							lastPage={index === text.length - 1}
							text={value}
							title={title[index]}
							onChangePage={this.onChangePage}
						/>
					))
				}
				</Pages>
			</SafeAreaView>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.COLOR_WHITE,
	},
});

export default AppWalkthrough;
