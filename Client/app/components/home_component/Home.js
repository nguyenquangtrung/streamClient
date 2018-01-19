import React, { Component } from 'react';
import { View, Text, Dimensions, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
const { width, height } = Dimensions.get("window");
var that = {};
import Icon from 'react-native-vector-icons/Entypo';
import Icon2 from 'react-native-vector-icons/SimpleLineIcons';
import { connect } from 'react-redux'

//http://192.168.9.133:4443
//https://stream11012018.herokuapp.com/



class Home extends Component {

  static navigationOptions = { header: null }
  constructor(props) {
    super(props);
    that = this;
    this.state = {
      dataSource: [],
    }


  }

  componentWillMount() {
    this.props.socket.on("ANSWER", function (data) {
      if (data !== null) {
        that.props.navigation.navigate("Message_Screen", { type: "answer",data:data});
      }
    });

    this.props.socket.on("NEW_USER", function (data) {
      that.setState({ dataSource: that.state.dataSource.concat(data) });
    })

  }





  _keyExtractor = (item, index) => index;
  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#FFF' }}>
        <View style={{ height: 60, backgroundColor: '#34B089', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
          <TouchableOpacity style={{ position: 'absolute', left: 12 }} onPress={() => { this.props.navigation.navigate('DrawerToggle') }}>
            <Icon2 name="menu" size={35} color="#FFF" />
          </TouchableOpacity>
          <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 20, fontFamily: 'serif' }}>Home Screen</Text>

        </View>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={this.state.dataSource}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity onPress={() => { this.props.navigation.navigate("Message_Screen", { item: item}) }} style={{ flexDirection: 'row', borderBottomColor: '#2c2c2c', height: 80, borderBottomWidth: 0.2 }}>
                <View style={{ flex: 10, flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={{ uri: 'http://nerdreactor.com/wp-content/uploads/2017/03/avtr-he-bg-03.jpg' }} style={{ width: 60, height: 60, borderRadius: 30, marginLeft: 12 }} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: '#757575', marginBottom: 2, fontFamily: 'serif' }}>{item.name}</Text>
                    <Text style={{ fontSize: 15, fontFamily: 'serifrr' }}>{item.email}</Text>
                  </View>
                </View>
                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name="chevron-small-right" size={40} />
                </View>
              </TouchableOpacity>
            )
          }}
        />
      </View>
    )
  }

  getDataOnline() {
    fetch("https://stream11012018.herokuapp.com/getAllOnlineUser")
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        else {

        }
      })
      .then(responseJson => {
        let arr = responseJson.filter((item) => {
          return item._id !== this.props.navigation.state.params.item._id;
        })
        this.setState({ dataSource: arr });
      })
      .catch(err => console.log("loi khong load duoc data: " + err))

  }

  componentDidMount() {
    setTimeout(() => {
      this.getDataOnline();
    }, 2000)
  }

}

function mapStateToProps(state) {
  return { socket: state.socket };
}

export default connect(mapStateToProps)(Home);


