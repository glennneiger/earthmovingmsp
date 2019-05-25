import React, { Component } from "react";
import Modal from "react-responsive-modal";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import StockActions from "./StockActions";

import Spinner from "../common/Spinner";

import "./css/dashboard.css";

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      querystr: ""
    };

    this.onChange = this.onChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    //here we call the getCurrentProfile when componentDidMount
    //this.props.getCurrentSalesOrder();
    // this.props.getCurrentStock();
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  onChange = e => {
    switch (e.target.name) {
      case "productImage":
        this.setState({ productImage: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };
  onSubmit = () => {
    const { querystr } = this.state;

    console.log(querystr);
    if (querystr) {
      console.log("query string is : " + querystr);
      //  this.props.getAdvSearchInvStock(querystr);
    } else {
      console.log("search something..");
    }
  };

  handleKeyPress = event => {
    const { querystr } = this.state;

    if (event.key == "Enter" && querystr) {
      console.log("enter press here! ");
      console.log("query string is : " + querystr);
      // this.props.getAdvSearchInvStock(querystr);
    }
  };

  render() {
    const { open, querystr } = this.state;
    const { user } = this.props.auth;

    return (
      <div>
        <StockActions />

        <div
          className="main-content-inner"
          style={{ backgroundColor: "#F9F9F9" }}
        >
          <div className="container">
            <div className="row">
              <Modal open={open} onClose={this.onCloseModal} center>
                <div style={{ padding: 15 }}>
                  <h2>This Feature Is Coming Soon !!</h2>
                  <p>
                    Now You Can Easily Manage Your Brand With Earthmovingmsp
                    software
                  </p>
                </div>
              </Modal>
              <div className="col-md-12" style={{ padding: 20 }}>
                <div
                  className="row"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <div class="h-100">
                    <div class="d-flex justify-content-center h-100">
                      <div class="searchbar">
                        <input
                          onKeyPress={this.handleKeyPress}
                          class="search_input"
                          type="text"
                          name="querystr"
                          value={querystr}
                          onChange={this.onChange}
                          placeholder="Search by item code, item name and machine part..."
                        />
                        <a href="#" class="search_icon" onClick={this.onSubmit}>
                          <i class="fa fa-search" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-12">
                <div
                  className="row"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <div className="col-md-5 mt-5 mb-3">
                    <div className="card">
                      <Link to="/">
                        <div className="seo-fact sbg1">
                          <div className="p-4 d-flex justify-content-between align-items-center">
                            <div className="seofct-icon">
                              <i className="ti-dropbox" />
                              Inventory
                            </div>
                          </div>

                          <p style={{ paddingLeft: 20, color: "#fff" }}>
                            Total Inventory : <span>2500</span>
                          </p>
                          <p style={{ padding: 20, color: "#fff" }}>
                            Inventory Cost : <span>50 Lac &#8377;</span>
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-5 mt-5 mb-3">
                    <div className="card">
                      <Link to="/">
                        <div className="seo-fact sbg2">
                          <div className="p-4 d-flex justify-content-between align-items-center">
                            <div className="seofct-icon">
                              <i className="ti-wallet" />
                              Sales
                            </div>
                          </div>

                          <p style={{ paddingLeft: 20, color: "#fff" }}>
                            Total Sales : <span>25 Lac &#8377;</span>
                          </p>
                          <p style={{ padding: 20, color: "#fff" }}>
                            Total Return : <span>5 Lac &#8377;</span>
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <div className="col-md-5 mt-5 mb-3">
                    <div className="card">
                      <Link to="/">
                        <div className="seo-fact sbg3">
                          <div className="p-4 d-flex justify-content-between align-items-center">
                            <div className="seofct-icon">
                              <i class="fa fa-building" />
                              Warehouse
                            </div>
                          </div>

                          <p style={{ paddingLeft: 20, color: "#fff" }}>
                            Total Warehouses : <span>20</span>
                          </p>
                          <p style={{ padding: 20, color: "#fff" }}>
                            Total Invoice : <span>550 &#8377;</span>
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>

                  <div className="col-md-5 mt-5 mb-3">
                    <div className="card">
                      <Link to="/">
                        <div className="seo-fact sbg4">
                          <div className="p-4 d-flex justify-content-between align-items-center">
                            <div className="seofct-icon">
                              <i class="fa fa-bank" />
                              Accounts
                            </div>
                          </div>

                          <p style={{ paddingLeft: 20, color: "#fff" }}>
                            Credit Note : <span>2.5 Lac &#8377;</span>
                          </p>
                          <p style={{ padding: 20, color: "#fff" }}>
                            Debit Note : <span>7.5 Lac &#8377;</span>
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {}
)(withRouter(Dashboard));
