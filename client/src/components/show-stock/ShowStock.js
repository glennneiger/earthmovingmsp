import React, { Component } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import TextFieldGroup from "../common/TextFieldGroup";

import StockActions from "../dashboard/StockActions";
import {
  createStock,
  editStock,
  singleprodstockbyid
} from "../../actions/stockActions";

import { singleprodwarehouseitemsbyid } from "../../actions/warehouseActions";

import Spinner from "../common/Spinner";

import "./model.css";

import "./showstock.css";

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <button
          onClick={handleClose}
          className="btn btn-default"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "#AF0808"
          }}
        >
          Close
        </button>
      </section>
    </div>
  );
};

class ShowStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      show: false,
      warehouseid: ""
      //singprodstk: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    var param_id = this.props.match.params.id;
    this.props.singleprodstockbyid(this.props.match.params.id);

    this.props.singleprodwarehouseitemsbyid(this.props.match.params.id);
    {
      /*}  axios
      .get(`/api/stock/singleprodstock/` + this.props.match.params.id)
      .then(res => {
        this.setState({ singprodstk: res.data });

        console.log(this.state.singprodstk);
      });
    */
    }
  }

  onChange = e => {
    switch (e.target.name) {
      case "productImage":
        this.setState({ productImage: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSubmit(e) {
    e.preventDefault();

    // this.props.editStock(stockData, this.props.history);
  }

  showModalClick = (
    warehouseid,
    warehouseaddress,
    prodstk_id,
    itemcode,
    quantity
  ) => {
    this.setState({ show: true, warehouseid: warehouseid });
    console.log("warehouseid set to : " + warehouseid);
    console.log("item warehouse address is : " + warehouseaddress);

    var warehouseid = warehouseid;
    var warehouseaddress = warehouseaddress;
    var prodstk_id = prodstk_id;
    var itemcode = itemcode;
    var quantity = quantity;

    this.props.singleprodstockbyid(prodstk_id);

    this.props.singleprodwarehouseitemsbyid(prodstk_id);

    // this.props.ProductSizeConfigsByid(prodconfigsid, prodwarehouseorigin);
  };
  hideModalClick = () => {
    this.setState({ show: false, warehouseid: "" });
    console.log("warehouseid set to : '' ");
  };

  render() {
    const { errors } = this.state;

    const { warehousebyid, loading } = this.props.warehouse;

    const { stock, stockbyid } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    let showwarehousecontent;
    let totalfinalctns = 0;

    if (warehousebyid === null) {
      showwarehousecontent = <Spinner />;
    } else {
      //totalfinalctns IS CALCULATED BASED ON ACC TO SINGLE ARTICLE PROD STOCK PRESENT IN ALL WAREHOUSE

      /*  if (Object.keys(warehousebyid).length > 0) {
        warehousebyid.map(warehouseartbyid => {
          totalfinalctns += parseInt(
            warehouseartbyid.warehouseproducts.totalctn
          );
        });
      }*/

      if (Object.keys(warehousebyid).length > 0) {
        const showwarehousecontentData = warehousebyid.map(
          (warehouseartbyid, index) => (
            <thead key={warehouseartbyid._id}>
              {warehouseartbyid ? (
                <tr>
                  <th
                    style={{
                      backgroundColor: "rgb(206, 196, 196)",
                      textAlign: "center"
                    }}
                  >
                    {" "}
                    <p>{warehouseartbyid.warehouseaddress}</p>
                  </th>
                </tr>
              ) : (
                ""
              )}
              {warehouseartbyid ? (
                <tr>
                  <th
                    style={{
                      textAlign: "center"
                    }}
                  >
                    <center>Itemcode: {warehouseartbyid.itemcode}</center>
                  </th>
                  <td
                    style={{
                      textAlign: "center"
                    }}
                  >
                    {warehouseartbyid.quantity}
                  </td>

                  <td
                    style={{
                      textAlign: "center"
                    }}
                  >
                    <center>
                      {/*}  <Link
                        target="_blank"
                        to={`/remove-on-existing-stock/${
                          warehouseartbyid._id
                        }&${warehouseartbyid.warehouseaddress}&${
                          warehouseartbyid.prodstk_id
                        }&${warehouseartbyid.itemcode}`}
                        className="btn btn-default"
                        style={{
                          textDecoration: "none",
                          color: "#fff",
                          backgroundColor: "red"
                        }}
                      >
                        Remove Qty Here
                      </Link>*/}
                      <button
                        onClick={e =>
                          this.showModalClick(
                            warehouseartbyid._id,
                            warehouseartbyid.warehouseaddress,
                            warehouseartbyid.prodstk_id,
                            warehouseartbyid.itemcode,
                            warehouseartbyid.quantity
                          )
                        }
                        // onClick={this.onAddtocartClick.bind(this, row.value)}
                        className="btn btn-default"
                        style={{
                          textDecoration: "none",
                          color: "#fff",
                          backgroundColor: "red"
                        }}
                      >
                        Remove Qty Here
                      </button>
                    </center>
                  </td>
                </tr>
              ) : (
                ""
              )}
            </thead>
          )
        );

        showwarehousecontent = showwarehousecontentData;
      }
    }

    let showstockcontent;
    let showstockid;

    if (stockbyid === null) {
      showstockcontent = <Spinner />;
    } else {
      if (Object.keys(stockbyid).length > 0) {
        //console.log(stockbyid.articlenum);

        showstockid = (
          <li className="breadcrumb-item active">{stockbyid.itemcode}</li>
        );
      }

      if (Object.keys(stockbyid).length > 0) {
        //  const showstocklen = Object.keys(stockbyid);
        //console.log(showstocklen);

        showstockcontent = (
          <div>
            <div className="col-12 row">
              <br />
              <div class="col-3">
                <div class="card card-bordered">
                  {stockbyid.itemprimaryimg ? (
                    <img
                      style={{ width: "100%" }}
                      class="card-img-top img-fluid"
                      src={stockbyid.itemprimaryimg}
                      alt="product img"
                    />
                  ) : (
                    <Spinner />
                  )}
                </div>
              </div>

              <div className="col-9">
                <table className="table table-striped table-hover rtable table-responsive">
                  {stockbyid ? (
                    <thead>
                      <tr>
                        <th>Item Code</th>
                        <td>{stockbyid.itemcode}</td>
                        <th>Item Name</th>
                        <td>{stockbyid.itemname}</td>
                      </tr>
                      <tr>
                        <th>Item Hsn Code</th>
                        <td>{stockbyid.hsncode}</td>
                        <th>Item Machine Part</th>
                        <td>{stockbyid.machinepart}</td>
                      </tr>
                      <tr>
                        <th>Item Length</th>
                        <td>{stockbyid.itemlength}</td>
                        <th>Item Width</th>
                        <td>{stockbyid.itemwidth}</td>
                      </tr>
                      <tr>
                        <th>Item Height</th>
                        <td>{stockbyid.itemheight}</td>
                        <th>Item For company</th>

                        <td>{stockbyid.forcompany}</td>
                      </tr>

                      <tr>
                        <th>Item Rate</th>
                        <td>{stockbyid.rate}</td>
                        <th>Item Max Rate</th>
                        <td>{stockbyid.maxrate}</td>
                      </tr>
                    </thead>
                  ) : (
                    <span />
                  )}

                  <thead>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#0085C3",
                          textAlign: "center"
                        }}
                      >
                        {" "}
                        <p style={{ color: "#fff" }}>ARTICLE WAREHOUSE INFO</p>
                      </th>

                      <td
                        style={{
                          backgroundColor: "black",
                          textAlign: "center"
                        }}
                      >
                        <p>
                          <b style={{ color: "#fff" }}>Total Item Qty</b>
                        </p>
                      </td>
                      <th
                        style={{
                          backgroundColor: "#cec4c4",
                          textAlign: "center"
                        }}
                      >
                        {" "}
                        <p>Item Qty Remove</p>
                      </th>
                    </tr>
                  </thead>
                  {warehousebyid ? showwarehousecontent : <span />}
                </table>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div style={{ backgroundColor: "#F3F8FB" }}>
        <div id="wrapper">
          <StockActions />

          <div id="content-wrapper">
            <div className="container-fluid">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/view-stock">View Stock</Link>
                </li>
                <li className="breadcrumb-item active">Show Stock</li>

                {showstockid ? showstockid : <div />}
              </ol>
              <div />
              <div
                className="col-md"
                style={{
                  backgroundColor: "#EBEBEB",
                  textAlign: "center"
                }}
              >
                <Modal show={this.state.show} handleClose={this.hideModalClick}>
                  <p>warehouse id : {this.state.warehouseid}</p>

                  <p>Here We Will Work On Remove on Existing Stock</p>
                </Modal>
              </div>

              {showstockcontent ? showstockcontent : <div />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ShowStock.propTypes = {
  stock: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  stock: state.stock,
  warehouse: state.warehouse,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    createStock,
    editStock,
    singleprodstockbyid,
    singleprodwarehouseitemsbyid
  }
)(withRouter(ShowStock));
