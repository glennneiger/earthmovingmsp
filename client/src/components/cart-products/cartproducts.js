import React, { Component } from "react";

import Table from "react-table";
import "react-table/react-table.css";
import axios from "axios";

import "../dashboard/css/viewstock.css";

import { CSVLink } from "react-csv";

import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { bindActionCreators } from "redux";

import {
  getCurrentSessionProducts,
  productincby1insession,
  productdecby1insession,
  productdeletebyidinsession,
  clearSessionCart,
  updateeditedcart
} from "../../actions/cartsessionAction";

import StockActions from "../dashboard/StockActions";
import Spinner from "../common/Spinner";

import { sendFlashMessage } from "../../actions/flashMessage";

import Moment from "react-moment";

import "./cartproduct.css";

class CartProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cartstockdtall: [],
      actionadd: "add",
      actiondec: "dec",
      actiondelete: "delete",
      editing: null
    };
    this.renderEditable = this.renderEditable.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentSessionProducts();

    axios
      .get("/api/cart")
      .then(response => {
        const cartstockdtall = response.data;
        console.log(response);
        this.setState({ cartstockdtall });

        console.log(cartstockdtall.length);
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentDidUpdate(prevProps, prevState) {
    const { cartstockdtall } = this.state;
    const { sessioncart } = this.props.sessioncart;
    if (!sessioncart || sessioncart == null) {
      console.log("add few item in your cart");
    } else {
      if (prevProps.sessioncart !== sessioncart) {
        // this.props.getCurrentSessionProducts();
        // console.log("added or update the cart item");
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    /*  if (nextProps.sessioncart) {
      this.setState({ cartstockdtall: nextProps.sessioncart });
    }*/
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

  onCartProDeleteClick(id, prodbillingwarehouse, actiondelete) {
    //  console.log(id);
    //console.log("cart operation type : " + actiondelete);

    var flashresult = this.props.productdeletebyidinsession(
      id,
      prodbillingwarehouse,
      actiondelete,
      this.props.history
    );
    axios
      .get("/api/cart")
      .then(response => {
        const cartstockdtall = response.data;
        console.log(response);
        this.setState({ cartstockdtall });

        console.log(cartstockdtall.length);
      })
      .catch(error => {
        console.log(error);
      });
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

    axios
      .get("/api/cart")
      .then(response => {
        const cartstockdtall = response.data;
        console.log(response);
        this.setState({ cartstockdtall });

        console.log(cartstockdtall.length);
      })
      .catch(error => {
        console.log(error);
      });
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

  onEditClick(id) {
    // this.props.deleteStock(id, this.props.history); //this.props.history => this allows to do redirect functionality in deleteStock -> this action for this we use withRouter when we export class component
  }

  renderEditable(cellInfo) {
    return (
      <div
        style={{ backgroundColor: "#f7f7f7" }}
        contentEditable
        suppressContentEditableWarning
        onBlur={e => {
          const cartstockdtall = [...this.state.cartstockdtall];
          cartstockdtall[cellInfo.index][cellInfo.column.id] =
            e.target.innerHTML;
          this.setState({ cartstockdtall });
        }}
        dangerouslySetInnerHTML={{
          __html: this.state.cartstockdtall[cellInfo.index][cellInfo.column.id]
        }}
      />
    );
  }

  saveFinalCartData() {
    const { cartstockdtall } = this.state;
    const { sessioncart } = this.props.sessioncart;
    if (cartstockdtall) {
      //console.log("final cartstockdtall data is : " + cartstockdtall[0].itemname);
      console.log("final cartstockdtall is : " + typeof cartstockdtall);
      console.log("sessioncart is : " + typeof sessioncart);
      this.props.updateeditedcart(cartstockdtall, this.props.history);
      // this.props.getCurrentSessionProducts();

      axios
        .get("/api/cart")
        .then(response => {
          const cartstockdtall = response.data;
          console.log(response);
          this.setState({ cartstockdtall });

          console.log(cartstockdtall.length);
        })
        .catch(error => {
          console.log(error);
        });
    }
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
          <Link to="/create-invoice" className="btn btn-sm btn-info">
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
                <th>Product Image</th>
                <th>Item Code</th>
                <th>Item length</th>
                <th>Item Width</th>
                <th>Item Height</th>
                <th>Order Quantity</th>
                <th>Billing Warehouse</th>
                <th>Subtotal</th>
                <th />
              </tr>
              {sessioncart.map((cartsnstock, i) => {
                var subtotal = parseFloat(
                  cartsnstock.orderitemquantity * cartsnstock.rate
                ).toFixed(2);

                total += +subtotal;

                // console.log("Entered");
                // Return the element. Also pass key
                return (
                  <tr key={i}>
                    <td style={{ verticalAlign: "center" }}>
                      <img
                        class="cpi"
                        style={{ width: 100, height: "auto" }}
                        src={cartsnstock.itemprimaryimg}
                      />
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {cartsnstock.itemcode}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {cartsnstock.itemlength}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {cartsnstock.itemwidth}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {cartsnstock.itemheight}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {cartsnstock.orderitemquantity}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>
                      {cartsnstock.prodbillingwarehouse}
                    </td>
                    <td style={{ verticalAlign: "middle" }}>{subtotal}</td>
                    <td style={{ verticalAlign: "middle" }}>
                      {/*}   <a
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
                      &nbsp;*/}
                      <a
                        href="javascript:void(0)"
                        onClick={e =>
                          this.onCartProDeleteClick(
                            cartsnstock._id,
                            cartsnstock.prodbillingwarehouse,
                            this.state.actiondelete
                          )
                        }
                      >
                        <i
                          class="fa fa-times-circle"
                          style={{ fontSize: 18 }}
                        />
                      </a>
                      &nbsp;
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        );
      }
    }
    let stockContent;
    let cartstockdtalllen;
    let columns = [];
    if (sessioncart === null) {
      stockContent = <Spinner />;
    } else {
      columns = [
        {
          Header: "Item Image",
          accessor: "itemprimaryimg",
          maxWidth: 200,
          filterable: false,
          Cell: row => (
            <span>
              <center>
                <img
                  style={{ maxWidth: "70px" }}
                  class=""
                  src={row.value}
                  alt="item primary img"
                />
              </center>
            </span>
          )
        },
        {
          Header: "Item Code",
          accessor: "itemcode",
          maxWidth: 200,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Item Name (Edited)",
          accessor: "itemname",
          maxWidth: 300,
          filterable: true,
          Cell: this.renderEditable
        },
        {
          Header: "Item Length",
          accessor: "itemlength",
          maxWidth: 100,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Item Width",
          accessor: "itemwidth",
          maxWidth: 100,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Item Height",
          accessor: "itemheight",
          maxWidth: 100,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Order Quantity",
          accessor: "orderitemquantity",
          maxWidth: 120,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Min Rate",
          accessor: "minrate",
          maxWidth: 120,
          filterable: true,
          Cell: row => (
            <span>
              <center>&#8377; {row.value}</center>
            </span>
          )
        },
        {
          Header: "Max Rate",
          accessor: "maxrate",
          maxWidth: 120,
          filterable: true,
          Cell: row => (
            <span>
              <center>&#8377; {row.value}</center>
            </span>
          )
        },
        {
          Header: "₹ Rate (Edited)",
          accessor: "rate",
          maxWidth: 290,
          filterable: true,
          Cell: this.renderEditable
        },
        {
          Header: "Subtotal",
          accessor: "subtotal",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>&#8377; {row.value}</center>
            </span>
          )
        },
        {
          Header: "Operation",
          columns: [
            {
              Header: "Remove",
              accessor: "forremove",
              maxWidth: 100,
              sortable: false,
              Cell: row => (
                <span>
                  <center>
                    {row.value.map(item => (
                      <i
                        onClick={e =>
                          this.onCartProDeleteClick(
                            item._id,
                            item.prodbillingwarehouse,
                            this.state.actiondelete
                          )
                        }
                        class="fa fa-times-circle"
                        // onClick={this.onEditClick.bind(this, row.value)}
                        style={{
                          color: "red",
                          cursor: "pointer",
                          fontSize: 25
                        }}
                      />
                    ))}
                  </center>
                </span>
              )
            }
          ]
        }
      ];
    }

    return (
      <div>
        <StockActions />
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Cart Products</li>
        </ol>

        <div className="col-12 row">
          <div className="col-12">
            <center>
              <div class="panel panel-default">
                <div
                  class="panel-heading"
                  style={{ backgroundColor: "#0085C3" }}
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
                        Cart Products
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
                  style={{ backgroundColor: "#e6e6e6" }}
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
                            to="/create-invoice"
                            className="btn btn-sm btn-warning"
                            style={{
                              color: "#fff",
                              backgroundColor: "goldenrod"
                            }}
                          >
                            Continue Billing
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
                    minHeight: "500px",
                    overflowY: "auto"
                  }}
                >
                  <div>
                    <div>
                      {/*cartContent*/}
                      {!cartstockdtall && <p>Sorry No Item In Your Cart</p>}
                      {cartstockdtall.length > 0 && (
                        <div>
                          <span>
                            <p>click here to save changes</p>
                            <button
                              onClick={e => this.saveFinalCartData()}
                              class="btn"
                            >
                              <i class="fa fa-floppy-o" /> Save Changes
                            </button>
                          </span>
                          <Table
                            columns={columns}
                            data={cartstockdtall}
                            defaultPageSize={5}
                          />
                        </div>
                      )}
                      <br />

                      <div
                        class="panel-footer"
                        style={{
                          backgroundColor: "#0085C3"
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
                          <b>Grand Total:</b> &#8377;
                          {parseFloat(total).toFixed(2)}
                        </h5>
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
              </div>
            </center>
          </div>
        </div>
        {cartstockdtall.length > 0 && (
          <div className="col-12 row">
            <p>Sales Order Details</p>
          </div>
        )}
      </div>
    );
  }
}

CartProducts.propTypes = {
  auth: PropTypes.object.isRequired,
  sessioncart: PropTypes.object.isRequired,
  getCurrentSessionProducts: PropTypes.object.isRequired,
  productincby1insession: PropTypes.object.isRequired,
  productdecby1insession: PropTypes.object.isRequired,
  productdeletebyidinsession: PropTypes.object.isRequired,
  updateeditedcart: PropTypes.object.isRequired,
  clearSessionCart: PropTypes.object.isRequired,
  sendFlashMessage: PropTypes.object.isRequired
};

const mapPropsToDispatch = dispatch => {
  return bindActionCreators({ sendFlashMessage }, dispatch);
};

const mapStateToProps = state => ({
  auth: state.auth,
  sessioncart: state.sessioncart
});
export default connect(
  mapStateToProps,
  {
    getCurrentSessionProducts,
    productincby1insession,
    productdecby1insession,
    productdeletebyidinsession,
    clearSessionCart,
    updateeditedcart,
    sendFlashMessage,
    mapPropsToDispatch
  }
)(CartProducts);
