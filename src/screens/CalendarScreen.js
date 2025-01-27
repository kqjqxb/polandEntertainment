import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';


const fontSFProBold = 'SFProText-Bold';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatDate2 = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  const date = new Date(dateString).toLocaleDateString('en-US', options);
  return date.replace(/(\d{1,2}) (\w+), (\d{4})/, '($1) $2, $3');
};

const formatHeaderDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const CalendarScreen = ({ selectedScreenPage }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [entertainments, setEntertainments] = useState([]);
  const [today, setToday] = useState(formatDate(new Date()));
  const navigation = useNavigation();

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
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToday = formatDate(new Date());
      if (currentToday !== today) {
        setToday(currentToday);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [today]);

  const entertainmentDates = useMemo(() => {
    return entertainments
      .filter((entertainment) => entertainment.date)
      .map((entertainment) => formatDate(new Date(entertainment.date)));
  }, [entertainments]);

  const uniqueEntertainmentDates = useMemo(() => {
    return [...new Set(entertainmentDates)];
  }, [entertainmentDates]);

  const markedDates = useMemo(() => {
    const marks = {
      [today]: {
        selected: selectedDate === today,
        selectedColor: '#DA553E',
        textColor: 'white',
      },
    };

    uniqueEntertainmentDates.forEach((date) => {
      if (date === today) return;
      marks[date] = {
        marked: true,
        dotColor: '#DA553E',
        textColor: 'white',
      };
    });

    if (selectedDate && selectedDate !== today) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#DA553E',
        textColor: 'white',
      };
    }

    return marks;
  }, [uniqueEntertainmentDates, today, selectedDate]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const entertainmentsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return entertainments.filter((entertainment) => {
      return formatDate(new Date(entertainment.date)) === selectedDate;
    });
  }, [entertainments, selectedDate]);

  return (
    <SafeAreaView style={{
      width: dimensions.width,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
    }} >
      <View style={{ width: '100%', flex: 1, paddingHorizontal: 4 }}>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            marginBottom: dimensions.height * 0.01,
          }}
        >
          <View style={{
            width: '90%',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            alignSelf: 'center',
            paddingBottom: dimensions.width * 0.04,
            paddingTop: dimensions.width * 0.023,
          }}  >
            <Text
              style={{
                fontFamily: fontSFProBold,
                fontSize: dimensions.width * 0.057,
                color: 'white',
                textAlign: 'center',
              }}
            >
              Calendar
            </Text>
            <Text
              style={{
                fontFamily: fontSFProBold,
                fontSize: dimensions.width * 0.057,
                color: '#DA553E',
                textAlign: 'center',
              }}
            >
              Events
            </Text>
          </View>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: dimensions.height * 0.25 }}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: 'white',
                selectedDayBackgroundColor: '#DA553E',
                selectedDayTextColor: 'black',
                todayTextColor: '#DA553E',
                dayTextColor: 'white',
                textDisabledColor: '#d9e1e8',
                dotColor: '#DA553E',
                selectedDotColor: '#DA553E',
                arrowColor: 'white',
                monthTextColor: 'white',
                indicatorColor: '#DA553E',
                textDayFontFamily: 'SFPro-Bold',
                textMonthFontFamily: 'SFPro-Medium',
                textDayHeaderFontFamily: 'SFPro-Medium',
                textDayFontSize: dimensions.width * 0.037,
                textMonthFontSize: dimensions.width * 0.037,
                textDayHeaderFontSize: dimensions.width * 0.037,
              }}
              renderHeader={(date) => {
                return (
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <Text
                      style={{
                        fontFamily: fontSFProBold,
                        fontSize: dimensions.width * 0.046,
                        color: '#DA553E',
                        textAlign: 'center',
                      }}
                    >{formatHeaderDate(date)}</Text>
                  </View>
                );
              }}
              style={{
                borderWidth: 0,
                width: dimensions.width * 0.9,
                alignSelf: 'center',
                borderRadius: dimensions.width * 0.1,
                backgroundColor: '#202020',
                paddingBottom: dimensions.height * 0.019,
                paddingTop: dimensions.width * 0.01,
                marginHorizontal: -dimensions.width * 0.04
              }}
            />
            {selectedDate && (
              <Text
                style={{
                  fontFamily: fontSFProBold,
                  fontSize: dimensions.width * 0.055,
                  color: '#DA553E',
                  textAlign: 'center',
                  fontWeight: 800,
                  marginTop: dimensions.height * 0.01,
                  marginBottom: dimensions.height * 0.007,
                  alignSelf: 'flex-start',
                  paddingHorizontal: dimensions.width * 0.04,
                }}
              >
                {formatDate2(selectedDate)}
              </Text>
            )}
            {entertainmentsForSelectedDate.length === 0 ? (
              <View style={{
                backgroundColor: '#202020',
                alignSelf: 'center',
                width: '93%',
                borderRadius: dimensions.width * 0.07,
                marginBottom: dimensions.height * 0.02,
              }}>
                <View style={{
                  alignSelf: 'center',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Image
                    source={require('../assets/images/stopImage.png')}
                    style={{
                      width: dimensions.width * 0.21,
                      height: dimensions.width * 0.21,
                      textAlign: 'center',
                      marginVertical: dimensions.height * 0.02,
                    }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      fontFamily: fontSFProBold,
                      fontSize: dimensions.width * 0.04,
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 600,
                      marginTop: dimensions.height * 0.01,
                      alignSelf: 'center',
                      paddingHorizontal: dimensions.width * 0.14,
                      marginBottom: dimensions.height * 0.02,
                    }}
                  >
                    You don't have any events on this day yet
                  </Text>
                </View>
              </View>
            ) : (
              entertainmentsForSelectedDate.map((entertainment, index) => (
                <View key={index} style={{
                  backgroundColor: '#202020',
                  alignSelf: 'center',
                  width: '93%',
                  borderRadius: dimensions.width * 0.07,
                  marginBottom: dimensions.height * 0.02,
                }}>
                  <View style={{
                    alignSelf: 'center',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: dimensions.width * 0.04,
                  }}>
                    <Text
                      style={{
                        fontFamily: fontSFProBold,
                        fontSize: dimensions.width * 0.043,
                        color: 'white',
                        textAlign: 'center',
                        fontWeight: 700,
                        marginTop: dimensions.height * 0.01,
                        alignSelf: 'flex-start',
                        paddingHorizontal: dimensions.width * 0.07,
                        marginBottom: dimensions.height * 0.005,
                      }}
                    >
                      {entertainment.title}
                    </Text>
                    <View style={{
                      flexDirection: 'row',
                      alignSelf: 'flex-start',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingHorizontal: dimensions.width * 0.07,
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
                          fontSize: dimensions.width * 0.034,
                          color: 'white',
                          fontWeight: 700,
                          padding: dimensions.width * 0.021,
                        }}
                      >
                        {entertainment.address}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
