import isEmpty from "../validation/is-empty";

import {
  SET_CURRENT_USER,
  SET_CURRENT_USER_RESET_PASS_DATA
} from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {},
  resetpassworddata: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER: //IF THE ACTION dispatch SET_CURRENT_USER type
      return {
        //here we cannot change or mutate the state we just make copy of the state
        ...state, //here we return current state
        isAuthenticated: !isEmpty(action.payload), //here we check the that the payload is send by setCurrentUser from the authActions.js  if its not empty its mean the payload is filled or it has user data then user should be authenticated
        user: action.payload //here we set the user object with fill payload
      };
    case SET_CURRENT_USER_RESET_PASS_DATA: //IF THE ACTION dispatch SET_CURRENT_USER type
      return {
        //here we cannot change or mutate the state we just make copy of the state
        ...state, //here we return current state
        resetpassworddata: action.payload //here we set the user object with fill payload
      };
    default:
      return state;
  }
}
