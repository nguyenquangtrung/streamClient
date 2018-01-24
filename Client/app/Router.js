import React,{Component} from 'react'
import {StackNavigator,DrawerNavigator} from 'react-navigation' ;
import {Dimensions} from 'react-native';
const {width,height}=Dimensions.get("window");
//import component 
import Login from './components/login_component/Login';
import Home from './components/home_component/Home';
import Menu from './components/menu_component/Menu';
import Message from './components/home_component/Message';
import Call from './components/home_component/Call';
import Sign from './components/sign_component/SignComponent'
 const ProfileView = DrawerNavigator({
    Main_Screen:{
        screen:props => <Home {...props}/>,
    },
},{
    headerMode: 'screen',
    drawerWidth :width*3/4-20,
    drawerPosition:'left',
    contentComponent : props => <Menu {...props} />,
 });



export const AppScreen = StackNavigator({
    
    Login_Screen:{
        screen:Login,
    },
    Home_screen:{
        screen:ProfileView,
    },
    Message_Screen:{
        screen:Message
    },
    Call_Screen:{
        screen:Call
    },
    Sign_Screen:{
        screen:Sign
    }
  

   
   
    
   
   
},{
    headerMode:'none'
});


