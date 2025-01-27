import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Share,
    ScrollView,
    Alert,
    SafeAreaView,
    ImageBackground,
    Modal,
    Switch,
    TextInput,
    Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'react-native-heroicons/solid';
import { is, se } from 'date-fns/locale';

const fontSFProBold = 'SFProText-Bold';

const EntertainmentDetailsScreen = ({ setSelectedScreenPage, selectedEntertainment, setEntertainments, entertainments }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);
    const [isEditingNow, setIsEditingNow] = useState(false);


    const handleDelete = async (id) => {
        const updatedEntertainments = entertainments.filter(item => item.id !== id);
        setEntertainments(updatedEntertainments);
        await AsyncStorage.setItem('Entertainments', JSON.stringify(updatedEntertainments));
      };


    const formatTime = (timeString) => {
        const date = new Date(timeString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    return (
        <View style={{
            width: dimensions.width,
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            position: 'relative',
            width: '100%',
            zIndex: 1
        }} >
            <View style={{
                zIndex: 50,
                position: 'absolute',
                top: '-3%',
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '90%',
                marginTop: dimensions.height * 0.05,
            }}>
                <TouchableOpacity
                    onPress={() => {
                        if (!isTextClosed) {
                            setIsTextClosed(true);
                        } else setSelectedScreenPage('Home');
                    }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        padding: dimensions.width * 0.04,
                    }}>
                    <ChevronLeftIcon size={dimensions.width * 0.05} color='black' />
                </TouchableOpacity>




                <TouchableOpacity
                    disabled={!isEditingNow}
                    onPress={() => {
                        if (!isTextClosed) {
                            setIsTextClosed(true);
                        } else setSelectedScreenPage('Home');
                    }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        padding: dimensions.width * 0.04,
                        opacity: isEditingNow ? 1 : 0,
                    }}>
                    <CheckIcon size={dimensions.width * 0.05} color='black' />
                </TouchableOpacity>
            </View>
            <ScrollView style={{ width: '100%', }}>
                <View style={{
                    marginBottom: dimensions.height * 0.25,
                    alignItems: 'center',
                    alignSelf: 'center',
                    width: '100%',
                }}>

                    <View style={{
                        alignSelf: 'center',
                        width: '100%',

                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>

                        {selectedEntertainment.images.length === 0 ? (
                            <View style={{
                                backgroundColor: '#202020',
                                alignSelf: 'center',
                                width: '100%',
                                borderRadius: dimensions.width * 0.07,
                                marginBottom: dimensions.height * 0.02,
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: dimensions.height * 0.07,
                            }}>


                                <Image
                                    source={require('../assets/icons/emptyImageIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.1,
                                        height: dimensions.width * 0.1,
                                        textAlign: 'center',
                                        opacity: 0.7,

                                    }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        fontFamily: fontSFProBold,
                                        fontSize: dimensions.width * 0.041,
                                        color: 'white',
                                        textAlign: 'center',
                                        fontWeight: 700,
                                        marginTop: dimensions.height * 0.016,
                                        alignSelf: 'center',
                                        paddingHorizontal: dimensions.width * 0.14,
                                    }}
                                >
                                    No image here
                                </Text>


                            </View>
                        ) : (

                            <Image
                                source={{ uri: selectedEntertainment.images[0] }}
                                style={{
                                    width: selectedEntertainment.images.length > 0 ? dimensions.width : dimensions.width * 0.07,
                                    height: selectedEntertainment.images.length > 0 ? dimensions.height * 0.3 : dimensions.width * 0.07,
                                    textAlign: 'center',
                                    borderRadius: dimensions.width * 0.1,
                                }}
                                resizeMode="stretch"
                            />
                        )}



                    </View>


                    {selectedEntertainment.images.length > 1 && (
                        <ScrollView
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            style={{
                                width: '95%',
                                alignSelf: 'center',
                                paddingBottom: dimensions.height * 0.01,
                            }}
                        >
                            <View style={{
                                width: '100%',
                                alignItems: 'center',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignSelf: 'flex-start',
                            }}>
                                {selectedEntertainment.images.map((image, index) => (
                                    <View
                                        key={index}
                                        
                                        style={{
                                            alignItems: 'center',
                                            alignSelf: 'flex-start',
                                            backgroundColor: '#202020',
                                            borderRadius: dimensions.width * 0.064,
                                            marginBottom: dimensions.height * 0.01,
                                            marginTop: dimensions.height * 0.022,
                                            marginRight: dimensions.width * 0.025,
                                        }}
                                    >
                                        <View>
                                            <Image
                                                source={{ uri: image }}
                                                style={{
                                                    width: dimensions.width * 0.28,
                                                    height: dimensions.width * 0.28,
                                                    textAlign: 'center',
                                                    borderRadius: dimensions.width * 0.04,
                                                }}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </ScrollView>
                    )}
                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.064,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 800,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,
                            marginTop: dimensions.height * 0.0021,


                        }}
                    >
                        {selectedEntertainment.title}
                    </Text>


                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',

                        alignSelf: 'flex-start',
                    }}>
                        <Image
                            source={require('../assets/icons/cursorIcon.png')}
                            style={{
                                width: dimensions.width * 0.05,
                                height: dimensions.width * 0.05,
                                textAlign: 'center',
                                marginLeft: dimensions.width * 0.055,

                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,


                            }}
                        >
                            {selectedEntertainment.address}
                        </Text>
                    </View>


                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.041,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,


                        }}
                    >
                        Description
                    </Text>

                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.041,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.014,


                        }}
                    >
                        {selectedEntertainment.description}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.041,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,


                        }}
                    >
                        Date
                    </Text>

                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.041,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.014,


                        }}
                    >
                        {formatDate(selectedEntertainment.date)}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.041,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,


                        }}
                    >
                        Time
                    </Text>

                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.041,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.014,


                        }}
                    >
                        {formatTime(selectedEntertainment.time)}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontSFProBold,
                            fontSize: dimensions.width * 0.041,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,


                        }}
                    >
                        Ticket purchase link
                    </Text>

                    <TouchableOpacity
                        disabled={selectedEntertainment.ticketLink === 'No ticket link'}
                        onPress={() => Linking.openURL(`${selectedEntertainment.ticketLink}`)}
                        style={{ width: '100%' }}
                    >

                        <Text
                            style={{
                                fontFamily: fontSFProBold,
                                fontSize: dimensions.width * 0.041,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.05,
                                paddingBottom: dimensions.height * 0.014,


                            }}
                        >
                            {selectedEntertainment.ticketLink}
                        </Text>
                    </TouchableOpacity>

                    <View style={{
                        width: '100%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        marginTop: dimensions.height * 0.05,
                    }}>


                        <TouchableOpacity
                            onPress={() => {
                                handleDelete(selectedEntertainment.id);
                                setSelectedScreenPage('Home');
                            }}
                        >
                            <Image
                                source={require('../assets/icons/deleteIcon.png')}
                                style={{
                                    width: dimensions.width * 0.23,
                                    height: dimensions.width * 0.23,
                                    textAlign: 'center',
                                    marginBottom: dimensions.height * 0.02,
                                    marginHorizontal: dimensions.width * 0.03,
                                }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>

                    </View>


                </View>

            </ScrollView>
        </View>
    );
};

export default EntertainmentDetailsScreen;
