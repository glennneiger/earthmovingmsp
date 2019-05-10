import { FLASH_MESSAGE, CLEAR_CURRENT_FLASH_MESSAGE } from "../actions/types";

const initialState = {
  message: null,
  className: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FLASH_MESSAGE:
      return action.payload;

    case CLEAR_CURRENT_FLASH_MESSAGE:
      return {
        ...state,
        message: null, //here we set the stock to null
        className: null
      };

    default:
      return state;
  }
};
