import React, { useState } from "react";
import {View, Text, ScrollView, Image, Dimensions, TouchableHighlight} from 'react-native'
import { useScreenDimensions, Top } from '../conststants/global'
import { Appbar } from 'react-native-paper';
import SearchBar from "react-native-dynamic-search-bar";
import Icon from 'react-native-vector-icons/FontAwesome'
import { useSelector, useDispatch } from 'react-redux';
import { AddItem } from '../storage/actions';
import * as Network from 'expo-network';

const Library = ({ navigation }) => {

    const [searchTxt, setSearchTxt] = useState('')

    const screenDimensions = useScreenDimensions();
    const landscape = screenDimensions.isLandscape

    const { bookItems } = useSelector(state => state.booksReducer);
    const dispatch = useDispatch();

    const addToStorage = items => dispatch(AddItem(items));

    const handleAddBooks = books => { addToStorage(books) };

    const dim = Dimensions.get("screen")

    const filterItems = (array, text) => {
        if(text.trim().length === 0 || text.length === 0) {
            return array
        } else {
            return array.filter((item) => {
                if( item.title.replace(/[^a-zA-Z ]/g, "").toLowerCase().indexOf(text)> -1 ){
                    return (item)
                }
            })
        }
    }

    const deleteItemFromArray = (id) => {
        const idx = bookItems.findIndex((el) => el.isbn13 === id)
        const newBooksData = [...bookItems.slice(0, idx),...bookItems.slice(idx + 1)]
        handleAddBooks(newBooksData)
    };

    const deleteDuplicates = (arr, key) => {
        return [...new Map(arr.map(item => [item[key], item])).values()]
    }

    const getData = async (text) => {
        let BooksArrayFromData = []
        const txt = text.toLowerCase().replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, ' ').trim().replace(/,/g, '')
        setSearchTxt(txt)
        if( txt.length <= 2) {
            return null
        } else if ( (await Network.getNetworkStateAsync()).isConnected ) {
            let url = `https://api.itbook.store/1.0/search/${txt}`
            const fetchResult = await fetch(url);
            const loadedData = await fetchResult.json();
            BooksArrayFromData = [...filterItems(bookItems, txt), ...loadedData.books]
        }
        // handleAddBooks(deleteDuplicates([...BooksArrayFromData, ...bookItems], 'isbn13' ))
    }

    const visibleBooks = filterItems(bookItems, searchTxt)

    return (
        <ScrollView style={{ backgroundColor: "#eee" }}>
            <View>
                <Appbar.Header theme={ Top }>
                    <Appbar.Action
                        icon="home"
                    />
                    <SearchBar
                        style={{ backgroundColor: 'rgb(242, 242, 242)', flex: 1 }}
                        placeholder="Search some books"
                        onClearPress={() => {setSearchTxt('')}}
                        onChangeText={(text) => getData(text)}/>
                    <Appbar.Action
                        icon="plus"
                        onPress={() => { navigation.navigate('Add')}}
                    />
                </Appbar.Header>
            </View>
            <View>
                {
                    searchTxt.length <= 2 ?
                    <View style={{height: dim.height, paddingTop: landscape ? '15%' : '65%', flexDirection:'column', alignItems:'center'}}>
                        <Text style={{fontSize: 20, color: '#000'}}>
                            Type something in SearchBar
                        </Text>
                    </View> :
                    visibleBooks.length === 0 ?
                        <View style={{height: dim.height, paddingTop: landscape ? '15%' : '65%', flexDirection:'column', alignItems:'center'}}>
                            <Text style={{fontSize: 20, color: '#000'}}>
                                Not found :(
                            </Text>
                        </View> :
                    visibleBooks.map(( item, i ) => {
                        return(
                            <View key={i}>
                                <TouchableHighlight onPress={() => { navigation.navigate('Info', {Id: item.isbn13})}}>
                                    <View style={{backgroundColor: '#000', borderRadius: 30, flexDirection: 'row', margin: 10}}>
                                        <View>
                                            <Image
                                                resizeMode="cover"
                                                source={ item.image === 'N/A' || item.image === '' ? require('../assets/images/pastel.jpeg') : {uri: item.image}}
                                                style={{height: 200, width: 150, borderBottomLeftRadius: 30, borderTopLeftRadius: 30,}}
                                            />
                                        </View>
                                        <View style={{marginLeft: '5%', width: '76%'}}>
                                            <Text style={{color: '#eee', flex: 0, width: landscape ? '100%' : '45%', fontSize: 16, marginBottom: 10, marginTop: 10, textAlign: 'left',}}>
                                                { item.title.length >= 43 ? item.title.slice(0, 43 - 1) + '…' : item.title }
                                            </Text>
                                            <Text style={{color: '#eee', flex: 0, width: landscape ? '100%' : '45%', fontSize: 14, marginBottom: 10, marginTop: 10, textAlign: 'left',}}>
                                                { item.subtitle.length === 0 ? 'Subtitle' : item.subtitle.length >= 40 ? item.subtitle.slice(0, 40 - 1) + '…' : item.subtitle }
                                            </Text>
                                            <Text style={{color: '#eee', position: 'absolute', bottom: -5, marginBottom: '5%'}}>
                                                { item.price.length === 0 ? 'Priceless' : item.price }
                                            </Text>
                                        </View>
                                        <TouchableHighlight
                                            style={{ position: "absolute", right: 0, top: 0, width: landscape ? '8%' : '10%', height: landscape ? '20%' : '18%', backgroundColor: '#000'}}
                                            onPress={() => { deleteItemFromArray(item.isbn13) }}>
                                            <View>
                                                <Icon
                                                    onPress={() => { deleteItemFromArray(item.isbn13) }}
                                                    style={[{color: '#eee', flex: 0, marginTop: landscape ? '12%' : '18%', alignSelf: 'center',}]}
                                                    size={ landscape ? 25 : 22}
                                                    name={'trash'}
                                                />
                                            </View>
                                        </TouchableHighlight>
                                    </View>
                                </TouchableHighlight>
                            </View>
                        )
                    })
                }
            </View>
        </ScrollView>
    )
}

export default Library


