import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Help from "./components/help/Help";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

import "./App.css";

// Check for token for every single page request
//find jwttoken in chrome developer tool in Local Storage where key is jwtToken and value Bearer-----so on
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //decoded.exp => in object its has exp value if this exp value is less then the currentTime so we logout the user and redirect user to the /login
    // Logout user
    store.dispatch(logoutUser());

    // Clear current Profile
    store.dispatch(clearCurrentProfile());

    // Redirect to login
    window.location.href = "/login";
  }
}

var NotFound = ({ match }) => (
  <div>Sorry But The Page {match.url} was not found</div>
);

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      isFull: false
    };
  }

  goFull = () => {
    this.setState({ isFull: true });
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="">
              {/*} <Route exact path="/register" component={Register} />*/}
              <Route exact path="/help" component={Help} />

              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
