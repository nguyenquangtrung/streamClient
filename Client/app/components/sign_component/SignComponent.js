import React, { Component } from 'react';
import { View, Text,TextInput,Dimensions,StyleSheet,TouchableOpacity, Keyboard,  } from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
const {width,height}=Dimensions.get("window");
import {emailValidator} from '../../validator/Validator'
export default class Sign extends Component {
    constructor(props){
       super(props);
       this.state={
           email:'',
           password:'',
           username:'',
           errMsg:'',
           check:false
       }
    }
//https://stream11012018.herokuapp.com
    Authen(){
        fetch('http://192.168.9.133:4443/register',{
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username:this.state.username,
              email: this.state.email,
              password: this.state.password,
            }),
          }).then(response => {
            if (response.status === 200) {
              return response.json();
            }
            else {
              let error = new Error(response.status);
              throw error;
            }
          })
            .then(responseJson => {
              if (responseJson !== null) {
               alert("THANH CONG ");
              }
            })
            .catch(err => this.setState({ check: true, errMsg: 'Tài khoản Emai đã tồn tại vui lòng chọn tài khoản khác' }))
    }

    register(){
        Keyboard.dismiss();
        if (this.state.email === '') {
            this.setState({ check: true, errMsg: 'Bạn không được bỏ trống trường email' });
            return;
          }
        else if (this.state.password === '') {
            this.setState({ check: true, errMsg: 'Bạn không được bỏ trống trường password' });
            return;
        }
        else if(this.state.username === ''){
            this.setState({check:true,errMsg:'Bạn không được bỏ trống trường userName'});
            return;
        }
        else if(this.state.password.length < 8){
            this.setState({check:true,errMsg:'Mật khẩu quá yếu'});
            return;
        }
        else {
            if (!emailValidator(this.state.email))
              this.setState({ check: true, errMsg: 'Email không hợp lệ' })
             else {
               this.Authen();
             }
        }
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#484d53' }}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                   <Text style={{color:'#FFF',fontFamily:'serif',fontSize:22}}>Register App</Text>
                </View>
                <View style={styles.container}>
                <View style={styles.inputWrapper}>
                        <Icon1 name="ios-contact-outline" size={27} color="#FFF" style={{ paddingLeft: 10 }} />
                        <TextInput
                            onFocus={() => { this.setState({ check: false, errMessage: '' }) }}
                            ref="email"
                            returnKeyType={"next"}
                            onChangeText={(text) => { this.setState({ username: text }) }}
                            placeholder="UserName"
                            placeholderTextColor="#f9f9f9"
                            underlineColorAndroid="transparent"
                            style={{ height: 45, width: width - 90, color: '#FFF', fontSize: 16, paddingHorizontal: 8, fontFamily: 'serif' }}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <Icon1 name="ios-mail-outline" size={27} color="#FFF" style={{ paddingLeft: 10 }} />
                        <TextInput
                            onFocus={() => { this.setState({ check: false, errMessage: '' }) }}
                            ref="email"
                            returnKeyType={"next"}
                            onChangeText={(text) => { this.setState({ email: text }) }}
                            placeholder="Email"
                            placeholderTextColor="#f9f9f9"
                            underlineColorAndroid="transparent"
                            style={{ height: 45, width: width - 90, color: '#FFF', fontSize: 16, paddingHorizontal: 8, fontFamily: 'serif' }}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <Icon name="lock" size={32} color="#FFF" style={{ paddingLeft: 5 }} />
                        <TextInput
                            onFocus={() => { this.setState({ check: false, errMessage: '' }) }}
                            onChangeText={(text) => { this.setState({ password: text }) }}
                            ref="password"
                            secureTextEntry
                            placeholder="Password"
                            placeholderTextColor="#FFF"
                            underlineColorAndroid="transparent"
                            style={{ height: 45, width: width - 90, color: '#FFF', fontSize: 16, paddingRight: 8, paddingLeft: 3, fontFamily: 'serif' }}
                        />
                    </View>

                    {this.state.check ? <Text style={{ marginTop: 10, color: '#FF4C4C', fontSize: 15, fontStyle: 'italic', textAlignVertical: 'center', textAlign: 'center', fontFamily: 'serif' }}>{this.state.errMsg}</Text> : null}
                    <TouchableOpacity style={styles.button} onPress={() => {this.register()}}>
                        <Text style={styles.buttonText}>Register </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 2,
     
      alignItems: 'center'
    },
  
    inputWrapper: {
      marginTop: 15,
      alignItems: 'center',
      flexDirection: 'row',
      height: 45,
      width: width - 50,
      marginHorizontal: 25,
      borderColor: '#FFF',
      borderWidth: 0.5,
      //backgroundColor: "#fff",
      opacity: 0.9,
      borderRadius: 25
    },
    button: {
      height: 45,
      width: width - 50,
      backgroundColor: '#27ae61',
      borderRadius: 25,
      marginVertical: 15,
      paddingVertical: 8,
  
    },
    buttonText: {
      fontSize: 18,
      fontWeight: '500',
      color: '#ffffff',
      textAlign: 'center',
      fontFamily: 'serif'
    }
  
  });