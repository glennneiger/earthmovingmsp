import {
  GET_SESSION_CART,
  SESSION_CART_LOADING,
  CLEAR_CURRENT_SESSION_CART,
  GET_SESSION_CART_BY_ID,
  PRODUCT_IN_SESSION_CART_INC_BY_1_ID,
  PRODUCT_IN_SESSION_CART_DEC_BY_1_ID,
  PRODUCT_IN_SESSION_CART_DELETE_BY_ID
} from "../actions/types";

const initialState = {
  sessioncart: null,
  loading: false,
  sessioncartbyid: null,
  testpurpose: "testpurpose working"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SESSION_CART_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_SESSION_CART:
      return {
        ...state,
        sessioncart: action.payload, //if there are so product array in session get filled with payload in redux global var which is sessioncart
        loading: false
      };
    case CLEAR_CURRENT_SESSION_CART:
      return {
        ...state,
        sessioncart: null //here we set the sessioncart to null
      };
    case GET_SESSION_CART_BY_ID:
      return {
        ...state,
        sessioncartbyid: action.payload, //if there are so stocks get filled with payload
        loading: false
      };
    case PRODUCT_IN_SESSION_CART_INC_BY_1_ID:
      return {
        ...state,
        sessioncart: action.payload, //if there are so stocks get filled with payload
        loading: false
      };
    case PRODUCT_IN_SESSION_CART_DEC_BY_1_ID:
      return {
        ...state,
        sessioncart: action.payload, //if there are so stocks get filled with payload
        loading: false
      };
    case PRODUCT_IN_SESSION_CART_DELETE_BY_ID:
      return {
        ...state,
        sessioncart: action.payload, //if there are so stocks get filled with payload
        loading: false
      };
    default:
      return state;
  }
}
