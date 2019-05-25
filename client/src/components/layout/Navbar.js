import React, { Component } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

import { getCurrentSessionProducts } from "../../actions/cartsessionAction";
import Spinner from "../common/Spinner";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartstockdtall: [],
      cartitemlength: ""
    };
  }

  componentDidMount() {
    this.props.getCurrentSessionProducts();

    axios
      .get("/api/cart")
      .then(response => {
        const cartitemlength = response.data.length;
        console.log(response);
        this.setState({ cartitemlength });

        console.log("cart item length is : " + cartitemlength);
      })
      .catch(error => {
        console.log(error);
      });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.sessioncart.sessioncart) {
      this.setState({
        cartitemlength: nextProps.sessioncart.sessioncart.length
      });
      console.log("cart lenggggggggggth is :" + this.state.cartitemlength);
    }
  }
  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile(); //here we call the clearCurrentProfile for clear current user profile state and set to null in profileReducer.js case CLEAR_CURRENT_PROFILE execute
    this.props.logoutUser(); //here we call the logoutUser action
  }

  render() {
    const { cartitemlength } = this.state;
    const { isAuthenticated, user } = this.props.auth;
    //const cartstockdtall = this.state.cartstockdtall;

    const { sessioncart, loading, testpurpose } = this.props.sessioncart;
    //console.log(testpurpose);
    let sessioncartContent;

    var count = 0;

    if (!sessioncart) {
      sessioncartContent = 0;
      // console.log("Recent session cart is" + sessioncartContent);
    } else {
      // Check if logged in user has stock data

      // console.log("Recent session cart is" + sessioncart);

      if (Object.keys(sessioncart).length > 0) {
        // console.log(Object.keys(sessioncart).length);
        //here if there are stock in db

        sessioncartContent = Object.keys(sessioncart).length;
      }
    }

    const authLinks = (
      <div className="col-md-9 clearfix text-right">
        <div className="d-md-inline-block d-block mr-md-4">
          <ul className="notification-area">
            <li id="full-view">
              <a href="/cartproducts" target="_blank">
                <button
                  type="button"
                  class="btn mb-2"
                  style={{ backgroundColor: "#2C9CB8", color: "#fff" }}
                >
                  <i class="fa fa-shopping-cart" aria-hidden="true" /> Order
                  Cart{" "}
                  {/*}  <span
                    className="badge badge-pill badge-primary"
                    style={{ fontSize: "12px", backgroundColor: "#0085C3" }}
                  >
                    {cartitemlength && cartitemlength}
                  </span>
    */}
                  <span class="sr-only">unread messages</span>
                </button>
              </a>
            </li>
          </ul>
        </div>
        <div className="clearfix d-md-inline-block d-block">
          <div className="user-profile m-0">
            <img
              className="avatar user-thumb"
              src="/assets/images/author/avatar.png"
              alt="avatar"
            />
            <h4 className="user-name dropdown-toggle" data-toggle="dropdown">
              {user.name} <i className="fa fa-angle-down" />
            </h4>
            <div className="dropdown-menu">
              <a
                className="dropdown-item"
                href="#"
                onClick={this.onLogoutClick.bind(this)}
              >
                <img
                  className="rounded-circle"
                  src={user.avatar} //user obj stored in auth obj
                  alt={user.name}
                  style={{ width: "25px", marginRight: "5px" }}
                  title="You must have a Gravatar connected to your email to display an image"
                />{" "}
                <span style={{ color: "red" }}>Logout</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    );

    const guestLinks = (
      /* <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Sign Up
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            Login
          </Link>
        </li>
      </ul>*/
      <ul className="navbar-nav ml-auto">
        <li className="nav-item" />
      </ul>
    );

    return (
      <div className="mainheader-area">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-3">
              <div className="logo">
                <Link className="nav-link" to="/">
                  <img src="/assets/images/icon/logo2.png" alt="logo" />
                </Link>
              </div>
            </div>

            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      </div>
    );
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  sessioncart: PropTypes.object.isRequired,
  getCurrentSessionProducts: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  sessioncart: state.sessioncart
});

export default connect(
  mapStateToProps,
  {
    logoutUser,
    clearCurrentProfile,
    getCurrentSessionProducts
  }
)(Navbar);
