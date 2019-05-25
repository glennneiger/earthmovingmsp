import React, { Component } from "react";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";

class Landing extends Component {
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }
  render() {
    return (
      <div className="landing" style={{ paddingTop: "25%" }}>
        <div className="">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1 className="mb-4">Earthmoving Msp Solution</h1>
                <p className="lead" style={{ fontStyle: "italic" }}>
                  {" "}
                  CLOUD BASED INVENTORY &amp; BILLING SOFTWARE
                </p>
                <hr />
                {/*}  <Link
                  to="/register"
                  className="btn btn-lg mr-2"
                  style={{ backgroundColor: "#a60808", color: "white" }}
                >
                  Sign Up
    </Link>*/}
                <Link
                  to="/login"
                  className="btn btn-lg"
                  style={{ backgroundColor: "#007DB8", color: "#fff" }}
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Landing.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(Landing);
