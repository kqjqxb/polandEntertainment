import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  ScrollView,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRightIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon } from 'react-native-heroicons/solid';
import { is } from 'date-fns/locale';

const fontSFProMedium = 'SFProText-Medium';
const fontSFProSemiBold = 'SFProText-SemiBold';
const fontSFProBold = 'SFProText-Bold';
const fontSFProHeavy = 'SFProText-Heavy';

const FavoritePlaces = ({ setSelectedScreenPage, selectedPlace, setSelectedPlace, savedPolandPlaces, setSavedPolandPlaces }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isTextClosed, setIsTextClosed] = useState(true);


  const isPlaceSaved = (location) => {
    return savedPolandPlaces.some((loc) => loc.id === location.id);
  };


  const handleDeletePolandPlace = async (id) => {
    try {
        const updatedPlaces = savedPolandPlaces.filter(rec => rec.id !== id);
        setSavedPolandPlaces(updatedPlaces);
        await AsyncStorage.setItem('savedPolandPlaces', JSON.stringify(updatedPlaces));
    } catch (error) {
        console.error("Error deleting place:", error);
    }
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
          Favorites
        </Text>
        <View></View>
      </View>

      <ScrollView>
        <View style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: dimensions.height * 0.12,
          marginBottom: dimensions.height * 0.25,
        }}>
          {savedPolandPlaces.length === 0 ? (
            <View style={{
              backgroundColor: '#202020',
              alignSelf: 'center',
              width: dimensions.width * 0.95,
              borderRadius: dimensions.width * 0.07,
              marginBottom: dimensions.height * 0.02,
              alignItems: 'center',
              justifyContent: 'center',
            }}>


              <Image
                source={require('../assets/images/noEntertainmentsImage.png')}
                style={{
                  width: dimensions.width * 0.64,
                  height: dimensions.width * 0.64,
                  textAlign: 'center',
                  marginVertical: dimensions.height * 0.02,
                }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontFamily: fontSFProBold,
                  fontSize: dimensions.width * 0.055,
                  color: 'white',
                  textAlign: 'center',
                  fontWeight: 800,
                  marginTop: dimensions.height * 0.01,
                  alignSelf: 'center',
                  paddingHorizontal: dimensions.width * 0.14,
                  marginBottom: dimensions.height * 0.03,
                }}
              >
                You don't have saved Poland places yet
              </Text>


            </View>
          ) : (
            <View style={{ marginBottom: dimensions.height * 0.05, width: '100%' }}>

              {savedPolandPlaces.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => { setSelectedPlace(item); setSelectedScreenPage('PlaceDetail') }}
                  style={{
                    backgroundColor: '#202020',
                    alignSelf: 'center',
                    width: dimensions.width * 0.95,
                    position: 'relative',
                    borderRadius: dimensions.width * 0.1,
                    padding: dimensions.width * 0.04,
                    marginBottom: dimensions.height * 0.01,
                    zIndex: 500
                  }}
                >
                  <TouchableOpacity onPress={() => { handleDeletePolandPlace(item.id) }} 
                  style={{ width: '100%', zIndex: 1000, }}>

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
          )}

        </View>
      </ScrollView>

    </View>
  );
};

export default FavoritePlaces;
