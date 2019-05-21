import {
  GET_COMPANY,
  COMPANY_LOADING,
  GET_COMPANY_BY_ID,
  GET_ERRORS
} from "../actions/types";

const initialState = {
  company: null,
  loading: false,
  companybyid: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_COMPANY:
      return {
        ...state,
        company: action.payload, //if there are so company get filled with payload
        loading: false
      };

    case GET_COMPANY_BY_ID:
      return {
        ...state,
        companybyid: action.payload, //if there are so companybyid get filled with payload
        loading: false
      };
    case COMPANY_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
}
