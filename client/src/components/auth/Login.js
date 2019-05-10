import React, { Component } from "react";
import PropTypes from "prop-types";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    //if isAuthenticated is TRUE so redirect the user to /dashboard
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    //after recieving the props from the authreducer following condition check
    if (nextProps.auth.isAuthenticated) {
      //if isAuthenticated is true mean !isEmpty(action.payload) where payload is full or has user data so its true from the authReducer.js //then we redirect to dashboard
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      //here test the errors property (if there is an errors )

      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };

    //  console.log(user);
    this.props.loginUser(userData); //here we call the loginUser action
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state; //the errors state is set in componentWillReceiveProps from the redux error reducer at store and used in this Login Component

    return (
      <div
        className="login"
        style={{
          backgroundColor: "#fff",
          paddingBottom: 50,
          paddingTop: 50
        }}
      >
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
                  <h5 class="card-title text-center">Login</h5>
                  <p className="lead text-center" style={{ fontSize: "14px" }}>
                    Sign in to your Account
                  </p>
                  <br />
                  <form onSubmit={this.onSubmit}>
                    <div class="form-group">
                      <label for="exampleInputEmail1">Email address</label>
                      <TextFieldGroup
                        placeholder="Email Address"
                        name="email"
                        type="email"
                        value={this.state.email}
                        onChange={this.onChange}
                        error={errors.email}
                      />
                    </div>

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

                    <div class="form-row">
                      <div class="form-group col-md-12">
                        <input
                          style={{ backgroundColor: "#0085C3" }}
                          type="submit"
                          value="Log in"
                          className="btn btn-info btn-block mt-4 "
                        />
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group col-md-12">
                        <Link
                          to="/forgot-password"
                          style={{ color: "#0085C3" }}
                        >
                          Forgot your password?
                        </Link>
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
      </div>
    );
  }
}

Login.propTypes = {
  //map the property of Login component via propTypes
  loginUser: PropTypes.func.isRequired, //loginUser is an action but also the property of this component
  auth: PropTypes.object.isRequired, //auth is also property of this component
  errors: PropTypes.object.isRequired //errors is also property of this component
};

const mapStateToProps = state => ({
  //here map the auth (state.auth) from the root reducer (from store.js) where in combineReducer auth : authReducer similarly for errors
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
