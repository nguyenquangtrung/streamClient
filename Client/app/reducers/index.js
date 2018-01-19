import {createStore} from 'redux';


const defaultState={socket:null,username:''};

const reducer = (state = defaultState ,action) => {
    if(action.type === 'LOGIN_SUCCESS'){
       return {socket:action.data.socket,username:action.data.name};
    };
    return state;
};

export const store=createStore(reducer);