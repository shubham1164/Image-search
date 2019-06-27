import React, {Component} from 'react';
import {Platform, StyleSheet, View, TouchableOpacity, Dimensions, ActivityIndicator, Image} from 'react-native';
import {Container, Content, Header, Item, Icon, Input, Button, Text} from 'native-base';
import Constants from './src/Utils/Constants.js';
import API from './src/Utils/API.js';
import { ListView, FlatList } from 'react-native';

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      dataArray: [],
      searchText: '',
      isLoading: false,
      page: 0,
      per_page: 0,
      total_count: 0,
      fetched_count: 0,
    }
  }

  _keyExtractor = (item, index) => item.id;

  loadOlderData = async function() {
    try{

      // If all items have been fetched, then return
      if (this.state.fetched_count == this.state.total_count){
        return;
      }

      // Get Images from the API
      const result = await API.getImages(this.state.searchText, this.state.page+1);

      this.setState(prevState => ({
        dataArray: [...prevState.dataArray, ...result.data],
        page: result.page,
        fetched_count: prevState.fetched_count + result.data.length
      }))
    } catch(e){
      console.warn("err10003: ", e.message);
    }
  }.bind(this)

  _renderItem = function({item}){
    const {height, width} = Dimensions.get('window');
    const padding = 5;
    const imageWidth = Math.floor(width/Constants.ImagesPerRow)-(padding*2);
    const imageHeight = imageWidth;
    const imageURI = item.assets.large_thumb.url;
    return(
      <View style={{padding: padding}}>
        <Image style={{width: imageWidth, height: imageHeight}} source={{ uri: imageURI }} />
      </View>
    )
  }.bind(this)

  onChangeText = function(text){
    this.setState({
      searchText: text
    })
  }.bind(this)

  fetchDataFromAPI = async function(){
    try{
      // show spinner and set defaults
      this.setState({
        isLoading: true,
        dataArray: [],
        total_count: 0,
        per_page: 0,
        page: 0,
        fetched_count: 0
      })

      // Get Images from the API
      const result = await API.getImages(this.state.searchText, this.state.page+1);

      // stop spinner and set other values
      this.setState({
        isLoading: false,
        dataArray: result.data,
        total_count: result.total_count,
        per_page: result.per_page,
        page: result.page,
        fetched_count: result.data.length
      })
    } catch(e){
      console.warn("err10002");
    }
  }.bind(this)

  render() {
    return (
      <Container>
        <Header searchBar rounded>
          <Item>
            <Input placeholder="Search" onChangeText={this.onChangeText} value={this.state.searchText} />
            <TouchableOpacity onPress={this.fetchDataFromAPI} >
              <Icon name="ios-search"  />
            </TouchableOpacity>
          </Item>
        </Header>
        <Content contentContainerStyle={{flex: 1}} scrollEnabled={false} >
          {this.state.isLoading && (
            <View style={[styles.container]}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}
          {!this.state.isLoading && (
            <FlatList
              data={this.state.dataArray}
              numColumns={Constants.ImagesPerRow}
              extraData={this.state}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              onEndReachedThreshold={0.5} // Update threshold value based on API speed
              onEndReached={this.loadOlderData}
              ListEmptyComponent={
                <Text note style={styles.EmptyTextStyle}>Not search yet</Text>
              }
            />
          )}
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  EmptyTextStyle: {
    fontSize: 20,
    color: 'darkgrey',
    textAlign:'center',
    marginTop: 180
  }
})
