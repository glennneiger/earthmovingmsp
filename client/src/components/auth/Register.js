import React, { Component } from "react";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      mobile: "",
      password: "",
      password2: "",
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
    if (nextProps.errors) {
      //here test the errors property (if there is an errors ) received from the store then it will set to errors state of this component
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit(e) {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      mobile: this.state.mobile,
      password: this.state.password,
      password2: this.state.password2
    };

    this.props.registerUser(newUser, this.props.history); //this.props.history => this allows to do redirect functionality in registerUser -> this action for this we use withRouter when we export class component
  }

  render() {
    const { errors } = this.state; //here pulling out the all the errors in errors object

    return (
      <div
        className="register"
        style={{
          backgroundColor: "#fff",
          paddingBottom: 50,
          paddingTop: 50
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-md-5 m-auto">
              <div class="card" style={{ backgroundColor: "#ececec" }}>
                <div class="card-body">
                  <h5 class="card-title text-center">Sign Up</h5>
                  <p className="lead text-center" style={{ fontSize: "14px" }}>
                    Create your account with Earthmovingmsp Software
                  </p>
                  <br />

                  <form noValidate onSubmit={this.onSubmit}>
                    <TextFieldGroup
                      placeholder="Name"
                      name="name"
                      value={this.state.name}
                      onChange={this.onChange}
                      error={errors.name}
                    />
                    <TextFieldGroup
                      placeholder="Email"
                      name="email"
                      type="email"
                      value={this.state.email}
                      onChange={this.onChange}
                      error={errors.email}
                      info="This site uses Gravatar so if you want a profile image, use a Gravatar email"
                    />
                    <TextFieldGroup
                      placeholder="Mobile"
                      name="mobile"
                      type="number"
                      value={this.state.mobile}
                      onChange={this.onChange}
                      error={errors.mobile}
                    />
                    <TextFieldGroup
                      placeholder="Password"
                      name="password"
                      type="password"
                      value={this.state.password}
                      onChange={this.onChange}
                      error={errors.password}
                    />
                    <TextFieldGroup
                      placeholder="Confirm Password"
                      name="password2"
                      type="password"
                      value={this.state.password2}
                      onChange={this.onChange}
                      error={errors.password2}
                    />
                    <input
                      style={{ backgroundColor: "#0085C3" }}
                      type="submit"
                      className="btn btn-info btn-block mt-4"
                    />
                  </form>
                  <br />
                  <p style={{ fontSize: "12px" }}>
                    Already Sign up with Earthmovingmsp Software ? ?
                    <Link to="/login"> Login</Link>
                  </p>
                </div>
              </div>

              <div class="card-body" style={{ backgroundColor: "#0085C3" }}>
                <a
                  href="#"
                  class="card-link"
                  style={{ color: "white", fontSize: "12px" }}
                >
                  <b style={{ fontWeight: 900 }}>. </b>
                  privacy policy
                </a>
                <a
                  href="#"
                  class="card-link"
                  style={{ color: "white", fontSize: "12px" }}
                >
                  <b style={{ fontWeight: 900 }}>. </b> security
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Register.propTypes = {
  //map the property of Register component via propTypes
  registerUser: PropTypes.func.isRequired, //registerUser is an action but also the property of this component
  auth: PropTypes.object.isRequired, //auth is also property of this component
  errors: PropTypes.object.isRequired //errors is also property of this component
};

const mapStateToProps = state => ({
  //here map the auth (state.auth) from the root reducer (from store.js) where in combineReducer auth : authReducer similarly for errors
  auth: state.auth,
  errors: state.errors
});

export default connect(
  //connect is used to connect with redux
  mapStateToProps,
  { registerUser }
)(withRouter(Register));
