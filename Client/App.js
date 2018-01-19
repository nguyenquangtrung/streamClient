import React,{Component} from 'react';
import {View,Text} from 'react-native';
import {AppScreen} from './app/Router';
import { createStore } from 'redux';
import { Provider} from 'react-redux'
import {store} from './app/reducers/index'
export default class App extends Component{
  render(){
    return(
      <View style={{flex:1,backgroundColor:'#FFF'}}>
         <Provider store={store}>
         <AppScreen />
         </Provider>
      </View>
    )
  }
}