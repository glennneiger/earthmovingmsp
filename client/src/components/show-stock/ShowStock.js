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
  singleprodstockbyid,
  removeonexistprodstock
} from "../../actions/stockActions";

import { singleprodwarehouseitemsbyid } from "../../actions/warehouseActions";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

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
      warehouseid: "",
      warehouseaddress: "",
      prodstk_id: "",
      itemcode: "",
      availableqty: "",
      removeqty: "",
      itemprimaryimg: ""
      //singprodstk: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    var param_id = this.props.match.params.id;
    this.props.singleprodstockbyid(this.props.match.params.id);

    this.props.singleprodwarehouseitemsbyid(this.props.match.params.id);

    axios
      .get(`/api/stock/singleprodstock/` + this.props.match.params.id)
      .then(res => {
        this.setState({ itemprimaryimg: res.data.itemprimaryimg });

        console.log(this.state.itemprimaryimg);
      });
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

  removeQtyFinally = (
    warehouseid,
    warehouseaddress,
    prodstk_id,
    itemcode,
    removeqty
  ) => {
    const { availableqty, itemprimaryimg } = this.state;

    if (availableqty == "" || parseInt(availableqty) <= 0) {
      alert("Your Item Has 0 or Empty Available Quantity");
    } else if (removeqty == "" || parseInt(removeqty) <= 0) {
      alert(
        "The Item removing quantity : " + removeqty + "should be greater then 0"
      );
    } else if (parseInt(removeqty) > parseInt(availableqty)) {
      alert(
        "The Item removing quantity : " +
          removeqty +
          "should be less then available quantity : " +
          availableqty
      );
    }

    const RemoveStockData = {
      warehouseid: warehouseid,
      warehouseaddress: warehouseaddress,
      prodstk_id: prodstk_id,
      itemcode: itemcode,
      removeqty: removeqty,
      itemprimaryimg: itemprimaryimg
    };

    if (
      !(availableqty == "" || parseInt(availableqty) <= 0) &&
      !(removeqty == "" || parseInt(removeqty) < 0) &&
      !(parseInt(removeqty) > parseInt(availableqty))
    ) {
      console.log("great validation check success");

      console.log("RemoveStockData is : " + RemoveStockData);
      console.table(RemoveStockData);
      this.props.removeonexistprodstock(RemoveStockData, this.props.history);
    }
  };

  showModalClick = (
    warehouseid,
    warehouseaddress,
    prodstk_id,
    itemcode,
    quantity
  ) => {
    this.setState({
      show: true,
      warehouseid: warehouseid,
      warehouseaddress: warehouseaddress,
      prodstk_id: prodstk_id,
      itemcode: itemcode,
      availableqty: quantity
    });
    console.log("warehouseid set to : " + warehouseid);
    console.log("item warehouse address is : " + warehouseaddress);

    var warehouseid = warehouseid;
    var warehouseaddress = warehouseaddress;
    var prodstk_id = prodstk_id;
    var itemcode = itemcode;
    var availableqty = availableqty;

    // this.props.singleprodstockbyid(prodstk_id);

    //this.props.singleprodwarehouseitemsbyid(prodstk_id);
  };
  hideModalClick = () => {
    this.setState({ show: false, warehouseid: "", removeqty: "" });
    console.log("warehouseid set to : '' ");
  };

  render() {
    const { errors, itemcode, removeqty } = this.state;

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
              {warehouseartbyid && warehouseartbyid.quantity > 0 ? (
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
              {warehouseartbyid && warehouseartbyid.quantity > 0 ? (
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
          <div className="col-12 row">
            <br />
            <div className="col-2" />
            <div class="col-3">
              <div class="card card-bordered">
                {stockbyid.productImage && (
                  <Carousel autoPlay infiniteLoop>
                    {stockbyid.productImage.map((imgurl, key) => (
                      <div>
                        <img src={imgurl} />
                      </div>
                    ))}
                  </Carousel>
                )}
              </div>
            </div>
            <div className="col-7">
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
                      <td>
                        {stockbyid.machinepart.map(data => {
                          return (
                            <h5>
                              <span class="badge badge-success">{data}</span>
                            </h5>
                          );
                        })}
                      </td>
                    </tr>
                    <tr>
                      <th>Item ID</th>
                      <td>
                        {stockbyid.itemid}
                        {stockbyid.itemidunit}
                      </td>
                      <th>Item OD</th>
                      <td>
                        {stockbyid.itemod}
                        {stockbyid.itemodunit}
                      </td>
                    </tr>
                    <tr>
                      <th>Item Length</th>
                      <td>
                        {stockbyid.itemlength}
                        {stockbyid.itemlengthunit}
                      </td>
                      <th>Item For company</th>

                      <td>
                        {stockbyid.forcompany.map(data => {
                          return (
                            <h5>
                              <span class="badge badge-info">{data}</span>
                            </h5>
                          );
                        })}
                      </td>
                    </tr>

                    <tr>
                      <th>Item Thickness</th>
                      <td>
                        &#8377; {stockbyid.itemthickness}
                        {stockbyid.itemthicknessunit}
                      </td>
                      <th>Item Min Rate</th>
                      <td>&#8377; {stockbyid.minrate}</td>
                    </tr>
                    <tr>
                      <th>Item Rate</th>
                      <td>&#8377; {stockbyid.rate}</td>
                      <th>Item Max Rate</th>
                      <td>&#8377; {stockbyid.maxrate}</td>
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
                  <div className="container">
                    <div className="row">
                      <div className="col-md-12">
                        <center>
                          <div
                            class="form-group col-md-6"
                            style={{ padding: 25 }}
                          >
                            <p>
                              Warehouse Address : {this.state.warehouseaddress}
                            </p>
                            <p>Available Qty : {this.state.availableqty}</p>
                            <TextFieldGroup
                              placeholder="Itemcode"
                              name="itemcode"
                              value={itemcode}
                              onChange={this.onChange}
                              error={errors.itemcode}
                              info="Item Code"
                              disabled
                            />
                            <br />

                            <TextFieldGroup
                              placeholder="Remove Quantity"
                              name="removeqty"
                              value={removeqty}
                              onChange={this.onChange}
                              error={errors.removeqty}
                              info="Total Quantity Remove"
                            />
                            <br />

                            <input
                              onClick={e =>
                                this.removeQtyFinally(
                                  this.state.warehouseid,
                                  this.state.warehouseaddress,
                                  this.state.prodstk_id,
                                  this.state.itemcode,
                                  this.state.removeqty
                                )
                              }
                              type="button"
                              value="Remove"
                              className="btn btn-info btn-block mt-4"
                            />
                          </div>
                        </center>
                      </div>
                    </div>
                  </div>
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
    singleprodwarehouseitemsbyid,
    removeonexistprodstock
  }
)(withRouter(ShowStock));
