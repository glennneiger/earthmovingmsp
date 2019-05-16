import {
  GET_SESSION_WAREHOUSE_TRANSFER,
  GET_ALL_WAREHOUSE_TRANSFER_HISTORY,
  WAREHOUSE_TRANSFER_HISTORY_LOADING,
  GET_WAREHOUSE_TRANSFER_HISTORY_BY_DATE,
  GET_WAREHOUSE_TRANSFER_HISTORY_BY_ID,
  SESSION_WAREHOUSE_TRANSFER_LOADING,
  CLEAR_CURRENT_WAREHOUSE_TRANSFER,
  GET_SESSION_WAREHOUSE_TRANSFER_BY_ID,
  PRODUCT_IN_SESSION_WAREHOUSE_TRANSFER_INC_BY_ID,
  PRODUCT_ADDED_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID,
  PRODUCT_DELETE_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID,
  GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING,
  GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING_STOP,
  GET_ERRORS
} from "../actions/types";

const initialState = {
  sessionwarehoustrans: null,
  warehousetransferhistory: null,
  warehoustranshistorybydate: null,
  warehoustranshistorybyid: null,
  loading: false,
  fwarehousetransloading: false,
  sessionwarehoustransbyid: null,
  testpurpose: "testpurpose working"
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SESSION_WAREHOUSE_TRANSFER_LOADING:
      return {
        ...state,
        loading: true
      };

    case GET_SESSION_WAREHOUSE_TRANSFER:
      return {
        ...state,
        sessionwarehoustrans: action.payload, //if there are so product array in session get filled with payload in redux global var which is sessionwarehoustrans
        loading: false
      };
    case CLEAR_CURRENT_WAREHOUSE_TRANSFER:
      return {
        ...state,
        sessionwarehoustrans: null //here we set the sessionwarehoustrans to null
      };
    case GET_SESSION_WAREHOUSE_TRANSFER_BY_ID:
      return {
        ...state,
        sessionwarehoustransbyid: action.payload, //if there are so stocks get filled with payload
        loading: false
      };
    case PRODUCT_ADDED_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID:
      return {
        ...state,
        sessionwarehoustrans: action.payload, //if there are so stocks get filled with payload
        loading: false
      };

    case PRODUCT_DELETE_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID:
      return {
        ...state,
        sessionwarehoustrans: action.payload, //if there are so stocks get filled with payload
        loading: false
      };

    case WAREHOUSE_TRANSFER_HISTORY_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_ALL_WAREHOUSE_TRANSFER_HISTORY:
      return {
        ...state,
        warehousetransferhistory: action.payload, //if there are so product array from warehousetransfer history get filled with payload in redux global var which is warehousetransferhistory
        loading: false
      };
    case GET_WAREHOUSE_TRANSFER_HISTORY_BY_ID:
      return {
        ...state,
        warehoustranshistorybyid: action.payload, //if there are so warehoustranshistorybyid get filled with payload
        loading: false
      };
    case GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING:
      return {
        ...state,
        fwarehousetransloading: true
      };
    case GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING_STOP:
      return {
        ...state,
        fwarehousetransloading: false
      };

    case GET_WAREHOUSE_TRANSFER_HISTORY_BY_DATE:
      return {
        ...state,
        warehoustranshistorybydate: action.payload, //if there are so warehoustranshistorybyid get filled with payload
        loading: false
      };

    default:
      return state;
  }
}
