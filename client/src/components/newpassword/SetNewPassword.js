import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  loginUser,
  resetpassword,
  saveResetPassword
} from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

import {
  sendFlashMessage,
  clearcurrentFlashMessage
} from "../../actions/flashMessage";

class SetNewPassword extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      confirmpassword: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    //if isAuthenticated is TRUE so redirect the user to /dashboard

    this.props.resetpassword(this.props.match.params.token);
    console.log(this.props.match.params.token);
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    //after recieving the props from the authreducer following condition check
    if (nextProps.auth.resetpassworddata.email) {
      this.setState({ email: nextProps.auth.resetpassworddata.email });
    }
    if (nextProps.auth.isAuthenticated) {
    }

    if (nextProps.errors) {
      //here test the errors property (if there is an errors )

      this.setState({ errors: nextProps.errors });
    }
  }

  onclearflashmessageClick(id) {
    this.props.clearcurrentFlashMessage();
  }

  onSubmit(e) {
    e.preventDefault();

    const { email, password, confirmpassword } = this.state;

    console.log("resetpassworddata email is :" + email);
    const userresetpassData = {
      email: this.state.email,
      password: this.state.password,
      confirmpassword: this.state.confirmpassword
    };

    if (password == "" || confirmpassword == "") {
      alert("password field cannot be blank");
    } else if (password != confirmpassword) {
      alert("password do not match with confirm password!!");
    }

    if (
      !password == "" &&
      !confirmpassword == "" &&
      password == confirmpassword
    ) {
      console.log(userresetpassData);
      this.props.saveResetPassword(userresetpassData, this.props.history);
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state; //the errors state is set in componentWillReceiveProps from the redux error reducer at store and used in this Login Component

    const { message, className } = this.props.flashMessage;

    const { resetpassworddata, isAuthenticated } = this.props.auth;
    return (
      <div
        className="setnewpassword"
        style={{
          backgroundColor: "#fff",
          paddingBottom: 50,
          paddingTop: 50
        }}
      >
        {message && className ? (
          <div className="container">
            <br />
            <div className="row">
              <div
                class={
                  "col-md-12 alert" +
                  " " +
                  className +
                  " " +
                  "alert-dismissible"
                }
              >
                <a
                  onClick={this.onclearflashmessageClick.bind(this)}
                  href="javascript:void(0)"
                  class="close"
                  data-dismiss="alert"
                  aria-label="close"
                >
                  &times;
                </a>
                <strong> {message}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div />
        )}

        {resetpassworddata.email && (
          <div className="container">
            <div className="row">
              <div className="col-md-4 m-auto">
                <br />
                <div class="card" style={{ backgroundColor: "#ececec" }}>
                  <img
                    class="card-img-top"
                    src="/img/nvooslogingif.gif"
                    alt="Card image cap"
                  />
                  <div class="card-body">
                    <h5 class="card-title text-center">Set New Password</h5>
                    <p
                      className="lead text-center"
                      style={{ fontSize: "14px" }}
                    >
                      set your new password
                    </p>
                    <br />
                    <form onSubmit={this.onSubmit}>
                      <div class="form-group">
                        <label for="exampleInputpassword">Password</label>
                        <TextFieldGroup
                          placeholder="Password"
                          name="password"
                          type="password"
                          value={this.state.password}
                          onChange={this.onChange}
                          error={errors.password}
                        />
                      </div>
                      <div class="form-group">
                        <label for="exampleInputpassword">
                          Confirm Password
                        </label>
                        <TextFieldGroup
                          placeholder="Confirm Password"
                          name="confirmpassword"
                          type="password"
                          value={this.state.confirmpassword}
                          onChange={this.onChange}
                          error={errors.confirmpassword}
                        />
                      </div>

                      <div class="form-row">
                        <div class="form-group col-md-12">
                          <input
                            style={{ backgroundColor: "#0085C3" }}
                            type="submit"
                            value="Reset"
                            className="btn btn-info btn-block mt-4 "
                          />
                        </div>
                      </div>
                    </form>

                    {/*} <p style={{ fontSize: "12px" }}>
                    New to Vawalk ? ?{" "}
                    <a href="http://vawalk.com" target="_blank">
                      {" "}
                      vawalk.com
                    </a>
                  </p>
    */}
                  </div>

                  <div class="card-body" style={{ backgroundColor: "#0085C3" }}>
                    <Link
                      to="/help"
                      class="card-link"
                      style={{ color: "white", fontSize: "12px" }}
                    >
                      <b style={{ fontWeight: 900 }}>. </b>
                      Help
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

SetNewPassword.propTypes = {
  //map the property of Login component via propTypes
  loginUser: PropTypes.func.isRequired, //loginUser is an action but also the property of this component
  resetpassword: PropTypes.func.isRequired,
  saveResetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired, //auth is also property of this component
  errors: PropTypes.object.isRequired, //errors is also property of this component
  flashMessage: PropTypes.object.isRequired,
  clearcurrentFlashMessage: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  //here map the auth (state.auth) from the root reducer (from store.js) where in combineReducer auth : authReducer similarly for errors
  auth: state.auth,
  errors: state.errors,
  flashMessage: state.flashMessage
});

export default connect(
  mapStateToProps,
  { loginUser, resetpassword, clearcurrentFlashMessage, saveResetPassword }
)(SetNewPassword);
