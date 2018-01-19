import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Keyboard, KeyboardAvoidingView } from 'react-native';
const { width, height } = Dimensions.get("window");
import Icon from 'react-native-vector-icons/EvilIcons';
import Icon1 from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
var that;
import {connect} from 'react-redux'
import { emailValidator } from '../../../validator/Validator'
//https://stream11012018.herokuapp.com/
 class Form extends Component<{}> {
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      email: '',
      password: '',
      check: false,
      errMsg: ''
    }
  }

  login() {
    fetch('https://stream11012018.herokuapp.com/login',{
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
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
          const socket = io.connect('https://stream11012018.herokuapp.com/', { transports: ['websocket'] });
          this.props.dispatch({type:"LOGIN_SUCCESS",data:{"name":responseJson.name,socket:socket}});
          socket.emit("NEW_USER", responseJson);
          this.props.open(responseJson);
        }
      })
      .catch(err => this.setState({ check: true, errMsg: 'Tài khoản hoặc mật khẩu của bạn không đúng' }))
  }
  Authen() {
    if (this.state.email === '') {
      this.setState({ check: true, errMsg: 'Bạn không được bỏ trống trường email' });
      return
    }
    else if (this.state.password === '') {
      this.setState({ check: true, errMsg: 'Bạn không được bỏ trống trường password' });
      return;
    }
    else {
      if (!emailValidator(this.state.email))
        this.setState({ check: true, errMsg: ' Email không hợp lệ' })
      else {
        Keyboard.dismiss();
        this.login();
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.inputWrapper}>
          <Icon1 name="ios-mail-outline" size={27} color="#FFF" style={{ paddingLeft: 10 }} />
          <TextInput
            onFocus={() => { this.setState({ check: false, errMessage: '' }) }}
            ref="email"
            autoFocus={true}
            returnKeyType={"next"}
            onChangeText={(text) => { this.setState({ email: text }) }}
            placeholder="Email"
            placeholderTextColor="#FFF"
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
        <TouchableOpacity style={styles.button} onPress={() => { this.Authen() }}>
          <Text style={styles.buttonText}>{this.props.type}</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

function mapStateToProps(state){

}

export default connect()(Form);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
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
    marginVertical: 10,
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