import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Call from './Call';
import {connect} from 'react-redux';






 class Message extends Component {
    constructor(props) {
        super(props);
        that = this;
        this.state = {
            status: 'message',
            type: 'call',
            removeList: [],
            selfViewSrc: null,
            message:{}

        }
    }

    componentWillMount() {
        this.props.socket.on("ANSWER", function (data) {
            if (data.type === 'call') {
                console.log("Message_Screen");
              that.props.navigation.navigate("Call_Screen", { type: "answer",data:data});
            }
            else{
                
            }
          });

        
    }

    join() {
       // const roomId = 200;
       // if (this.state.type === 'call') {
            this.props.socket.emit("CONNECTION_CALL", { "to": this.props.navigation.state.params.item.socketId,name:this.props.name,type:'call'});
            this.props.navigation.navigate("Call_Screen",{type:'call'});
        //}
      //  this.setState({ type: 'call', status: 'phone' });

    }

  


    renderMessage() {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={{ height: 60, backgroundColor: '#34B089', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                    <TouchableOpacity style={{ position: 'absolute', left: 12 }} onPress={() => { this.props.navigation.navigate('DrawerToggle') }}>
                        <Icon name="keyboard-backspace" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20, fontFamily: 'serif' }}>{this.props.navigation.state.params.item.name}</Text>
                    <TouchableOpacity onPress={() => { this.join() }} style={{ position: 'absolute', right: 12 }}>
                        <Icon name="phone" size={40} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

        )
    }


    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderMessage()}
            </View>
        )
    }

    componentDidMount() {
        that = this;     
    }
}

function mapStateToProps(state){
    return {socket:state.socket,name:state.username}
}

export default connect(mapStateToProps)(Message);

