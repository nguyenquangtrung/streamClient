import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar ,
  TouchableOpacity,Dimensions,Keyboard
} from 'react-native';
import Logo from './components/Logo';
import Form from './components/Form';


export default class Login extends Component<{}> {
   static navigationOptions={header:null}
   
   openHomeScreen(item){
     this.props.navigation.navigate("Home_screen",{item,item});
   }
	render() {
		return(
			<View style={styles.container}>
				<Logo/>
				<Form type="Login" open={this.openHomeScreen.bind(this)} />
				<View style={styles.signupTextCont}>
					<Text style={styles.signupText}>Don't have an account yet?</Text>
					<TouchableOpacity onPress={() =>{this.props.navigation.navigate("Sign_Screen")}}><Text style={styles.signupButton}> Signup</Text></TouchableOpacity>
				</View>
			</View>	
			)
	}
}
const styles = StyleSheet.create({
  container : {
    backgroundColor:'#484d53',
    flex: 1,
    alignItems:'center',
    justifyContent :'center'
  },
  signupTextCont : {
  	flexGrow: 1,
    alignItems:'flex-end',
    justifyContent :'center',
    paddingVertical:16,
    flexDirection:'row'
  },
  signupText: {
  	color:'rgba(255,255,255,0.6)',
    fontSize:16,
    fontFamily:'serif'
  },
  signupButton: {
  	color:'#ffffff',
  	fontSize:16,
    fontWeight:'500',
    fontFamily:'serif'
  }
});