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
    TextInput,
    Modal,
    TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChevronLeftIcon, CheckIcon, PlusIcon } from 'react-native-heroicons/solid';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'react-native-image-picker';

const fontRobotoBold = 'Roboto-Bold';

const AddEntertainmentScreen = ({ setSelectedScreenPage, entertainments, setEntertainments }) => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'));
    const [isTextClosed, setIsTextClosed] = useState(true);
    const [title, setTitle] = useState('');
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [images, setImages] = useState([]);
    const [ticketLink, setTicketLink] = useState('');


    const handleImagePicker = () => {
        if (images.length >= 3) {
            Alert.alert('You can only add up to 3 images.');
            return;
        }
        ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                setImages([...images, response.assets[0].uri]);
            }
        });
    };

    const handleSave = async () => {
        const entertainments = JSON.parse(await AsyncStorage.getItem('Entertainments')) || [];
        const newId = entertainments.length > 0 ? Math.max(...entertainments.map(e => e.id)) + 1 : 1;
        const newEntertainment = {
            id: newId,
            title: title ? title : 'Untitled',
            address: address ? address : 'No address',
            description: description ? description : 'No description',
            date: date ? date.toISOString() : null,
            time: time ? time.toISOString() : null,
            images,
            ticketLink: ticketLink ? ticketLink : 'No ticket link',
        };
        try {
            entertainments.unshift(newEntertainment);
            await AsyncStorage.setItem('Entertainments', JSON.stringify(entertainments));
            setSelectedScreenPage('Home');
        } catch (error) {
            console.error('Error saving entertainment:', error);
        }
    };

    const handleDateChange = (event, selectedDate) => {
        if (selectedDate && selectedDate >= new Date().setHours(0, 0, 0, 0)) {
            setDate(selectedDate);
        } else {
            Alert.alert('Please select a future date.');
        }
    };

    const handleTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            const currentTime = new Date();
            if (date && date.toDateString() === currentTime.toDateString()) {
                if (selectedTime < currentTime) {
                    selectedTime.setHours(currentTime.getHours());
                    selectedTime.setMinutes(currentTime.getMinutes());
                }
            }
            setTime(selectedTime);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Date';
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const formatTime = (time) => {
        if (!time) return 'Time';
        return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };


    const handleDeleteImage = (index) => {
        Alert.alert(
            "Delete Image",
            "Are you sure you want to delete this image?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        const newImages = [...images];
                        newImages.splice(index, 1);
                        setImages(newImages);
                    },
                    style: "destructive"
                }
            ]
        );
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
                    disabled={!title || !address || !date || !time}
                    onPress={handleSave}
                    style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.5,
                        zIndex: 100,
                        padding: dimensions.width * 0.04,
                        opacity: !title || !address || !date || !time ? 0.7 : 1,
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
                        backgroundColor: '#DA553E',
                        alignSelf: 'center',
                        width: '100%',
                        borderRadius: dimensions.width * 0.07,
                        marginBottom: dimensions.height * 0.02,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: '8%',
                    }}>
                        <Text
                            style={{
                                fontFamily: fontRobotoBold,
                                fontSize: dimensions.width * 0.064,
                                color: 'white',
                                textAlign: 'center',
                                fontWeight: 800,

                                alignSelf: 'center',


                            }}
                        >
                            Add entertainment
                        </Text>

                        <Image
                            source={require('../assets/images/noEntertainmentsImage.png')}
                            style={{
                                width: dimensions.width * 0.43,
                                height: dimensions.width * 0.43,
                                textAlign: 'center',
                                marginBottom: dimensions.height * 0.02,
                            }}
                            resizeMode="contain"
                        />

                    </View>

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
                            {images.length === 0 && (
                                <TouchableOpacity
                                    onPress={handleImagePicker}
                                    style={{
                                        alignItems: 'center',
                                        alignSelf: 'flex-start',
                                        padding: dimensions.width * 0.14,
                                        backgroundColor: '#202020',
                                        borderRadius: dimensions.width * 0.064,

                                        marginBottom: dimensions.height * 0.01,
                                    }}>
                                    <View>

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
                                </TouchableOpacity>
                            )}
                            {images.map((image, index) => (
                                <TouchableOpacity key={index} onPress={() => handleDeleteImage(index)}>
                                    <Image
                                        source={{ uri: image }}
                                        style={{
                                            width: dimensions.width * 0.3,
                                            height: dimensions.width * 0.3,
                                            marginRight: dimensions.width * 0.03,
                                            borderRadius: dimensions.width * 0.04,
                                        }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                            {images.length < 3 && (
                                <TouchableOpacity
                                    onPress={handleImagePicker}
                                    style={{
                                        padding: dimensions.width * 0.03,
                                        backgroundColor: '#DA553E',
                                        borderRadius: dimensions.width * 0.04,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginLeft: dimensions.width * 0.03,
                                    }}>
                                    <PlusIcon size={dimensions.width * 0.07} color='black' />
                                </TouchableOpacity>
                            )}
                        </View>
                    </ScrollView>

                    <TextInput
                        placeholder="Name"
                        value={title}
                        onChangeText={setTitle}
                        placeholderTextColor="#8f8f8f"
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: dimensions.width * 0.03,
                            backgroundColor: '#202020',
                            borderRadius: dimensions.width * 0.1,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                            color: 'white',
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.046,
                            fontWeight: 800,
                            textAlign: 'center',
                        }}
                    />

                    <TextInput
                        placeholder="Address"
                        value={address}
                        onChangeText={setAddress}
                        placeholderTextColor="#8f8f8f"
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: dimensions.width * 0.03,
                            backgroundColor: '#202020',
                            borderRadius: dimensions.width * 0.1,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                            color: 'white',
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.046,
                            fontWeight: 800,
                            textAlign: 'center',
                        }}
                    />

                    <TextInput
                        placeholder="Description"
                        value={description}
                        onChangeText={setDescription}
                        placeholderTextColor="#8f8f8f"
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: dimensions.width * 0.03,
                            backgroundColor: '#202020',
                            borderRadius: dimensions.width * 0.1,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                            color: 'white',
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.046,
                            fontWeight: 800,
                            textAlign: 'center',
                        }}
                    />

                    <TouchableOpacity
                        onPress={() => setShowDatePicker(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: dimensions.width * 0.03,
                            backgroundColor: '#202020',
                            borderRadius: dimensions.width * 0.1,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                        }}>
                        <Image
                            source={require('../assets/icons/calendarIcon.png')}
                            style={{
                                width: dimensions.width * 0.05,
                                height: dimensions.width * 0.05,
                                textAlign: 'center',
                                marginLeft: dimensions.width * 0.03,
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontFamily: fontRobotoBold,
                                fontSize: dimensions.width * 0.046,
                                color: date ? 'white' : '#8f8f8f',
                                textAlign: 'center',
                                fontWeight: 800,
                                alignSelf: 'center',
                                paddingHorizontal: dimensions.width * 0.03,
                                paddingVertical: dimensions.height * 0.014,
                            }}
                        >
                            {formatDate(date)}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={showDatePicker}
                        animationType="fade"
                    >
                        <View style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                        }}>
                            <View style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.97)',
                                borderRadius: 10,
                                padding: 20,
                                alignItems: 'center',
                                width: '80%',
                            }}>
                                <DateTimePicker
                                    value={date || new Date()}
                                    mode="date"
                                    display="default"
                                    minimumDate={new Date()}
                                    onChange={(event, selectedDate) => {
                                        handleDateChange(event, selectedDate);
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() => setShowDatePicker(false)}
                                    style={{
                                        marginTop: 20,
                                        padding: 10,
                                        backgroundColor: '#DA553E',
                                        borderRadius: 10,
                                    }}
                                >
                                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <TouchableOpacity
                        onPress={() => setShowTimePicker(true)}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: dimensions.width * 0.03,
                            backgroundColor: '#202020',
                            borderRadius: dimensions.width * 0.1,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                        }}>
                        <Image
                            source={require('../assets/icons/timeIcon.png')}
                            style={{
                                width: dimensions.width * 0.055,
                                height: dimensions.width * 0.055,
                                textAlign: 'center',
                                marginLeft: dimensions.width * 0.03,
                            }}
                            resizeMode="contain"
                        />
                        <Text
                            style={{
                                fontFamily: fontRobotoBold,
                                fontSize: dimensions.width * 0.046,
                                color: time ? 'white' : '#8f8f8f',
                                textAlign: 'center',
                                fontWeight: 800,
                                alignSelf: 'center',
                                paddingHorizontal: dimensions.width * 0.03,
                                paddingVertical: dimensions.height * 0.014,
                            }}
                        >
                            {formatTime(time)}
                        </Text>
                    </TouchableOpacity>
                    <Modal
                        transparent={true}
                        visible={showTimePicker}
                        animationType="fade"
                    >
                        <TouchableWithoutFeedback onPress={() => setShowTimePicker(false)}>
                            <View style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}>
                                <TouchableWithoutFeedback>
                                    <View style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.97)',
                                        borderRadius: 10,
                                        padding: 20,
                                        alignItems: 'center',
                                        width: '80%',
                                    }}>
                                        <DateTimePicker
                                            value={time || new Date()}
                                            mode="time"
                                            display="default"
                                            onChange={(event, selectedTime) => {
                                                handleTimeChange(event, selectedTime);
                                            }}
                                        />
                                        <TouchableOpacity
                                            onPress={() => setShowTimePicker(false)}
                                            style={{
                                                marginTop: 20,
                                                padding: 10,
                                                backgroundColor: '#DA553E',
                                                borderRadius: 10,
                                            }}
                                        >
                                            <Text style={{ color: 'white', fontWeight: 'bold' }}>Close</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>

                    <TextInput
                        placeholder="Ticket purchase link"
                        value={ticketLink}
                        onChangeText={setTicketLink}
                        placeholderTextColor="#8f8f8f"
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: dimensions.width * 0.03,
                            backgroundColor: '#202020',
                            borderRadius: dimensions.width * 0.1,
                            width: '95%',
                            marginBottom: dimensions.height * 0.005,
                            color: 'white',
                            fontFamily: fontRobotoBold,
                            fontSize: dimensions.width * 0.046,
                            fontWeight: 800,
                            textAlign: 'center',
                        }}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default AddEntertainmentScreen;
