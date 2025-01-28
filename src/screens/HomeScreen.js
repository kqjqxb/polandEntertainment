import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,

} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import CalendarScreen from './CalendarScreen';
import SettingsScreen from './SettingsScreen';
import AddEntertainmentScreen from './AddEntertainmentScreen';
import EntertainmentDetailsScreen from './EntertainmentDetailsScreen';
import Swipeable from 'react-native-gesture-handler/Swipeable';


import restaurantsData from '../components/restaurantsData';
import amusementParksData from '../components/amusementParksData';
import barsData from '../components/barsData';
import casinosData from '../components/casinosData';
import museumsData from '../components/museumsData';
import nightClubsData from '../components/nightClubsData';
import PlaceDetailsScreen from './PlaceDetailsScreen';
import CasinosScreen from './CasinosScreen';
import MapScreen from './MapScreen';
import FavoritePlaces from './FavoritePlaces';



const fontRobotoBold = 'Roboto-Bold';
const fontRobotoReg = 'Roboto-Regular';
const fontSFProBold = 'SFProText-Bold';
const fontSFProHeavy = 'SFProText-Heavy';


const allData = [
  ...amusementParksData,
  ...barsData,

  ...museumsData,
  ...nightClubsData,
  ...restaurantsData,
];


const HomeScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreenPage, setSelectedScreenPage] = useState('Home');

  const [selectedCategory, setSelectedCategory] = useState('My');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [selectedEntertainment, setSelectedEntertainment] = useState(null);
  const [entertainments, setEntertainments] = useState([]);


  useEffect(()=>{
    console.log('HomeScreen.js: entertainments:', entertainments);
}, [])

  const [savedPolandPlaces, setSavedPolandPlaces] = useState([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [selectedCategory]);


  useEffect(() => {
    const loadEntertainments = async () => {
      try {
        const storedEntertainments = await AsyncStorage.getItem('Entertainments');
        if (storedEntertainments) {
          setEntertainments(JSON.parse(storedEntertainments));
        }
      } catch (error) {
        console.error('Error loading entertainments:', error);
      }
    };

    loadEntertainments();
  }, [selectedScreenPage]);


  useEffect(() => {
    const fetchSavedPlaces = async () => {
      try {
        const locWhichSaved = await AsyncStorage.getItem('savedPolandPlaces');
        setSavedPolandPlaces(locWhichSaved ? JSON.parse(locWhichSaved) : []);
      } catch (error) {
        console.error('error downloading placesInfo:', error);
      }
    };

    fetchSavedPlaces();
  }, [selectedScreenPage]);


  const isPlaceSaved = (location) => {
    return savedPolandPlaces.some((loc) => loc.id === location.id);
  };
  
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



  const getDataByCategory = (category) => {
    switch (category) {
      case 'Restaurants':
        return restaurantsData;
      case 'Bars':
        return barsData;
      case 'Nightclubs':
        return nightClubsData;
      case 'Museums':
        return museumsData;
      case 'Amusement Parks':
        return amusementParksData;
      case 'Casino':
        return casinosData;
      default:
        return [];
    }
  };

  const data = getDataByCategory(selectedCategory);

  const handleDelete = async (id) => {
    const updatedEntertainments = entertainments.filter(item => item.id !== id);
    setEntertainments(updatedEntertainments);
    await AsyncStorage.setItem('Entertainments', JSON.stringify(updatedEntertainments));
  };

  const renderRightActions = (item) => (
    <TouchableOpacity
      onPress={() => handleDelete(item.id)}
      style={{
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        width: 70,
        height: '100%',
      }}
    >
      <Image
        source={require('../assets/icons/trashIcon.png')}
        style={{
          width: 30,
          height: 30,
        }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setEntertainments((prevEntertainments) => [...prevEntertainments]);
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

  const currentDateTime = new Date();
  const endOfDay = new Date(currentDateTime);
  endOfDay.setHours(23, 59, 59, 999);

  const upcomingEntertainments = entertainments.filter((item) => {
    const eventDateTime = new Date(item.date);
    return eventDateTime >= currentDateTime || (eventDateTime >= currentDateTime.setHours(0, 0, 0, 0) && eventDateTime <= endOfDay);
  });

  useEffect(() => {
    console.log('HomeScreen.js: upcomingEntertainments:', upcomingEntertainments);
  }, [upcomingEntertainments])

  return (

    <SafeAreaView style={{
      alignItems: 'center',
      width: dimensions.width,
      position: 'relative',
      flex: 1,
      justifyContent: 'flex-start',
      backgroundColor: '#020202',
      width: '100%',

    }} >

      {selectedScreenPage === 'Home' ? (
        <View style={{ width: '95%', flex: 1, paddingHorizontal: 4, justifyContent: 'flex-start' }}>
          <View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: dimensions.height * 0.016,

            }}>
              <Text
                style={{
                  fontFamily: fontSFProHeavy,
                  textAlign: "left",
                  fontSize: dimensions.width * 0.064,
                  alignSelf: 'center',
                  fontWeight: 800,
                  color: 'white',
                  paddingBottom: 8,
                  alignItems: 'center',
                  justifyContent: 'center',

                }}
              >
                Entertainment
              </Text>


              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedScreenPage('Map');
                  }}

                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: dimensions.width * 0.02,
                  }}>

                  <Image
                    source={require('../assets/icons/mapIcon.png')}
                    style={{
                      width: dimensions.width * 0.14,
                      height: dimensions.width * 0.14,

                      top: '0%',
                      textAlign: 'center'
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>



                <TouchableOpacity
                  onPress={() => {
                    setSelectedScreenPage('FavoritePlaces');
                  }}

                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>

                  <Image
                    source={require('../assets/icons/heartIcon.png')}
                    style={{
                      width: dimensions.width * 0.14,
                      height: dimensions.width * 0.14,

                      top: '0%',
                      textAlign: 'center'
                    }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>

              </View>
            </View>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                width: '100%',
                alignSelf: 'center',
                paddingBottom: dimensions.height * 0.01,
              }}
            >
              <View style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
                {['My', 'Restaurants', 'Bars', 'Nightclubs', 'Casino', 'Museums', 'Amusement Parks' ].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={{
                      paddingHorizontal: dimensions.width * 0.08,
                      borderRadius: dimensions.width * 0.1,

                      backgroundColor: selectedCategory === `${category}` ? '#DA553E' : '#202020',
                      marginRight: dimensions.width * 0.02,
                    }}
                    onPress={() => {
                      setSelectedCategory(`${category}`);
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: fontRobotoBold,
                        fontSize: dimensions.width * 0.04,
                        color: 'white',
                        paddingVertical: dimensions.width * 0.04,
                      }}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>




          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            style={{
              marginTop: dimensions.height * 0.021,
            }}
          >
            {selectedCategory !== 'My' ? (
              <View style={{ marginBottom: dimensions.height * 0.25 }}>

                {data.map((item, index) => (
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
                      zIndex: 500
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

            ) : (
              <View style={{
                marginBottom: dimensions.height * 0.25,
              }}>

                {upcomingEntertainments.length === 0 ? (

                  <View style={{
                    backgroundColor: '#202020',
                    alignSelf: 'center',
                    width: '100%',
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
                        fontFamily: fontRobotoBold,
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
                      You don't have any entertainment created yet
                    </Text>


                  </View>
                ) : (
                  <View style={{ marginBottom: dimensions.height * 0.05 }}>

                    {upcomingEntertainments.map((item, index) => (
                      <Swipeable
                        key={index}
                        renderRightActions={() => renderRightActions(item)}
                      >
                        <TouchableOpacity
                          key={index}
                          onPress={() => { setSelectedEntertainment(item); setSelectedScreenPage('EntertainmentDetails') }}
                          style={{
                            backgroundColor: '#202020',
                            alignSelf: 'center',
                            width: '100%',
                            position: 'relative',
                            borderRadius: dimensions.width * 0.1,
                            padding: dimensions.width * 0.04,
                            marginBottom: dimensions.height * 0.01,
                            zIndex: 500
                          }}
                        >
                          <View style={{
                            padding: dimensions.width * 0.02,
                            alignSelf: 'center',
                            width: '100%',
                            position: 'relative',
                          }}>
                            {item.images.length > 0 ? (
                              <Image
                                source={{ uri: item.images[0] }}
                                style={{
                                  width: dimensions.width * 0.28,
                                  height: dimensions.width * 0.28,
                                  textAlign: 'center',
                                  borderRadius: dimensions.width * 0.5,
                                }}
                                resizeMode="stretch"
                              />
                            ) : (
                              <View style={{
                                alignItems: 'center',
                                alignSelf: 'flex-start',
                                padding: dimensions.width * 0.14,
                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: dimensions.width * 0.5,

                                marginBottom: dimensions.height * 0.01,
                              }}>

                                <Image
                                  source={require('../assets/icons/emptyImageIcon.png')}
                                  style={{
                                    width: dimensions.width * 0.05,
                                    height: dimensions.width * 0.05,
                                    textAlign: 'center',
                                    opacity: 0.7,

                                  }}
                                  resizeMode="contain"
                                />
                              </View>
                            )}

                          </View>
                          <Text
                            style={{
                              fontFamily: fontSFProBold,
                              fontSize: dimensions.width * 0.05,
                              color: 'white',
                              padding: dimensions.width * 0.021,
                            }}
                          >
                            {item.title ? item.title : 'No title'}
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
                              {item.address ? item.address : 'No address'}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </Swipeable>
                    ))}
                  </View>
                )}
              </View>

            )}



          </ScrollView>

          <View style={{ position: 'absolute', bottom: '14%', left: '50%', backgroundColor: '#3179AC' }}>

          </View>
        </View>

      ) : selectedScreenPage === 'Settings' ? (
        <SettingsScreen setSelectedScreenPage={setSelectedScreenPage}
        />
      ) : selectedScreenPage === 'Calendar' ? (
        <CalendarScreen selectedScreenPage={selectedScreenPage} />
      ) : selectedScreenPage === 'Casinos' ? (
        <CasinosScreen setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} setSelectedPlace={setSelectedPlace} savedPolandPlaces={savedPolandPlaces} setSavedPolandPlaces={setSavedPolandPlaces} />
      ) : selectedScreenPage === 'AddEntertainment' ? (
        <AddEntertainmentScreen setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} />
      ) : selectedScreenPage === 'EntertainmentDetails' ? (
        <EntertainmentDetailsScreen setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} selectedEntertainment={selectedEntertainment}
          entertainments={entertainments} setEntertainments={setEntertainments}
        />
      ) : selectedScreenPage === 'PlaceDetail' ? (
        <PlaceDetailsScreen setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} selectedPlace={selectedPlace} savedPolandPlaces={savedPolandPlaces} 
          setSavedPolandPlaces={setSavedPolandPlaces} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}/>
      ) : selectedScreenPage === 'Map' ? (
        <MapScreen setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} selectedPlace={selectedPlace} allData={allData}/>
      ) : selectedScreenPage === 'FavoritePlaces' ? (
        <FavoritePlaces setSelectedScreenPage={setSelectedScreenPage} selectedScreenPage={selectedScreenPage} selectedPlace={selectedPlace}
          savedPolandPlaces={savedPolandPlaces} setSavedPolandPlaces={setSavedPolandPlaces} setSelectedPlace={setSelectedPlace}
        />
      ) : null}

      {selectedScreenPage !== 'Settings'
        && selectedScreenPage !== 'AddEntertainment'
        && selectedScreenPage !== 'EntertainmentDetails'
        && selectedScreenPage !== 'PlaceDetail'
        && selectedScreenPage !== 'Casinos'
        && selectedScreenPage !== 'Map'
        && selectedScreenPage !== 'FavoritePlaces'
        && (

          <TouchableOpacity
            onPress={() => { setSelectedScreenPage('AddEntertainment') }}

            style={{
              width: '95%',
              backgroundColor: '#DA553E',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignSelf: 'center',
              borderRadius: dimensions.width * 0.09,
              marginVertical: dimensions.height * 0.01,
              alignItems: 'center',
              paddingHorizontal: dimensions.width * 0.01,
              position: 'absolute',
              bottom: '16%'
            }}>
            <View>

            </View>
            <Text
              style={{
                textAlign: "center",
                fontSize: dimensions.width * 0.044,
                padding: dimensions.width * 0.01,
                fontFamily: fontRobotoReg,
                fontWeight: 500,
                color: 'white',
                marginRight: dimensions.width * 0.02,
                paddingVertical: dimensions.height * 0.025,
                marginLeft: dimensions.width * 0.16,
              }}
            >
              Add
            </Text>

            <View style={{
              padding: dimensions.width * 0.04,
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.5,
              marginLeft: dimensions.width * 0.01,
            }}>

              <Image
                source={require('../assets/icons/plusIcon.png')}
                style={{
                  width: dimensions.width * 0.04,
                  height: dimensions.width * 0.04,

                }}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity>
        )}



      <View
        style={{
          position: 'absolute',
          bottom: 0,
          backgroundColor: '#202020',
          width: '100%',
          paddingHorizontal: dimensions.width * 0.1,
          borderTopLeftRadius: dimensions.width * 0.1,
          borderTopRightRadius: dimensions.width * 0.1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          paddingBottom: dimensions.height * 0.05,
          paddingTop: dimensions.height * 0.02,
          zIndex: 1000,

        }}
      >

        <TouchableOpacity
          onPress={() => setSelectedScreenPage('Home')}
          style={{
            borderRadius: '50%',
            paddingVertical: dimensions.width * 0.03,
            paddingHorizontal: dimensions.width * 0.0,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Image
            source={selectedScreenPage === 'Home' ? require('../assets/icons/selctedButtonIcons/selectedEntertainmentsIcon.png') : require('../assets/icons/buttonIcons/entertainmentsIcon.png')}
            style={{
              width: dimensions.width * 0.061,
              height: dimensions.width * 0.061,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />
          {selectedScreenPage === 'Home' && (
            <Text
              style={{
                fontFamily: fontSFProBold,
                textAlign: "left",
                fontSize: dimensions.width * 0.037,
                alignSelf: 'center',
                fontWeight: 800,
                color: '#DA553E',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: dimensions.width * 0.02,
              }}
            >
              Entertainments
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSelectedScreenPage('Calendar')}
          style={{
            borderRadius: '50%',
            paddingVertical: dimensions.width * 0.03,
            paddingHorizontal: dimensions.width * 0.0,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 5,
          }}
        >
          <Image
            source={selectedScreenPage === 'Calendar' ? require('../assets/icons/selctedButtonIcons/selectedCalendarIcon.png') : require('../assets/icons/buttonIcons/calendarIcon.png')}
            style={{
              width: dimensions.width * 0.061,
              height: dimensions.width * 0.061,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />


          {selectedScreenPage === 'Calendar' && (
            <Text
              style={{
                fontFamily: fontSFProBold,
                textAlign: "left",
                fontSize: dimensions.width * 0.037,
                alignSelf: 'center',
                fontWeight: 800,
                color: '#DA553E',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: dimensions.width * 0.02,
              }}
            >
              Calendar
            </Text>
          )}
        </TouchableOpacity>



        <TouchableOpacity
          onPress={() => setSelectedScreenPage('Casinos')}
          style={{
            alignItems: 'center',
            borderRadius: '50%',
            paddingVertical: dimensions.width * 0.03,
            paddingHorizontal: dimensions.width * 0.0,
            marginHorizontal: 5,
            flexDirection: 'row',
          }}
        >
          <Image
            source={selectedScreenPage === 'Casinos' ? require('../assets/icons/selctedButtonIcons/selectedCasinosIcon.png') : require('../assets/icons/buttonIcons/casinosIcon.png')}
            style={{
              width: dimensions.width * 0.061,
              height: dimensions.width * 0.061,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />


          {selectedScreenPage === 'Casinos' && (
            <Text
              style={{
                fontFamily: fontSFProBold,
                textAlign: "left",
                fontSize: dimensions.width * 0.037,
                alignSelf: 'center',
                fontWeight: 800,
                color: '#DA553E',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: dimensions.width * 0.02,
              }}
            >
              Casino
            </Text>
          )}
        </TouchableOpacity>


        <TouchableOpacity
          onPress={() => setSelectedScreenPage('Settings')}
          style={{
            alignItems: 'center',
            paddingVertical: dimensions.width * 0.03,
            paddingHorizontal: dimensions.width * 0.0,
            borderRadius: '50%',
            marginRight: 5,
            flexDirection: 'row',
          }}
        >
          <Image
            source={selectedScreenPage === 'Settings' ? require('../assets/icons/selctedButtonIcons/selectedSettingsIcon.png') : require('../assets/icons/buttonIcons/settingsIcon.png')}
            style={{
              width: dimensions.width * 0.061,
              height: dimensions.width * 0.061,
              textAlign: 'center'
            }}
            resizeMode="contain"
          />


          {selectedScreenPage === 'Settings' && (
            <Text
              style={{
                fontFamily: fontSFProBold,
                textAlign: "left",
                fontSize: dimensions.width * 0.037,
                alignSelf: 'center',
                fontWeight: 800,
                color: '#DA553E',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: dimensions.width * 0.02,
              }}
            >
              Settings
            </Text>
          )}
        </TouchableOpacity>
      </View>




    </SafeAreaView>
  );
};

export default HomeScreen;
