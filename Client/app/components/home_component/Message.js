import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Call from './Call';
import {connect} from 'react-redux';
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
const configuration = { "iceServers": [{ "url": "stun:stun.l.google.com:19302" }] };
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
        this.props.socket.emit("CALL");
    }

    componentWillMount() {
        if (this.props.navigation.state.params.type === 'answer') {
            this.setState({ type: 'answer', status: 'phone',message:this.props.navigation.state.params.data });
        }
        this.props.socket.on("ANSWER", function (data) {
            if (data.type === 'call') {
                alert("User Call")
               // that.setState({ type: 'answer', status: 'phone' });
            }
            else if(data.type === 'answer' && data.status === 200){
               that.creteRTCPeerConnection(data.from,true);
            }
            else{
                alert("Người dùng bận");
            }
        });

        this.props.socket.on('exchange', function(data){
            that.exchange(data);
          });

        
    }



    join() {
       // const roomId = 200;
        if (this.state.type === 'call') {
            this.props.socket.emit("CONNECTION_CALL", { "to": this.props.navigation.state.params.item.socketId,name:this.props.name,type:'call'});
        }
        this.setState({ type: 'call', status: 'phone' });

    }

    //create PeerConnection
    creteRTCPeerConnection(socketId, isOffer){
        const pc = new RTCPeerConnection(configuration);
        pcPeers[socketId]=pc;

        pc.onicecandidate = function (event) {
            console.log('onicecandidate', event.candidate);
            if (event.candidate) {
                that.props.socket.emit('exchange', {'to': socketId, 'candidate': event.candidate });
            }
            else{
                console.log("Not Call Onicecandidate")
            }
          };

        pc.onnegotiationneeded = function () {
            console.log('onnegotiationneeded');
            if (isOffer) {
              createOffer();
            }
        }

        pc.oniceconnectionstatechange = function(event) {
            console.log('oniceconnectionstatechange', event.target.iceConnectionState);
            if (event.target.iceConnectionState === 'completed') {
                console.log("completed");
            }
            if (event.target.iceConnectionState === 'connected') {
               console.log("connected");
            }
            if(event.target.iceConnectionState === 'failed'){
                console.log("failed");
            }

          };

          pc.onsignalingstatechange = function(event) {
            console.log('onsignalingstatechange');
          };

        function createOffer() {
            pc.createOffer(function(desc) {
              pc.setLocalDescription(desc, function () {
                  console.log("localDescription: " + pc.localDescription);
                that.props.socket.emit('exchange', {'to': socketId, 'sdp': pc.localDescription });
              }, logError);
            }, logError);
          }

       

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
              pc.createAnswer(function(desc) {
                pc.setLocalDescription(desc, function () {
                  that.props.socket.emit('exchange', {'to': fromId, 'sdp': pc.localDescription });
                }, logError);
              }, logError);
          }, logError);
        } else {
          pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        }
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
                {this.state.status === 'message' ? this.renderMessage() : <Call  type={this.state.type} message={this.state.message}/>}
            </View>
        )
    }

    componentDidMount() {
        that = this;
        getLocalStream(true, function (stream) {
            localStream = stream;
            console.log("xong");
            that.setState({ selfViewSrc: stream.toURL() });
        });
    }
}

function mapStateToProps(state){
    return {socket:state.socket,name:state.username}
}

export default connect(mapStateToProps)(Message);

