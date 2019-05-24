import React, { Component } from "react";
import SortableTbl from "react-sort-search-table";

import ImageLoader from "react-imageloader";
import axios from "axios";
import Moment from "react-moment";
import ReactTable from "react-table";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

import StockActions from "../dashboard/StockActions";
import {
  getCurrentStock,
  createStock,
  editStock
} from "../../actions/stockActions";

import {
  getCurrentWarehouses,
  getCurrentOriginWareStock
} from "../../actions/warehouseActions";

import {
  addproducttosession,
  getCurrentSessionProducts
} from "../../actions/cartsessionAction";

import isEmpty from "../../validation/is-empty";

import Spinner from "../common/Spinner";

import WarehouseTransferSpinner from "../common/WarehouseTransferSpinner";

//import { Tbl } from "./Tbl";

import "./model.css";

import "./SortableTbl.scss";
const $ = require("jquery");
$.DataTable = require("datatables.net");

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

class BillingQtyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <td>
        {/*console.log(
          this.props.rowData,
          this.props.tdData,
          "_id is : " + this.props.rowData._id
        )*/}

        <TextFieldGroup
          type="text"
          placeholder={`* Add Qty`}
          onChange={this.props.action.bind(this, this.props.rowData._id)}
          //onChange={e => this.props.action(this.props.tdData, e.target.value)}
          value={this.props.itemquantityaddtocart[this.props.rowData._id]}
        />
      </td>
    );
  }
}

class BillingQtyAddToCartComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.deleteItem = this.deleteItem.bind(this);
  }
  deleteItem() {
    alert("delete " + this.props.rowData._id);
    console.log(this.props.rowData, this.props.tdData);
  }

  billqtyclick() {
    this.props.addtocartclick(
      this.props.rowData._id,
      this.props.itemquantityaddtocart[this.props.rowData._id]
    );
  }

  render() {
    return (
      <td>
        {/*console.log(
          this.props.rowData,
          this.props.tdData,
          "_id is : " + this.props.rowData._id
        )*/}
        <button
          onClick={this.billqtyclick.bind(this)}
          /*  onClick={this.props.addtocartclick.bind(
            this,
            this.props.rowData._id,
            this.props.itemquantityaddtocart[this.props.rowData._id]
          )}*/
          // onClick={this.onAddtocartClick.bind(this, row.value)}
          className="btn btn-default"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "#0085C3"
          }}
        >
          ADD
        </button>
      </td>
    );
  }
}

/*ranferfinallyComponent.propTypes = {
  addtocartclick: React.PropTypes.func
};*/

class BaseProductDeleteComponent extends React.Component {
  constructor(props) {
    super(props);
    this.deleteItem = this.deleteItem.bind(this);
  }
  deleteItem() {
    alert("delete " + this.props.rowData._id);
    console.log(this.props.rowData, this.props.tdData);
  }
  render() {
    return (
      <td>
        <input
          type="button"
          className="btn btn-danger"
          value="Delete"
          onClick={this.deleteItem}
        />
      </td>
    );
  }
}

function ProductTblImgpreloader() {
  return <div className="loading-div" style={{ minHeight: "100px" }} />;
}

const TblImageLoader = props => (
  <ImageLoader src={props.data} preloader={ProductTblImgpreloader}>
    NOT FOUND
  </ImageLoader>
);

const BaseProductTblImageComponent = props => {
  return (
    <td style={{ width: "70px", minWidth: "70px", backgroundColor: "#fff" }}>
      <Link target="_blank" to={`/show-stock/${props.rowData._id}`}>
        <TblImageLoader data={props.rowData.itemprimaryimg} />
      </Link>
      {/*}  <a href={props.rowData.itemprimaryimg} target="_blank">
        <TblImageLoader data={props.rowData.itemprimaryimg} />
                  </a>*/}
    </td>
  );
};

class BaseProductEditComponent extends React.Component {
  constructor(props) {
    super(props);
    this.editItem = this.editItem.bind(this);
  }
  editItem() {
    alert("edit " + this.props.rowData._id);
    console.log(this.props.rowData, this.props.tdData);
  }
  render() {
    return (
      <td>
        <input
          type="button"
          className="btn btn-warning"
          value="Edit"
          onClick={this.editItem}
        />
      </td>
    );
  }
}

class CreateInvoice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodbillingwarehouse: "",
      itemquantityaddtocart: [],
      actionadd: "add",
      actiondec: "dec",
      actiondelete: "delete",
      show: false,
      modelconfigid: "",
      testinput: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    /*   console.log(this.el);
$(document).ready(function() {
      $("#example").DataTable();
    });*/
    this.props.getCurrentSessionProducts();

    this.props.getCurrentStock();
    this.props.getCurrentWarehouses();

    this.props.getCurrentOriginWareStock(this.state.prodbillingwarehouse);
  }

  componentDidUpdate(prevProps, prevState) {
    /* console.log(this.el);

    $(document).ready(function() {
      $("#example").DataTable();
    });*/
    const { prodbillingwarehouse } = this.state;
    if (this.state.prodbillingwarehouse == "" || 0) {
      console.log("select origin");
    } else {
      if (prevState.prodbillingwarehouse !== this.state.prodbillingwarehouse) {
        //dispatch(searchAction(this.state.search));

        this.props.getCurrentOriginWareStock(this.state.prodbillingwarehouse);
        console.log(
          "prodbillingwarehouse is : " + this.state.prodbillingwarehouse
        );
        console.log(
          "itemquantityaddtocart is :" + this.state.itemquantityaddtocart.length
        );
      }
    }
  }

  componentWillUnmount() {
    //this.$el.DataTable.destroy(true);
  }
  onAddtoCartStockClick(prodstk_id, orderitemquantity, e) {
    const { prodbillingwarehouse } = this.state;

    console.log("warehouse origin is : " + prodbillingwarehouse);

    console.log("prodstk_id is : " + prodstk_id);
    console.log("orderitemquantity is : " + orderitemquantity);

    if (orderitemquantity == "" || orderitemquantity == undefined) {
      alert("Please Type Quantity Add for Single Item at a Time");
    } else if (parseInt(orderitemquantity) <= 0) {
      alert(
        "The Item ADD Quantity : " + orderitemquantity + " be greater then 0 "
      );
    } else if (orderitemquantity == null) {
      alert(
        "The Item Transfer Quantity : " +
          orderitemquantity +
          " Cannot Be Empty!!"
      );
    }

    if (
      !(orderitemquantity == null) &&
      !(prodbillingwarehouse == "" || prodbillingwarehouse == 0) &&
      !(parseInt(orderitemquantity) <= 0)
    ) {
      console.log("great validation check success");
      console.log(
        "cart item data would be : " + prodstk_id,
        prodbillingwarehouse,
        orderitemquantity
      );
      this.props.addproducttosession(
        prodstk_id,
        prodbillingwarehouse,
        orderitemquantity,
        this.props.history
      );
      // this.props.getCurrentSessionProducts();
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

  handleOriginChange = e => {
    this.setState({ prodbillingwarehouse: e.target.value });
  };

  handleInputChange = (_id, event) => {
    console.log("array _id:" + _id);
    var itemquantityaddtocart = this.state.itemquantityaddtocart.slice();

    // Make a copy of the itemquantityaddtocart first.
    //var itemquantityaddtocart = [...itemquantityaddtocart];
    itemquantityaddtocart[_id] = event.target.value; // Update it with the modified itemquantityaddtocart.
    this.setState({ itemquantityaddtocart: itemquantityaddtocart }); // Update the state.

    console.table(itemquantityaddtocart);
    for (let [key, value] of Object.entries(itemquantityaddtocart)) {
      console.log(key, value);
    }

    console.log(
      "product ctn transfer array len is : " +
        Object.keys(this.state.itemquantityaddtocart).length
    );
  };
  onSubmit(e) {
    e.preventDefault();

    // this.props.editStock(stockData, this.props.history);
  }

  showModalClick = id => {
    this.setState({ show: true, modelconfigid: id });
    console.log("modelconfigid set to : " + id);

    var prodconfigsid = id;
    var prodbillingwarehouse = this.state.prodbillingwarehouse;

    this.props.ProductSizeConfigsByid(prodconfigsid, prodbillingwarehouse);
  };
  hideModalClick = () => {
    this.setState({ show: false, modelconfigid: "" });
    console.log("modelconfigid set to : '' ");
  };

  deleteItem(
    prosizeconfig_id,
    prodbillingwarehouse,
    orderitemquantity,
    actiondelete
  ) {
    //console.log(prosizeconfig_id, actiondelete);

    this.props.warehoustransdeletebyidinsession(
      prosizeconfig_id,
      prodbillingwarehouse,
      orderitemquantity,
      actiondelete,
      this.props.history
    );
  }

  render() {
    const {
      prodbillingwarehouse,
      itemquantityaddtocart,
      testinput
    } = this.state;

    const { errors } = this.state;

    const { stock } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    const { sessioncart } = this.props.sessioncart; //here we pass the sessioncart props in with all the sessioncart contains and store in sessioncart const for used in this component

    const {
      sessionwarehoustrans,
      fwarehousetransloading
    } = this.props.warehousetransfer;

    let WarehouseStockTransferLoadingData;

    if (fwarehousetransloading) {
      WarehouseStockTransferLoadingData = <WarehouseTransferSpinner />;
    }

    const { warehouse, loading, originwarehousestks } = this.props.warehouse;

    let StockTransferContent;
    let TotalWarehouseItem;
    let warehouseoptions = [];

    let stockcounter = 1;

    if (warehouse === null || loading) {
      StockTransferContent = <Spinner />;
    } else {
      if (Object.keys(warehouse).length > 0) {
        TotalWarehouseItem = Object.keys(warehouse).length;
        // console.log("Total Warehouse is : " + TotalWarehouseItem);
        // Select options for warehouse

        const actualwarehouses = warehouse.map(w => ({
          label: w.warehouseaddress,
          value: w.warehouseaddress
        }));

        // console.log(actualwarehouses);
        const firstoptinsellist = [
          { label: "* Select Your Billing Warehouse", value: 0 }
        ];

        // concat function is used for join two arrays
        warehouseoptions = firstoptinsellist.concat(actualwarehouses);

        // console.log(warehouseoptions);
      }
    }

    let tHead = [
      "Product Image",
      "Item Code",
      "Item Name",
      "Item Length",
      "Item Width",
      "Item Height",
      "Available Qty",
      "Billing Qty",
      "Add To Cart"
    ];
    let col = [
      "itemprimaryimg",
      "itemcode",
      "itemname",
      "itemlength",
      "itemwidth",
      "itemheight",
      "quantity",
      "billingqty",
      "finallyaddtocart"
    ];

    return (
      <div>
        <div id="wrapper">
          <StockActions />

          <div id="content-wrapper">
            <div className="container-fluid">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">Create Invoice</li>
              </ol>
            </div>
          </div>
          {fwarehousetransloading ? (
            <div
              className="col-12 row"
              style={{
                backgroundColor: "beige"
              }}
            >
              <div className="col-md">
                <p style={{ textAlign: "center" }}>
                  {WarehouseStockTransferLoadingData}
                  Please Wait Until Stock Is Transfer!! DO NOT Refresh the
                  Browser
                </p>
              </div>
            </div>
          ) : (
            <div>
              <div className="col-12 row">
                <div className="col-md-6">
                  <div>
                    <div style={{ textAlign: "center" }}>
                      <p>Billing Warehouse Address</p>
                      <SelectListGroup
                        placeholder="Product Warehouse"
                        name="prodbillingwarehouse"
                        value={prodbillingwarehouse}
                        onChange={this.handleOriginChange}
                        options={warehouseoptions}
                        error={errors.prodbillingwarehouse}
                        //  info="Billing Warehouse"
                      />
                    </div>
                  </div>
                </div>
                {this.state.prodbillingwarehouse && (
                  <div className="col-md-6">
                    <div>
                      <div style={{ textAlign: "center", paddingTop: 25 }}>
                        <p>
                          Selected Billing Warehouse is :
                          <span style={{ color: "green", paddingLeft: 10 }}>
                            {this.state.prodbillingwarehouse}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="col-12">
                <div className="">
                  <div className="col-12 row">
                    <div
                      className="col-md"
                      style={{
                        backgroundColor: "#EBEBEB",
                        textAlign: "center"
                      }}
                    >
                      {originwarehousestks === null || loading ? (
                        <Spinner />
                      ) : (
                        <div>
                          {this.state.prodbillingwarehouse != 0 && (
                            <SortableTbl
                              action={this.handleInputChange.bind(this)}
                              itemquantityaddtocart={itemquantityaddtocart}
                              addtocartclick={this.onAddtoCartStockClick.bind(
                                this
                              )}
                              tblData={
                                originwarehousestks.finalwarehouseproducts
                              }
                              tHead={tHead}
                              customTd={[
                                {
                                  custd: BaseProductTblImageComponent,
                                  keyItem: "itemprimaryimg"
                                },
                                {
                                  custd: BillingQtyComponent,
                                  keyItem: "billingqty"
                                },
                                {
                                  custd: BillingQtyAddToCartComponent,
                                  keyItem: "finallyaddtocart"
                                }
                              ]}
                              dKey={col}
                              search={true}
                              defaultCSS={false}
                              paging={true}
                            />
                          )}

                          {/*}   <Tbl
                            data={originwarehousestks.finalwarehouseproducts}
                      />*/}
                          {/*console.log(originwarehousestks)*/}

                          {/*}   <table
                            id="example"
                            class="display"
                            ref={el => (this.el = el)}
                          >
                            <thead>
                              <tr>
                                <th>Sno</th>
                                <th>Product Image</th>
                                <th>Item Code</th>
                                <th>Item Name</th>
                                <th>Item Length</th>
                                <th>Transfer Qty</th>
                                <th>Transfer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {originwarehousestks.finalwarehouseproducts &&
                                originwarehousestks.finalwarehouseproducts.map(
                                  (item, index) => {
                                    return (
                                      <tr>
                                        <td>Tiger Nixon</td>
                                        <td>System Architect</td>
                                        <td>Edinburgh</td>
                                        <td>61</td>
                                        <td>2011/04/25</td>
                                        <td>$320,800</td>
                                      </tr>
                                    );
                                  }
                                )}
                            </tbody>
                            <tfoot />
                                </table>*/}
                          {/*} <ReactTable
                            data={originwarehousestks.finalwarehouseproducts}
                            columns={columns}
                            defaultPageSize={5}
                            pageSizeOptions={[
                              5,
                              10,
                              15,
                              20,
                              25,
                              30,
                              35,
                              40,
                              50
                            ]}
                            style={{
                              height: "600px", // This will force the table body to overflow and scroll, since there is not enough room
                              maxWidth: "100%"
                            }}
                            className="-striped -highlight"
                          />*/}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/*} <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up" />
  </a>*/}
        </div>
      </div>
    );
  }
}

CreateInvoice.propTypes = {
  stock: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  warehousetransfer: PropTypes.object.isRequired,
  addproducttosession: PropTypes.object.isRequired,
  getCurrentSessionProducts: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  stock: state.stock,
  warehouse: state.warehouse,
  warehousetransfer: state.warehousetransfer,
  sessioncart: state.sessioncart,
  sessioncart: state.sessioncart,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    getCurrentSessionProducts,
    getCurrentStock,
    getCurrentWarehouses,
    getCurrentOriginWareStock,
    addproducttosession
  }
)(withRouter(CreateInvoice));
