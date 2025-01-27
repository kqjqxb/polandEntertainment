import React, { useEffect, useMemo, useState } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Share,
    Linking,
    Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { is } from 'date-fns/locale';
import casinosData from '../components/casinosData';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';

const fontSFProBold = 'SFProText-Bold';
const fontSFProHeavy = 'SFProText-Heavy';

const MapScreen = ({ allData, locForRoute, selectedScreenPage, setSelectedScreenPage }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isMapOpened, setIsMapOpened] = useState(false);

    useEffect(() => {
        console.log('MapScreen.js: allData:', allData);
    }, [selectedScreenPage])

    return (
        <SafeAreaView style={{ width: '100%', marginTop: '3%' }}>
            <View style={{
                zIndex: 50,
                // position: 'absolute',
                // top: '-3%',
                alignSelf: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '90%',
                marginTop: -dimensions.height * 0.01,
            }}>
                <TouchableOpacity
                    onPress={() => {
                        setSelectedScreenPage('Home');
                    }}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        padding: dimensions.width * 0.04,
                    }}>
                    <ChevronLeftIcon size={dimensions.width * 0.05} color='black' />
                </TouchableOpacity>
                <Text
                    style={{
                        fontFamily: fontSFProHeavy,
                        textAlign: "left",
                        fontSize: dimensions.width * 0.064,
                        alignSelf: 'center',
                        fontWeight: 800,
                        color: 'white',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '14%'

                    }}
                >
                    Map
                </Text>
                <View></View>
            </View>
            <MapView
                style={{
                    width: '95%',
                    height: dimensions.height * 0.35,
                    borderRadius: 40,
                    alignSelf: 'center',
                    marginTop: dimensions.height * 0.01,
                    height: dimensions.height * 0.7,
                }}
                region={{
                    latitude: 50.32610323286961,
                    longitude: 19.008192701538068,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >

                {allData.map((location, index) => (
                    <Marker
                        key={index}
                        coordinate={location.coordinates}
                        title={location.title}
                        description={location.description}
                        pinColor="#DA553E"
                    />
                ))}


                {casinosData.map((location, index) => (
                    <Marker
                        key={index}
                        coordinate={location.coordinates}
                        title={location.title}
                        description={location.description}
                        pinColor="#FDB905"
                    />
                ))}
            </MapView>

        </SafeAreaView>
    );
};

export default MapScreen;
