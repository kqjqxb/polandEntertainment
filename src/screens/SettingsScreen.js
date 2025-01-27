import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from 'react-native-heroicons/solid';
import { is } from 'date-fns/locale';

const fontRobotoBold = 'Roboto-Bold';
const fontRobotoReg = 'Roboto-Regular';

const SettingsScreen = ({ setSelectedScreenPage }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isTextClosed, setIsTextClosed] = useState(true);
  const [textType, setTextType] = useState('privacy');

  const shareApp = async () => {
    try {
      await Share.share({
        message: `Join Poland Entertainments to find new places!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
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
      <TouchableOpacity
        onPress={() => {
          if (!isTextClosed) {
            setIsTextClosed(true);
          } else setSelectedScreenPage('Home');
        }}
        style={{
          position: 'absolute',
          top: '4%',
          left: '5%',
          backgroundColor: 'white',
          borderRadius: dimensions.width * 0.5,
          zIndex: 100,
          padding: dimensions.width * 0.04,
        }}>
        <ChevronLeftIcon size={dimensions.width * 0.05} color='black' />
      </TouchableOpacity>
      <View style={{
        backgroundColor: '#DA553E',
        alignSelf: 'center',
        width: '100%',
        borderRadius: dimensions.width * 0.07,
        marginBottom: dimensions.height * 0.02,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: -dimensions.height * 0.1,
      }}>

        <Text
          style={{
            fontFamily: fontRobotoBold,
            fontSize: dimensions.width * 0.064,
            color: 'white',
            textAlign: 'center',
            fontWeight: 800,
            marginTop: dimensions.height * 0.05,
            alignSelf: 'center',
            paddingHorizontal: dimensions.width * 0.14,

          }}
        >
          Settings
        </Text>

        <Image
          source={require('../assets/images/settingsImage.png')}
          style={{
            width: dimensions.width * 0.61,
            height: dimensions.width * 0.61,
            textAlign: 'center',
            marginBottom: dimensions.height * 0.02,
          }}
          resizeMode="contain"
        />



      </View>

      {isTextClosed ? (
        <View style={{
          width: '100%',
          alignSelf: 'center',
          alignItems: 'center',
        }}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.termsfeed.com/live/7b32ef67-bd9b-40a8-aa40-4a41e3b4e5df')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              padding: dimensions.width * 0.03,
              backgroundColor: '#202020',
              borderRadius: dimensions.width * 0.1,
              width: '95%',
              marginBottom: dimensions.height * 0.01,
            }}>
            <Text
              style={{
                fontFamily: fontRobotoBold,
                fontSize: dimensions.width * 0.046,
                color: 'white',
                textAlign: 'center',
                fontWeight: 800,
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.05,

              }}
            >
              Privacy Policy
            </Text>


            <View style={{
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.5,
              zIndex: 100,
              padding: dimensions.width * 0.04,
            }}>
              <ChevronRightIcon size={dimensions.width * 0.05} color='black' />
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.termsfeed.com/live/7b32ef67-bd9b-40a8-aa40-4a41e3b4e5df')}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              padding: dimensions.width * 0.03,
              backgroundColor: '#202020',
              borderRadius: dimensions.width * 0.1,
              width: '95%',
              marginBottom: dimensions.height * 0.01,
            }}>
            <Text
              style={{
                fontFamily: fontRobotoBold,
                fontSize: dimensions.width * 0.046,
                color: 'white',
                textAlign: 'center',
                fontWeight: 800,
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.05,

              }}
            >
              Terms of Use
            </Text>


            <View style={{
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.5,
              zIndex: 100,
              padding: dimensions.width * 0.04,
            }}>
              <ChevronRightIcon size={dimensions.width * 0.05} color='black' />
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            onPress={shareApp}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',

              padding: dimensions.width * 0.03,
              backgroundColor: '#202020',
              borderRadius: dimensions.width * 0.1,
              width: '95%',
              marginBottom: dimensions.height * 0.01,
            }}>
            <Text
              style={{
                fontFamily: fontRobotoBold,
                fontSize: dimensions.width * 0.046,
                color: 'white',
                textAlign: 'center',
                fontWeight: 800,
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.05,

              }}
            >
              Share App
            </Text>


            <View style={{
              backgroundColor: 'white',
              borderRadius: dimensions.width * 0.5,
              zIndex: 100,
              padding: dimensions.width * 0.04,
            }}>
              <ChevronRightIcon size={dimensions.width * 0.05} color='black' />
            </View>
          </TouchableOpacity>

        </View>
      ) : (
        <View style={{
          width: '100%',
          alignSelf: 'center',
          alignItems: 'center',


          padding: dimensions.width * 0.03,
          paddingVertical: dimensions.width * 0.05,
          backgroundColor: '#202020',
          borderRadius: dimensions.width * 0.1,
          width: '95%',
        }}>
          <Text
            style={{
              fontFamily: fontRobotoBold,
              fontSize: dimensions.width * 0.039,
              color: 'white',
              textAlign: 'left',
              fontWeight: 700,
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.037,
              marginBottom: dimensions.height * 0.02,

            }}
          >
            Welcome to Poland Entertainments! By using our application, you agree to the following terms and conditions:
          </Text>

          <Text
            style={{
              fontFamily: fontRobotoBold,
              fontSize: dimensions.width * 0.037,
              color: 'white',
              textAlign: 'justify',
              fontWeight: 500,
              alignSelf: 'center',
              paddingHorizontal: dimensions.width * 0.05,

            }}
          >
            {textType === 'privacy'
              ? "Privacy Policy: \nWe respect your privacy and are committed to protecting your personal information. We value your privacy and are committed to protecting your personal data. By using Poland Entertainments, you agree to the collection, use, and storage of your data"
              : "User Conduct: \nYou agree to use the app responsibly and in accordance with applicable laws and regulations. Any form of misuse, including the distribution of offensive content or unauthorized access, is strictly prohibited."}
          </Text>

        </View>
      )}



    </View>
  );
};

export default SettingsScreen;
