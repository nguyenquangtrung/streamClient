import React, { Component } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get("window");
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
var that;
import { connect } from 'react-redux';
import {
    RTCPeerConnection,
    RTCMediaStream,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStreamTrack,
    getUserMedia,
    MediaStream
} from 'react-native-webrtc';
const configuration = { iceServers: [{ url: "stun:stun.l.google.com:19302" }] };
// const configuration ={"iceServers":[{
// 	url: 'turn:numb.viagenie.ca',
// 	credential: 'muazkh',
// 	username: 'webrtc@live.com'
// }]}
var that = {};
const pcPeers = {};
let localStream;


function logError(error) {
    console.log("logError", error);
}


function getLocalStream(isFront, cb) {
    MediaStreamTrack
        .getSources()
        .then(sourceInfos => {
            // console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "video" && sourceInfo.facing == (isFront ? "front" : "back")) {
                    videoSourceId = sourceInfo.id;
                }
            }
            return getUserMedia({
                audio: true,
                video: {
                    mandatory: {
                        minWidth: 500,
                        minHeight: 300,
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            });
        })
        .then(stream => {
            cb(stream);
        })
        .catch(logError);
}

class Call extends Component {
    constructor(props) {
        super(props);
        this.state = {
            status: 'init'
        }
    }

    componentWillMount() {
        this.props.socket.on("ANSWER", function (data) {
            if (data.type === 'call') {
            }
            else if (data.type === 'answer' && data.status === 200) {
                that.creteRTCPeerConnection(data.from, true);
            }
            else {
                alert("Người dùng bận");
            }
        });

        this.props.socket.on('exchange', function (data) {
            that.exchange(data);
        });


    }

    creteRTCPeerConnection(socketId, isOffer) {
        const pc = new RTCPeerConnection(configuration);
        pcPeers[socketId] = pc;

        pc.onicecandidate = function (event) {
            console.log('onicecandidate', event.candidate);
            if (event.candidate) {
                that.props.socket.emit('exchange', { 'to': socketId, 'candidate': event.candidate });
            }
            else {
                console.log("Not Call Onicecandidate")
            }
        };

        function createOffer() {
            pc.createOffer(function (desc) {
                pc.setLocalDescription(desc, function () {
                    that.props.socket.emit('exchange', { 'to': socketId, 'sdp': pc.localDescription });
                }, logError);
            }, logError);
        }

        pc.onnegotiationneeded = function () {
            console.log('onnegotiationneeded');
            if (isOffer) {
                createOffer();
            }
        }

        pc.oniceconnectionstatechange = function (event) {
            console.log('oniceconnectionstatechange', event.target.iceConnectionState);
            if (event.target.iceConnectionState === 'completed') {
                console.log("completed");
                that.setState({state:'completed'});
            }
            if (event.target.iceConnectionState === 'connected') {
                console.log("connected");
                console.log("create channel ");
            }
            if (event.target.iceConnectionState === 'failed') {
                console.log("failed");
            }
        };

        pc.onsignalingstatechange = function (event) {
            console.log('onsignalingstatechange');
        };

        pc.onaddstream = function (event) {
            console.log('onaddstream');
        };

        pc.addStream(localStream);

        return pc;
    }

    

    exchange(data) {
        const fromId = data.from;
        let pc;
        if (fromId in pcPeers) {
            pc = pcPeers[fromId];
        } else {
            pc = that.creteRTCPeerConnection(fromId, false);
        }

        if (data.sdp) {

            pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
                if (pc.remoteDescription.type == "offer")
                    pc.createAnswer(function (desc) {
                        pc.setLocalDescription(desc, function () {
                            that.props.socket.emit('exchange', { 'to': fromId, 'sdp': pc.localDescription });
                        }, logError);
                    }, logError);
            }, logError);
        } else {
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
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
                        var data = this.props.navigation.state.params.data;
                        data.status = 200;
                        data.type = 'answer';
                        data.to = this.props.navigation.state.params.data.from;
                        this.props.socket.emit("CONNECTION_CALL", data);
                    }} style={{ height: 80, width: 80, justifyContent: 'center', alignItems: 'center', backgroundColor: '#4CD964', borderRadius: 40 }}>
                        <Icon name="phone" size={40} color="#fff" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 18, color: '#fff', fontFamily: 'serif', fontWeight: '400', paddingTop: 10 }}>Đồng Ý</Text>
                </View>
            </View>
        )
    }

    renderStream() {

    }



    render() {
        if (this.state.status === 'init') {
            return (
                <View style={{ flex: 1, backgroundColor: '#232223' }}>
                    <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: 'https://www.alltalksnewsnetwork.com/wp-content/uploads/2017/10/1-2-e1507532198816.jpg' }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                        <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'serif', marginTop: 5 }}>Đang gọi ....</Text>
                    </View>
                    {this.props.navigation.state.params.type === 'call' ? this.renderCall() : this.renderAnswer()}
                </View>
            )
        }
        else{
            <View style={{flex:1,backgroundColor:'red'}}>
                <View style={{position:'absolute',top:0,right:0,width:width/2,height:100}}>
                   <RTCView  />
                </View>
            </View>
        }
    }

    componentDidMount() {
        that = this;
        getLocalStream(true, function (stream) {
            localStream = stream;
        });
    }

}

function mapStateToProps(state) {
    return { socket: state.socket }
}
export default connect(mapStateToProps)(Call);