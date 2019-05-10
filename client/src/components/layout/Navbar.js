import React, { Component } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

import Spinner from "../common/Spinner";

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartstockdtall: []
    };
  }

  componentDidMount() {
    // this.props.getCurrentSessionProducts();

    {
      /*} axios
      .get("/api/cart")
      .then(response => {
        const cartstockdtall = response.data.sessioncart;
        console.log(response);
        this.setState({ cartstockdtall });

        console.log(cartstockdtall.length);
      })
      .catch(error => {
        console.log(error);
      });
    */
    }
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile(); //here we call the clearCurrentProfile for clear current user profile state and set to null in profileReducer.js case CLEAR_CURRENT_PROFILE execute
    this.props.logoutUser(); //here we call the logoutUser action
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    //const cartstockdtall = this.state.cartstockdtall;

    const authLinks = (
      <div className="col-md-9 clearfix text-right">
        <div className="d-md-inline-block d-block mr-md-4">
          <ul className="notification-area">
            <li id="full-view">
              <a href="/cartproducts">
                <button
                  type="button"
                  class="btn mb-2"
                  style={{ backgroundColor: "#2C9CB8", color: "#fff" }}
                >
                  My Cart{" "}
                  <span
                    className="badge badge-pill badge-primary"
                    style={{ fontSize: "12px", backgroundColor: "#0085C3" }}
                  >
                    0
                  </span>
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
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    logoutUser,
    clearCurrentProfile
  }
)(Navbar);
