import React, { useEffect, useState } from "react";
import { useScreenDimensions } from "../conststants/global";
import {View, Text, ScrollView, Image, Dimensions} from 'react-native'
import { useDispatch, useSelector } from "react-redux";
import { AddInfoItem } from "../storage/actions";
import * as Network from 'expo-network';
import Loader from "./Loader";

const InfoBook = ({ route }) => {

    const { Id } = route.params;

    const { infoItems } = useSelector(state => state.booksReducer);
    const dispatch = useDispatch();

    const addToStorage = info => dispatch(AddInfoItem(info));

    const handleAddInfo = info => { addToStorage(info) };

    const screenDimensions = useScreenDimensions();
    const landscape = screenDimensions.isLandscape
    const dim = Dimensions.get("screen")

    const uniq = (arr, key) => {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    useEffect(() => {
        let cleanupFunction = false;
        const fetchData = async () => {
            try {
                if((await Network.getNetworkStateAsync()).isConnected) {
                    fetch(`https://api.itbook.store/1.0/books/${Id}`)
                        .then(response => response.json())
                        .then( (data) => { const infoArr = uniq([data, ...infoItems], 'isbn13')
                                // handleAddInfo(infoArr)
                            }
                        )
                }
            } catch (err) {
                console.error(err.message)
            }
        };
        fetchData();
        return () => cleanupFunction = true;
    }, []);

    let arr = []

    return (
        <ScrollView style={{backgroundColor: "#eee"}}>
            <View>
                <Loader loading={true}/>
                <View style={{ flex: 0, alignItems: 'center', justifyContent: 'center' }}>
                    {
                        infoItems.length === 0 ?
                            <View style={{ height: dim.height, paddingTop: landscape ? '15%' : '65%', flexDirection:'column', alignItems:'center'}}>
                                <Text style={{fontSize: 20}}>
                                    No info in Bd :(
                                </Text>
                            </View> :
                        infoItems.map((item, index) => {
                            if( item.isbn13 === Id ) {
                                arr.push('')
                                return (
                                    <View key={index}>
                                        <Image
                                            resizeMode="cover"
                                            source={ item.image === 'N/A' || item.image === '' ? require('../assets/images/pastel.jpeg') : {uri: item.image}}
                                            style={ landscape ? { borderRadius: 30, marginLeft: '29%', marginBottom: 10, marginTop: 25, height: 360, width: 255}: { borderRadius: 30, marginLeft: '28%', marginTop: 25, height: 260, width: 155}}
                                        />
                                        <View style={{marginLeft: 10, marginRight: 10}}>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Title</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.title}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Subtitle</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.subtitle}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Year</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.year}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Price</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.price}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Pages</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.pages}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Authors</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.authors}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Publisher</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.publisher}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Rating</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.rating}</Text>
                                            <Text style={{color: '#292929', fontSize: 20, marginBottom: 5, fontWeight: 'bold'}}>Description</Text>
                                            <Text style={{color: '#292929', fontSize: 18, marginBottom: 5}}>{item.desc}</Text>
                                        </View>
                                    </View>
                                )
                            }
                        })
                    }
                    <View key={Id}>
                        {
                            arr.length === 0 ?
                                <View style={{height: dim.height, paddingTop: landscape ? '15%' : '65%', flexDirection:'column', alignItems:'center'}}>
                                    <Text style={{fontSize: 20}}>
                                        No info in storage
                                    </Text>
                                </View> :
                                null
                        }
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default InfoBook
