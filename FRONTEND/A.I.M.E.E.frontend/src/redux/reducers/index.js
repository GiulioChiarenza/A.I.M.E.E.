
import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from '../actions/index';



const initialState = {
    login:{
        loading:false,
        token: null,
        error: null,
    }
}



const mainReducer = (state = initialState, action) => {
    switch(action.type){
        case LOGIN_REQUEST:
      return {
        ...state,
        login: { ...state.login, loading: true, error: null },
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        login: { ...state.login, loading: false, token: action.payload },
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        login: { ...state.login, loading: false, error: action.payload },
      };
        default: 
        return state
    }
}
export default mainReducer
