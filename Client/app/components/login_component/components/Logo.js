import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
   Image 
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
export default class Logo extends Component<{}> {
	render(){
		return(
			<View style={styles.container}>
			       <Icon name="logo-pinterest" size={50} color="#FFF" />
          		<Text style={styles.logoText}>Welcome to My app.</Text>	
  			</View>
			)
	}
}

const styles = StyleSheet.create({
  container : {
    flexGrow: 1,
    justifyContent:'flex-end',
    alignItems: 'center'
  },
  logoText : {
  	marginVertical: 15,
  	fontSize:22,
    color:'#FFF',
    fontFamily:'serif'
  }
});