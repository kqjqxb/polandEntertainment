import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { useState } from 'react'
import casinosData from '../components/casinosData';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontSFProBold = 'SFProText-Bold';
const fontSFProHeavy = 'SFProText-Heavy';

const CasinosScreen = ({ setSelectedPlace, setSelectedScreenPage, savedPolandPlaces, setSavedPolandPlaces }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));


    const savePlace = async (place) => {
        try {
            const savedPlace = await AsyncStorage.getItem('savedPolandPlaces');
            const parsedTheesePlaces = savedPlace ? JSON.parse(savedPlace) : [];

            const thisPlaceIndex = parsedTheesePlaces.findIndex((loc) => loc.id === place.id);

            if (thisPlaceIndex === -1) {
                const updatedPlacesList = [place, ...parsedTheesePlaces];
                await AsyncStorage.setItem('savedPolandPlaces', JSON.stringify(updatedPlacesList));
                setSavedPolandPlaces(updatedPlacesList);
                console.log('place was saved');
            } else {
                const updatedPlacesList = parsedTheesePlaces.filter((loc) => loc.id !== place.id);
                await AsyncStorage.setItem('savedPolandPlaces', JSON.stringify(updatedPlacesList));
                setSavedPolandPlaces(updatedPlacesList);
                console.log('place was deleted');
            }
        } catch (error) {
            console.error('error of save/delete Poland place:', error);
        }
    };
    const isPlaceSaved = (location) => {
        return savedPolandPlaces.some((loc) => loc.id === location.id);
    };
    return (
        <View>
            <Text
                style={{
                    fontFamily: fontSFProBold,
                    fontSize: dimensions.width * 0.064,
                    color: 'white',
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontWeight: 800,
                }}
            >
                Casino
            </Text>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{
                    marginTop: dimensions.height * 0.02,
                }}
            >
                <View style={{
                    marginBottom: dimensions.height * 0.3,
                }}>
                    {casinosData.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => { setSelectedPlace(item); setSelectedScreenPage('PlaceDetail') }}
                            style={{
                                backgroundColor: '#202020',
                                alignSelf: 'center',
                                width: '100%',
                                position: 'relative',
                                borderRadius: dimensions.width * 0.1,
                                padding: dimensions.width * 0.04,
                                marginBottom: dimensions.height * 0.01,
                            }}
                        >
                            <TouchableOpacity onPress={() => savePlace(item)} style={{ width: '100%', zIndex: 1000, }}>

                                <Image
                                    source={isPlaceSaved(item)
                                        ? require('../assets/icons/heartIcon.png')
                                        : require('../assets/icons/emptyHeartIcon.png')
                                    }
                                    style={{
                                        width: dimensions.width * 0.14,
                                        height: dimensions.width * 0.14,
                                        textAlign: 'center',
                                        position: 'absolute',
                                        top: '7%',
                                        right: '0%',
                                    }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                            <View style={{
                                padding: dimensions.width * 0.02,
                                alignSelf: 'center',
                                width: '100%',
                                position: 'relative',
                            }}>
                                <Image
                                    source={item.image}
                                    style={{
                                        width: dimensions.width * 0.28,
                                        height: dimensions.width * 0.28,
                                        textAlign: 'center',
                                        borderRadius: dimensions.width * 0.5,
                                    }}
                                    resizeMode="stretch"
                                />
                            </View>
                            <Text
                                style={{
                                    fontFamily: fontSFProBold,
                                    fontSize: dimensions.width * 0.05,
                                    color: 'white',
                                    padding: dimensions.width * 0.021,
                                }}
                            >
                                {item.title}
                            </Text>
                            <View style={{
                                flexDirection: 'row',
                                alignSelf: 'flex-start',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: dimensions.width * 0.02,
                                paddingTop: 0,
                            }}>
                                <Image
                                    source={require('../assets/icons/cursorIcon.png')}
                                    style={{
                                        width: dimensions.width * 0.046,
                                        height: dimensions.width * 0.046,
                                        textAlign: 'center',
                                    }}
                                    resizeMode="contain"
                                />
                                <Text
                                    style={{
                                        fontFamily: 'SFPro-Medium',
                                        fontSize: dimensions.width * 0.037,
                                        color: 'white',
                                        opacity: 0.7,
                                        padding: dimensions.width * 0.021,
                                    }}
                                >
                                    {item.address}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}

                </View>
            </ScrollView>
        </View>
    )
}

export default CasinosScreen