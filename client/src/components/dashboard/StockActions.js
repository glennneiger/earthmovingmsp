import React, { Component } from "react";

import Modal from "react-responsive-modal";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import {
  sendFlashMessage,
  clearcurrentFlashMessage
} from "../../actions/flashMessage";

import { clearCurrentProfile } from "../../actions/profileActions";

import "./css/stockactions.css";

import authorizeroles from "../../reactauthroles/authorizeroles";

class StockActions extends Component {
  constructor() {
    super();
    this.state = {
      open: false,
      errors: {}
    };
  }
  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      //here test the errors property (if there is an errors )

      this.setState({ errors: nextProps.errors });
    }
  }

  onclearflashmessageClick(id) {
    this.props.clearcurrentFlashMessage();
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { open, errors } = this.state; //the errors state is set in componentWillReceiveProps from the redux error reducer at store and used in this Login Component

    const { message, className } = this.props.flashMessage;

    const { isAuthenticated, user } = this.props.auth;

    return (
      <div className="header-area header-bottom">
        <div className="container">
          <Modal open={open} onClose={this.onCloseModal} center>
            <div style={{ padding: 15 }}>
              <h2>This Feature Is Coming Soon !!</h2>
              <p>
                Now You Can Easily Manage Your Brand With Earthmovingmsp
                software
              </p>
            </div>
          </Modal>

          <div className="row align-items-center">
            <div className="col-md-12  d-none d-md-block">
              <div className="horizontal-menu">
                <nav>
                  <ul id="nav_menu">
                    <li className="active">
                      <Link to="/">
                        <i className="ti-home" />
                        <span>Home</span>
                      </Link>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="ti-dropbox" />
                        <span>Inventory</span>
                      </a>
                      <ul className="submenu">
                        {user.role == authorizeroles.superadminrodleid ? (
                          <li>
                            <Link to="/create-stock" className="nav-link">
                              <span>Add New Stock</span>
                            </Link>
                          </li>
                        ) : (
                          <span />
                        )}

                        <li>
                          <Link to="/view-stock" className="nav-link">
                            <span>View Stock</span>
                          </Link>
                        </li>

                        <li>
                          <Link to="/stock-transfer" className="nav-link">
                            <span>Warehouse Transfer</span>
                          </Link>
                        </li>
                        <li className="active">
                          <a href="javascript:void(0)">
                            <i className="ti-receipt" />
                            <span>History</span>
                          </a>
                          <ul className="submenuinsideli">
                            <li>
                              <Link
                                to="/existing-stock-history"
                                className="nav-link"
                              >
                                <span>Existing Stocks</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/new-stock-history"
                                className="nav-link"
                              >
                                <span>New Stocks</span>
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="/warehouse-transfer-history"
                                className="nav-link"
                              >
                                <span>Warehouse Transfer</span>
                              </Link>
                            </li>
                          </ul>
                        </li>

                        <li>
                          <Link
                            to="/product-barcode-generator"
                            className="nav-link"
                          >
                            <span>Advanced Search</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="javascript:void(0)">
                        <i className="ti-wallet" />
                        <span>Billing</span>
                      </a>
                      <ul className="submenu">
                        <li>
                          <a
                            href="javascript:void(0)"
                            onClick={this.onOpenModal}
                          >
                            <span>Create Invoice</span>
                          </a>
                        </li>

                        <li>
                          <a
                            href="javascript:void(0)"
                            onClick={this.onOpenModal}
                          >
                            <span>View Invoice</span>
                          </a>
                        </li>
                      </ul>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <i className="ti-layout-sidebar-left" />
                        <span>Report</span>
                      </a>
                      <ul className="submenu">
                        <li>
                          <a
                            href="javascript:void(0)"
                            onClick={this.onOpenModal}
                          >
                            <span>Billing Report</span>
                          </a>
                        </li>

                        <li>
                          <a
                            href="javascript:void(0)"
                            onClick={this.onOpenModal}
                          >
                            <span>Inventory Report</span>
                          </a>
                        </li>
                      </ul>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <i className="ti-settings" />
                        <span>Setting</span>
                      </a>
                      <ul className="submenu">
                        <li>
                          <Link to="/warehouse-setting" className="nav-link">
                            <span>Warehouse Setting</span>
                          </Link>
                        </li>

                        <li>
                          <a
                            href="javascript:void(0)"
                            onClick={this.onOpenModal}
                          >
                            <span>Company Setting</span>
                          </a>
                        </li>
                        <li>
                          <a
                            href="javascript:void(0)"
                            onClick={this.onOpenModal}
                          >
                            <span>Personal A/C Setting</span>
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
            <div className="col-lg-3 clearfix">
              {/*<div className="search-box">
                <form action="#">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    required
                  />
                  <i className="ti-search" />
                </form>
              </div>
              */}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row align-items-center">
            <div className="mobile_menu">
              <div
                id="accordionmenu"
                class="according accordion-s2 gradiant-bg"
              >
                <div className="container">
                  <br />
                  <a
                    className="card-body collapsed"
                    data-toggle="collapse"
                    href="#accordion51"
                    aria-expanded="false"
                    style={{ color: "#B20000", border: "1px solid grey" }}
                  >
                    Menu
                  </a>
                </div>
                <div
                  id="accordion51"
                  class="collapse"
                  data-parent="#accordionmenu"
                >
                  <div className="container" style={{ padding: "25px" }}>
                    <ul>
                      <li>
                        <h4>Inventory</h4>
                        <Link to="/create-stock">Add New Stock</Link>
                        <br />

                        <Link to="/view-stock">View Stock</Link>

                        <br />

                        <Link to="/stock-transfer">Warehouse Transfer</Link>
                        <br />
                      </li>
                      <li>
                        <h4>History</h4>
                        <Link to="/existing-stock-history">
                          Existing Stock History
                        </Link>
                        <br />

                        <Link to="/new-stock-history">New Stock History</Link>

                        <br />

                        <Link to="/warehouse-transfer-history">
                          Warehouse Transfer History
                        </Link>
                        <br />
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
          <span />
        )}
      </div>
    );
  }
}

StockActions.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  //map the property of cartsessionAction component via propTypes
  errors: PropTypes.object.isRequired, //errors is also property of this component
  flashMessage: PropTypes.object.isRequired,
  clearcurrentFlashMessage: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  flashMessage: state.flashMessage
});

export default connect(
  mapStateToProps,
  {
    logoutUser,
    clearcurrentFlashMessage
  }
)(StockActions);
