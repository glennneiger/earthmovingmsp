import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import warehouseReducer from "./warehouseReducer";

import stockReducer from "./stockReducer";
import warehousetransferReducer from "./warehousetransferReducer";

import messageReducer from "./reducer_message";

export default combineReducers({
  auth: authReducer, //the auth object is display in redux chrome extention from taking the object state from authReducer
  errors: errorReducer, //the errors object is display in redux chrome extention from taking the object state from errorReducer
  flashMessage: messageReducer,
  profile: profileReducer,
  stock: stockReducer,
  warehouse: warehouseReducer,
  warehousetransfer: warehousetransferReducer
});
