import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Appbar } from 'react-native-paper';
import SearchBar from "react-native-dynamic-search-bar";
import ImageComponent from "./ImageComponent";
import { useScreenDimensions, Top } from '../conststants/global'
import { useSelector, useDispatch } from 'react-redux';
import { AddImageItem } from '../storage/actions';
import * as Network from 'expo-network';

const ImageLibrary = () => {

    const screenDimensions = useScreenDimensions();
    const landscape = screenDimensions.isLandscape

    const { imageItems } = useSelector(state => state.booksReducer);
    const dispatch = useDispatch();

    const addToStorage = img => dispatch(AddImageItem(img));

    const handleAddImage = img => { addToStorage(img) };

    useEffect(() => {
        const url = `https://pixabay.com/api/?key=19193969-87191e5db266905fe8936d565&q=hot+summer&image_type=photo&per_page=24`;
        let cleanupFunction = false;
        const fetchData = async () => {
            try {
                if((await Network.getNetworkStateAsync()).isConnected) {
                    const fetchResult = await fetch(url);
                    const loadedData = await fetchResult.json();
                    const loadedDataURIs = loadedData['hits'].map((lD) => ({uri: lD['largeImageURL']}));
                    if (imageItems.length === 0) { handleAddImage(loadedDataURIs) }
                }
            } catch (e) {
                console.error(e.message)
            }
        };
        fetchData();
        return () => cleanupFunction = true;
    }, []);

    const pickImage = async () => {
        const pickedImage = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1
        });

        if (pickedImage.cancelled) {
            console.log('cancelled')
        } else {
            const newItem = {
                uri: pickedImage.uri
            }
            handleAddImage([...imageItems, newItem])
        }
    };


    const mergeArrays = (arr = [], maxArrSize = 8) => {
        const result = [];
        for (let i = 0; i < Math.ceil(arr.length / maxArrSize); i++) {
            result[i] = arr.slice(i * maxArrSize, (i * maxArrSize) + maxArrSize);
        }
        return result;
    };

    const CrateImage = mergeArrays(imageItems).map(
        item => (
            <ImageComponent
                key={item[0].uri}
                data={item}
                width={screenDimensions.width / 4}
                height={landscape ? screenDimensions.height / 2.5 : screenDimensions.height / 6.5}
            />
        )
    );

    return (
        <>
            <View>
                <Appbar.Header theme={Top}>
                    <Appbar.Action icon="home"/>
                    <SearchBar
                        placeholder='Search'
                        style={{flex: 1}}
                    />
                    <Appbar.Action
                        icon="plus"
                        onPress={pickImage}
                    />
                </Appbar.Header>
            </View>
            <View style={{flex: 1, marginTop: StatusBar.currentHeight}}>
                {
                    imageItems.length === 0 ?
                        <View style={{flex: 1, alignItems: "center", justifyContent: "center", height: "100%"}}>
                            <Text style={{fontStyle: "bold", fontSize: 20}}>
                                Add something
                            </Text>
                        </View> :
                        <ScrollView style={{display: "flex", flexWrap: "wrap", flexDirection: "row"}}>
                            { CrateImage }
                        </ScrollView>
                }
            </View>
        </>
    );
};

export default ImageLibrary
