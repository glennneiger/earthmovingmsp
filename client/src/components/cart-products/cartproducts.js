import React, { Component } from "react";

import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";

import "../dashboard/css/viewstock.css";

import { CSVLink } from "react-csv";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

import { clearCurrentStock } from "../../actions/stockActions";

import { deleteStock } from "../../actions/stockActions";
import { singleprodstockbyid } from "../../actions/stockActions";

import { getCurrentProfile } from "../../actions/profileActions";
import { getCurrentStock } from "../../actions/stockActions";

import { getCurrentSessionProducts } from "../../actions/cartsessionAction";
import { addproducttosession } from "../../actions/cartsessionAction";
import { productincby1insession } from "../../actions/cartsessionAction";
import { productdecby1insession } from "../../actions/cartsessionAction";

import { productdeletebyidinsession } from "../../actions/cartsessionAction";

import StockActions from "../dashboard/StockActions";
import Spinner from "../common/Spinner";

import { clearSessionCart } from "../../actions/cartsessionAction";

import { sendFlashMessage } from "../../actions/flashMessage";

import SalesOrder from "../../components/sales-order/SalesOrder";

import Moment from "react-moment";

class CartProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartstockdtall: [],
      actionadd: "add",
      actiondec: "dec",
      actiondelete: "delete"
    };
  }

  componentDidMount() {
    this.props.getCurrentSessionProducts();

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

  onCartProIncBy1Click(id, actionadd) {
    //console.log(id);
    //console.log("cart operation type : " + actionadd);

    var flashresult = this.props.productincby1insession(
      id,
      actionadd,
      this.props.history
    );
    //console.log(flashresult);

    {
      /* if (flashresult === undefined) {
      console.log("Your Cart Product Inc By 1");
      this.props.sendFlashMessage(
        "Your Cart Product Inc By 1",
        "alert-success"
      );
    }
  */
    }
  }

  onCartProDecBy1Click(id, actiondec) {
    // console.log(id);
    //console.log("cart operation type : " + actiondec);

    var flashresult = this.props.productdecby1insession(
      id,
      actiondec,
      this.props.history
    );

    {
      /*} if (flashresult === undefined) {
      // console.log("Your Cart Product Dec By 1");
      this.props.sendFlashMessage(
        "Your Cart Product Dec By 1",
        "alert-warning"
      );
    }
  */
    }
  }

  onCartProDeleteClick(id, actiondelete) {
    //  console.log(id);
    //console.log("cart operation type : " + actiondelete);

    var flashresult = this.props.productdeletebyidinsession(
      id,
      actiondelete,
      this.props.history
    );

    {
      /*} if (flashresult === undefined) {
      // console.log("Your Cart Product Is Deleted");
      this.props.sendFlashMessage(
        "Your Cart Product Is Deleted",
        "alert-danger"
      );
    }
  */
    }
  }
  clearSessionCartClick() {
    var flashresult = this.props.clearSessionCart(this.props.history);
    {
      /* if (flashresult === undefined) {
      // console.log("Your Cart Product Is Deleted");
      this.props.sendFlashMessage(
        "Your Cart Clear Successfully",
        "alert-success"
      );
    }
  */
    }
  }

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile(); //here we call the clearCurrentProfile for clear current user profile state and set to null in profileReducer.js case CLEAR_CURRENT_PROFILE execute
    this.props.clearCurrentStock();
    this.props.logoutUser(); //here we call the logoutUser action
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    //const cartstockdtall = this.state.cartstockdtall;

    const cartstockdtall = this.state.cartstockdtall;

    //const cartstockdtalllen = cartstockdtall.length;

    const { sessioncart, loading, testpurpose } = this.props.sessioncart;
    // console.log(testpurpose);
    let sessioncartContent;
    var total = 0;

    let cartContent;

    if (!sessioncart || loading) {
      //console.log("Recent session cart is" + sessioncart);
      sessioncartContent = 0;

      cartContent = (
        <div>
          <p>Sorry, No Product in your cart</p>
          <Link to="/new-order" className="btn btn-sm btn-info">
            Order New
          </Link>
        </div>
      );
    } else {
      // Check if logged in user has stock data

      //  console.log("Recent session cart is" + sessioncart);

      if (Object.keys(sessioncart).length > 0) {
        // console.log(Object.keys(sessioncart).length);
        //here if there are stock in db

        sessioncartContent = Object.keys(sessioncart).length;
      }

      if (Object.keys(sessioncart).length > 0) {
        //here if there are stock in db
        cartContent = (
          <div>
            {/*   <p className="lead text-muted">congo you have products in cart</p>
             */}
            <table class="table table-striped alignmiddle">
              <tr>
                <th>Available CTN</th>
                <th>Image</th>
                <th>Article</th>
                <th>Color</th>
                <th>Price</th>
                <th>Quantity</th>
                <th />
                <th>Subtotal</th>
              </tr>
              {sessioncart.map((cartsnstock, i) => {
                var subtotal = parseFloat(
                  cartsnstock.qty * cartsnstock.prodmrp
                ).toFixed(2);

                total += +subtotal;

                // console.log("Entered");
                // Return the element. Also pass key
                return (
                  <tr key={i}>
                    <td>{cartsnstock.totalctn}</td>
                    <td>
                      <img
                        class="cpi"
                        width="100px"
                        src={cartsnstock.productImage}
                      />
                    </td>
                    <td>{cartsnstock.articlenum}</td>
                    <td>{cartsnstock.prodcolor}</td>
                    <td>{cartsnstock.prodmrp}</td>
                    <td>{cartsnstock.qty}</td>
                    <td>
                      <a
                        href="javascript:void(0)"
                        onClick={e =>
                          this.onCartProIncBy1Click(
                            cartsnstock._id,
                            this.state.actionadd
                          )
                        }
                      >
                        +
                      </a>
                      &nbsp;
                      <a
                        href="javascript:void(0)"
                        onClick={e =>
                          this.onCartProDecBy1Click(
                            cartsnstock._id,
                            this.state.actiondec
                          )
                        }
                      >
                        -
                      </a>
                      &nbsp;
                      <a
                        href="javascript:void(0)"
                        onClick={e =>
                          this.onCartProDeleteClick(
                            cartsnstock._id,
                            this.state.actiondelete
                          )
                        }
                      >
                        Delete
                      </a>
                      &nbsp;
                    </td>
                    <td>{subtotal}</td>
                  </tr>
                );
              })}
            </table>
          </div>
        );
      }
    }

    return (
      <div>
        <StockActions />
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">CartProducts</li>
        </ol>

        <div className="col-12 row">
          <div className="col-12">
            <center>
              <div class="panel panel-default">
                <div
                  class="panel-heading"
                  style={{ backgroundColor: "#a60808", maxWidth: "800px" }}
                >
                  <div className="row">
                    <div class="col-7">
                      <h5
                        style={{
                          padding: "10px",
                          color: "#fff",
                          fontSize: "18px",
                          textAlign: "right"
                        }}
                      >
                        CartProducts
                      </h5>
                    </div>
                    <div class="col-5">
                      {!sessioncartContent ? (
                        <span />
                      ) : (
                        <span>
                          <h5
                            style={{
                              padding: "10px",
                              color: "#fff",
                              fontSize: "18px",
                              textAlign: "right"
                            }}
                          >
                            <a
                              className="btn btn-sm"
                              href="javascript:void(0)"
                              onClick={e => this.clearSessionCartClick()}
                              style={{
                                backgroundColor: "#252525",
                                color: "#fff"
                              }}
                            >
                              CLEAR CART
                            </a>
                          </h5>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  class="panel-heading"
                  style={{ backgroundColor: "#e6e6e6", maxWidth: "800px" }}
                >
                  {" "}
                  <div
                    style={{
                      padding: "10px",
                      color: "#fff",
                      textAlign: "right"
                    }}
                  >
                    <div className="row">
                      <div class="col-6">
                        <h5
                          style={{
                            padding: "7px",
                            color: "#fff",
                            fontSize: "18px",
                            textAlign: "left"
                          }}
                        >
                          <Link
                            to="/new-order"
                            className="btn btn-sm btn-warning"
                            style={{
                              color: "#fff",
                              backgroundColor: "goldenrod"
                            }}
                          >
                            Continue Shopping
                          </Link>
                        </h5>
                      </div>
                      <div class="col-6">
                        <div
                          style={{
                            padding: "7px",
                            fontSize: "20px",
                            textAlign: "right"
                          }}
                        >
                          <p>
                            {!sessioncartContent ? (
                              <span>
                                <p> Cart Item: 0</p>
                              </span>
                            ) : (
                              <span>
                                <p> Cart Item: {sessioncartContent}</p>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="panel-body"
                  style={{
                    backgroundColor: "#fff",
                    maxWidth: "800px",
                    minHeight: "500px",
                    overflowY: "auto"
                  }}
                >
                  <div>
                    <div>
                      <h4>Cart Information</h4>
                      {cartContent}
                      <br />

                      <div
                        class="panel-footer"
                        style={{
                          backgroundColor: "#a60808",
                          maxWidth: "800px"
                        }}
                        align="right"
                      >
                        <h5
                          style={{
                            padding: "7px",
                            color: "#fff",
                            fontSize: "14px"
                          }}
                        >
                          <b>Grand Total:</b> {parseFloat(total).toFixed(2)}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <br />
                  <div>
                    {!sessioncartContent ? (
                      <span />
                    ) : (
                      <span>
                        <SalesOrder grandtotal={parseFloat(total).toFixed(2)} />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </center>
          </div>
        </div>
      </div>
    );
  }
}

CartProducts.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentStock: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  stock: PropTypes.object.isRequired,
  deleteStock: PropTypes.func.isRequired,

  sessioncart: PropTypes.object.isRequired,
  getCurrentSessionProducts: PropTypes.object.isRequired,
  addproducttosession: PropTypes.object.isRequired,
  productincby1insession: PropTypes.object.isRequired,
  productdecby1insession: PropTypes.object.isRequired,
  productdeletebyidinsession: PropTypes.object.isRequired,
  clearSessionCart: PropTypes.object.isRequired,
  sendFlashMessage: PropTypes.object.isRequired
};

const mapPropsToDispatch = dispatch => {
  return bindActionCreators({ sendFlashMessage }, dispatch);
};

const mapStateToProps = state => ({
  profile: state.profile,
  stock: state.stock,
  auth: state.auth,
  sessioncart: state.sessioncart
});
export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    getCurrentStock,
    deleteStock,
    singleprodstockbyid,
    logoutUser,
    clearCurrentProfile,
    clearCurrentStock,
    getCurrentSessionProducts,
    addproducttosession,
    productincby1insession,
    productdecby1insession,
    productdeletebyidinsession,
    clearSessionCart,
    sendFlashMessage,
    mapPropsToDispatch
  }
)(CartProducts);
