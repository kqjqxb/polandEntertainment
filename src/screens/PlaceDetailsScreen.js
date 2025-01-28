import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    ScrollView,
    TextInput,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import commentsData from '../components/commentsData';
import { ChevronLeftIcon } from 'react-native-heroicons/solid';
import MapView, { Marker } from 'react-native-maps';

const fontRobotoBold = 'Roboto-Bold';
const fontRobotoReg = 'Roboto-Regular';

const PlaceDetailsScreen = ({ setSelectedScreenPage, selectedScreenPage, selectedPlace, savedPolandPlaces, setSavedPolandPlaces, selectedCategory, setSelectedCategory }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [randomComments, setRandomComments] = useState([]);
    const [userComment, setUserComment] = useState(null);
    const [averageRating, setAverageRating] = useState(0);

    const handleStarPress = (rate) => {
        setRating(rate);
    };

    const saveUserComment = async () => {
        if (comment.trim() === '') return;

        const newComment = {
            id: selectedPlace.id,
            name: 'You',
            rating: rating.toString(),
            comment: comment,
            profileImage: require('../assets/images/dataImages/reviews/user.png'), // Add a default user image
        };

        try {
            await AsyncStorage.setItem(`comment_${selectedPlace.id}`, JSON.stringify(newComment));
            setUserComment(newComment);
            setComment('');
            setRating(0);
        } catch (error) {
            console.error('Error saving comment:', error);
        }
    };

    useEffect(() => {
        const generateRandomComments = () => {
            const shuffledComments = commentsData.sort(() => 0.5 - Math.random());
            const selectedComments = shuffledComments.slice(0, 3);
            const averageRating = selectedComments.reduce((acc, comment) => acc + parseFloat(comment.rating), 0) / selectedComments.length;
            setRandomComments(selectedComments);
            if (userComment) setAverageRating(((parseFloat(averageRating * 3) + parseFloat(userComment.rating)) / 4).toFixed(1));
            else setAverageRating(averageRating.toFixed(1));
        };

        const loadUserComment = async () => {
            try {
                const savedComment = await AsyncStorage.getItem(`comment_${selectedPlace.id}`);
                if (savedComment) {
                    setUserComment(JSON.parse(savedComment));
                } else {
                    setUserComment(null);
                }
            } catch (error) {
                console.error('Error loading comment:', error);
            }
        };

        generateRandomComments();
        loadUserComment();
    }, [selectedScreenPage, selectedPlace]);

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

    useEffect(() => {
        console.log('image', selectedPlace.image);
    }, [])

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




                <TouchableOpacity onPress={() => savePlace(selectedPlace)} style={{ zIndex: 1000, }}>

                    <Image
                        source={isPlaceSaved(selectedPlace)
                            ? require('../assets/icons/heartIcon.png')
                            : require('../assets/icons/emptyHeartIcon.png')
                        }
                        style={{
                            width: dimensions.width * 0.125,
                            height: dimensions.width * 0.125,
                            textAlign: 'center',
                        }}
                        resizeMode="contain"
                    />
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


                        <Image
                            source={selectedPlace.image}
                            style={{
                                width: dimensions.width,
                                height: dimensions.height * 0.3,
                                textAlign: 'center',
                                borderRadius: dimensions.width * 0.1,
                            }}
                            resizeMode="stretch"
                        />



                    </View>

                    <Text
                        style={{
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.07,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 800,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,


                        }}
                    >
                        {selectedPlace.title}
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
                                fontFamily: fontRobotoBold,
                                fontSize: dimensions.width * 0.046,
                                color: 'white',
                                textAlign: 'left',
                                fontWeight: 700,
                                alignSelf: 'flex-start',
                                paddingHorizontal: dimensions.width * 0.021,
                                paddingVertical: dimensions.height * 0.014,


                            }}
                        >
                            {selectedPlace.address}
                        </Text>
                    </View>


                    <Text
                        style={{
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.046,
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
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.04,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.014,


                        }}
                    >
                        {selectedPlace.description}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.046,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,


                        }}
                    >
                        Place category
                    </Text>

                    <Text
                        style={{
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.04,
                            color: 'white',
                            textAlign: 'left',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingBottom: dimensions.height * 0.014,


                        }}
                    >
                        {selectedCategory}
                    </Text>


                    <Text
                        style={{
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.046,
                            color: '#8f8f8f',
                            textAlign: 'center',
                            fontWeight: 700,
                            alignSelf: 'flex-start',
                            paddingHorizontal: dimensions.width * 0.05,
                            paddingVertical: dimensions.height * 0.014,


                        }}
                    >
                        We on the map
                    </Text>

                    <MapView
                        style={{
                            width: '95%',
                            height: dimensions.height * 0.35,
                            borderRadius: 40,
                            alignSelf: 'center',
                            marginTop: dimensions.height * 0.005,
                            height: dimensions.height * 0.25,
                        }}
                        region={{
                            latitude: selectedPlace.coordinates.latitude,
                            longitude: selectedPlace.coordinates.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >

                        <Marker
                            key={selectedPlace.id}
                            coordinate={selectedPlace.coordinates}
                            title={selectedPlace.title}
                            description={selectedPlace.description}
                            pinColor="#FDB905"
                        />

                    </MapView>

                </View>
            </ScrollView>
        </View>
    );
};

export default PlaceDetailsScreen;
