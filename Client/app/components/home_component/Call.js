import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get("window");
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
var that;
import {connect} from 'react-redux';
//import App from '../../../App';
 class Call extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: ''
        }
    }
    
    renderCall() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                
                    <TouchableOpacity style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF3B30', borderRadius: 40 }}>
                        <Icon name="phone-hangup" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'serif', fontWeight: '400', paddingTop: 10 }}>Hủy</Text>
            </View>
        )
    }
    renderAnswer() {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ position: 'absolute', left: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FF3B30', borderRadius: 40 }}>
                        <Icon name="phone-hangup" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'serif', fontWeight: '400', paddingTop: 10 }}>Từ chối</Text>
                </View>
                <View style={{ position: 'absolute', right: 30, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => {
                        var data = this.props.message;
                        data.status = 200;
                        data.type='answer';
                        data.to = this.props.message.from;
                        this.props.socket.emit("CONNECTION_CALL",data);
                    }} style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CD964', borderRadius: 40 }}>
                        <Icon name="phone" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'serif', fontWeight: '400', paddingTop: 10 }}>Đồng Ý</Text>
                </View>
            </View>
        )
    }



    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#232223' }}>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Image source={{ uri: 'https://www.alltalksnewsnetwork.com/wp-content/uploads/2017/10/1-2-e1507532198816.jpg' }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                    <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'serif', marginTop: 5 }}>Đang gọi ....</Text>
                </View>
                {this.props.type === 'call' ? this.renderCall() : this.renderAnswer()}
            </View>
        )
    }

}

function mapStateToProps(state){
   return {socket:state.socket}
}
export default connect(mapStateToProps)(Call);