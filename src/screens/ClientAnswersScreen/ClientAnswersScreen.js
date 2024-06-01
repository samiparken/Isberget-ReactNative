import { View, Text, StyleSheet, Image, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react'
import ImageView from "react-native-image-viewing";
import theme from '../../config';
import { Navigation } from 'react-native-navigation';

const ClientAnswersScreen = (props) => {

    const [imageForModal, setImageForModal] = useState(null);

    const onExit = () => {
        Navigation.pop(props.componentId);
    }

    const closeModalImage = () => {
        setImageForModal(null);
    }

    const answerElement = ({ item }) => <View>
        <Text style={styles.question}>
            { item.Question } ?
        </Text>
        {item.IsImage 
            ? <TouchableOpacity onPress={()=>setImageForModal({ uri: item.Answer })} >
                <Image style={styles.answerImage} source={{ uri: item.Answer }} />
            </TouchableOpacity>
            : <Text style={styles.answerText}>
                { item.Answer }
            </Text>
        }
    </View>;

    return <SafeAreaView>
        <View style={styles.root}>
            <Text style={styles.headerText}>
                {props.headerText}
            </Text>
            <FlatList 
                data={props.answers} 
                renderItem={answerElement}
                keyExtractor={item => item['$id']}
            />
            <TouchableOpacity style={styles.backButton} onPress={onExit}>
                <Image source={theme.ICON_DECLINE} />
            </TouchableOpacity>
            <ImageView
                images={imageForModal ? [imageForModal] : []}
                imageIndex={0}
                visible={imageForModal !== null}
                onRequestClose={closeModalImage}
                swipeToCloseEnabled={false}
            />
        </View>  
    </SafeAreaView>
}

const styles = StyleSheet.create({
    root: {
        paddingHorizontal: 20,
        paddingTop: 20,
        backgroundColor: 'white'
    },
    question: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'left',
        marginBottom: 10,
    },
    answerText: {
        fontSize: 21,
        textAlign: 'left',
        marginBottom: 30,
    },
    answerImage: {
        flex: 1,
        height: 200,
        marginBottom: 30,
        resizeMode: 'cover',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        right: -5,
        paddingTop: 8,
        paddingBottom: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
        zIndex: 10,
    },
    headerText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'grey',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default ClientAnswersScreen;