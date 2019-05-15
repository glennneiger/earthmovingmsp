import React, { Component } from "react";
import axios from "axios";

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
  addWarehouse,
  getCurrentWarehouses,
  deleteWarehousebyid,
  singleprodwarehousebyid
} from "../../actions/warehouseActions";

import isEmpty from "../../validation/is-empty";

import Spinner from "../common/Spinner";

class StockTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodwarehouseorigin: "",
      prodwarehousetransfer: "",
      productctntransfer: [],
      items: [],
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentStock();
    this.props.getCurrentWarehouses();
  }

  onTransferStockClick() {
    // console.log(id);
    //this.props.deleteWarehousebyid(id, this.props.history);

    const { items } = this.state;

    //console.log("onTransferStockClick is clicked");

    if (items.length == 0) {
      alert("Please Add some item for transfer");
      //console.log("Please Add some item for transfer");
    } else {
      console.log("Transfer Stock Is Ready : " + items);
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

  onAddtowtransClick(
    id,
    articlenum,
    prodcolor,
    totalctn,
    productImage,
    prodwarehouseorigin,
    prodwarehousetransfer,
    ctntrans
  ) {
    //console.log("id is : " + id);
    //console.log("ctntrans is : " + ctntrans);

    if (prodwarehouseorigin == "") {
      alert("Please Select Origin Warehouse from the List!!");
    } else if (prodwarehousetransfer == "") {
      alert("Please Select Transfer Warehouse from the List!!");
    } else if (prodwarehousetransfer == prodwarehouseorigin) {
      alert("Stock Cannot Be Transfer in Same Warehouse!!");
    } else if (parseInt(ctntrans) >= parseInt(totalctn) || ctntrans == null) {
      alert(
        "The Stock Transfer CTN : " +
          ctntrans +
          " should be less then " +
          totalctn +
          "of the article no : " +
          articlenum
      );
    }

    if (
      !(parseInt(ctntrans) >= parseInt(totalctn) || ctntrans == null) &&
      !(prodwarehouseorigin == "") &&
      !(prodwarehousetransfer == "")
    ) {
      // console.log("great validation check success");

      //console.log("prodwarehouseorigin is : " + prodwarehouseorigin);

      // console.log("prodwarehousetransfer is : " + prodwarehousetransfer);

      const TransSTKData = {
        transstkid: id,
        transstkart: articlenum,
        transstkcolor: prodcolor,
        transstktotalctn: totalctn,
        transstkprodimg: productImage,
        transprodwarehouseorigin: prodwarehouseorigin,
        transprodwarehousetransfer: prodwarehousetransfer,
        transstkctn: ctntrans
      };

      const items = [...this.state.items, TransSTKData];
      this.setState({
        items: items
      });

      console.log("list is : " + this.state.items.length);
    }
  }

  handleInputChange(index, event) {
    //console.log("array index:" + index);
    var productctntransfer = this.state.productctntransfer.slice(); // Make a copy of the productctntransfer first.

    productctntransfer[index] = event.target.value; // Update it with the modified productctntransfer.
    this.setState({ productctntransfer: productctntransfer }); // Update the state.

    // console.log("product ctn transfer array is : " + productctntransfer);

    {
      /*}  console.log(
      "product ctn transfer array len is : " + productctntransfer.length
    );

  */
    }
  }

  deleteItem = transstkid => {
    const filteredItems = this.state.items.filter(item => {
      return item.transstkid !== transstkid;
    });
    this.setState({
      items: filteredItems
    });
  };

  render() {
    const {
      prodwarehouseorigin,
      prodwarehousetransfer,
      productctntransfer,
      items
    } = this.state;

    const { errors } = this.state;

    const { stock } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    const { warehouse, loading } = this.props.warehouse;

    let InventoryStockData;
    let TotalStockItem;

    let StockTransferContent;
    let TotalWarehouseItem;
    let warehouseoptions = [];

    let stockcounter = 1;

    if (stock === null || loading) {
      InventoryStockData = <Spinner />;
    } else {
      if (Object.keys(stock).length > 0) {
        TotalStockItem = Object.keys(stock).length;
        //console.log("Total Stock is : " + TotalStockItem);
        // Select options for warehouse

        InventoryStockData = stock.map((stk, index) => (
          <tr key={stk._id}>
            <td scope="row">{stockcounter++}</td>
            <td>
              <button
                onClick={e =>
                  this.onAddtowtransClick(
                    stk._id,
                    stk.articlenum,
                    stk.prodcolor,
                    stk.totalctn,
                    stk.productImage,
                    prodwarehouseorigin,
                    prodwarehousetransfer,
                    productctntransfer[index]
                  )
                }
                // onClick={this.onAddtocartClick.bind(this, row.value)}
                className="btn btn-primary"
              >
                Transfer
              </button>
            </td>
            <td>
              <img
                style={{ maxWidth: "70px" }}
                class=""
                src={stk.productImage}
                alt="product img"
              />
            </td>
            <td>{stk.articlenum}</td>
            <td>{stk.prodcolor}</td>
            <td>{stk.totalctn}</td>
            <td>
              <input
                type="text"
                placeholder="* Transfer CTN"
                onChange={this.handleInputChange.bind(this, index)}
                value={productctntransfer[index]}
              />
            </td>
            {/*}  <td>
              <TextFieldGroup
                placeholder="* Transfer CTN"
                name="productctntransfer"
                value={productctntransfer}
                onChange={this.onChange}
                error={errors.productctntransfer}
                //info="Transfer CTN"
              />
            </td>
        */}
          </tr>
        ));

        // console.log(warehouseoptions);
      }
    }

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
          { label: "* Select Your Warehouse", value: 0 }
        ];

        // concat function is used for join two arrays
        warehouseoptions = firstoptinsellist.concat(actualwarehouses);

        // console.log(warehouseoptions);
      }
    }

    let Transferdatalist;
    let Transferdatalistlen;
    let itemscounter = 1;

    if (items === null) {
      Transferdatalist = <Spinner />;
    } else {
      console.log(items);
      if (Object.keys(items).length > 0) {
        Transferdatalistlen = Object.keys(items).length;
        //console.log("Total Stock is : " + TotalStockItem);
        // Select options for warehouse

        console.log("items arrays length is :" + Transferdatalistlen);

        Transferdatalist = items.map((itm, index) => (
          <tr key={itm.transstkid}>
            <td scope="row">{itemscounter++}</td>

            <td>
              <img
                style={{ maxWidth: "70px" }}
                class=""
                src={itm.transstkprodimg}
                alt="product img"
              />
            </td>
            <td>{itm.transstkart}</td>
            <td>{itm.transstkcolor}</td>
            <td>{itm.transprodwarehouseorigin}</td>
            <td>{itm.transprodwarehousetransfer}</td>
            <td>{itm.transstkctn}</td>
            <td>
              <button
                onClick={e => this.deleteItem(itm.transstkid)}
                // onClick={this.onAddtocartClick.bind(this, row.value)}
                className="btn btn-sm btn-danger"
              >
                <i class="fa fa-trash mr-2" aria-hidden="true" />
                Remove
              </button>
            </td>
            {/*}  <td>
              <TextFieldGroup
                placeholder="* Transfer CTN"
                name="productctntransfer"
                value={productctntransfer}
                onChange={this.onChange}
                error={errors.productctntransfer}
                //info="Transfer CTN"
              />
            </td>
        */}
          </tr>
        ));
      }
    }

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
                <li className="breadcrumb-item active">Stock Transfer</li>
              </ol>
            </div>
          </div>

          {items === null ? (
            <div />
          ) : (
            <div className="col-12">
              <div className="">
                <div className="col-12 row">
                  <div
                    className="col-md"
                    style={{ backgroundColor: "#b5b5b5" }}
                  >
                    <div>
                      <div>
                        <div
                          style={{
                            textAlign: "left",
                            backgroundColor: "#F5F5F5"
                          }}
                        >
                          <ul class="nav navbar navbar-left d-flex d-inline-flex ">
                            <li class="nav-item d-inline-flex  align-items-center mr-2">
                              <span
                                onClick={this.onTransferStockClick.bind(this)}
                                class="nav-link d-inline-flex"
                                style={{
                                  backgroundColor: "#333333",
                                  color: "#fff",
                                  cursor: "pointer"
                                }}
                              >
                                <i
                                  class="fa fa-exchange mr-2"
                                  aria-hidden="true"
                                />
                                Transfer Stock
                              </span>
                            </li>
                          </ul>

                          <table class="table table-bordered table-hover table-responsive">
                            <thead>
                              <tr>
                                <th scope="col" style={{ color: "black" }}>
                                  S.no
                                </th>

                                <th scope="col" style={{ color: "black" }}>
                                  Product Image
                                </th>
                                <th scope="col" style={{ color: "black" }}>
                                  Article No
                                </th>
                                <th scope="col" style={{ color: "black" }}>
                                  Product Color
                                </th>

                                <th scope="col" style={{ color: "black" }}>
                                  Warehouse Origin
                                </th>
                                <th scope="col" style={{ color: "black" }}>
                                  Warehouse Transfer
                                </th>
                                <th scope="col" style={{ color: "black" }}>
                                  Transfer CTN
                                </th>
                                <th scope="col" style={{ color: "black" }}>
                                  Delete
                                </th>
                              </tr>
                            </thead>
                            <tbody>{Transferdatalist}</tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <br />
          <div className="col-12">
            <div className="">
              <div className="col-12 row">
                <div className="col-md" style={{ backgroundColor: "#EBEBEB" }}>
                  <div>
                    <div style={{ textAlign: "center" }}>
                      <p>Warehouse Origin</p>
                      <SelectListGroup
                        placeholder="Product Warehouse"
                        name="prodwarehouseorigin"
                        value={prodwarehouseorigin}
                        onChange={this.onChange}
                        options={warehouseoptions}
                        error={errors.prodwarehouseorigin}
                        info="Product Warehouse Origin"
                      />
                    </div>
                    <div>
                      <p>STOCK DATA</p>
                      <table class="table table-bordered table-hover table-responsive">
                        <thead>
                          <tr>
                            <th scope="col" style={{ color: "black" }}>
                              S.no
                            </th>
                            <th scope="col" style={{ color: "black" }}>
                              Product Select
                            </th>
                            <th scope="col" style={{ color: "black" }}>
                              Product Image
                            </th>
                            <th scope="col" style={{ color: "black" }}>
                              Article No
                            </th>
                            <th scope="col" style={{ color: "black" }}>
                              Product Color
                            </th>
                            <th scope="col" style={{ color: "black" }}>
                              Product CTN
                            </th>
                            <th scope="col" style={{ color: "black" }}>
                              Transfer CTN
                            </th>
                          </tr>
                        </thead>
                        <tbody>{InventoryStockData}</tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="col-md" style={{ backgroundColor: "#E9ECEF" }}>
                  <div style={{ textAlign: "center" }}>
                    <p>Warehouse Transfer</p>
                    <SelectListGroup
                      placeholder="Product Warehouse"
                      name="prodwarehousetransfer"
                      value={prodwarehousetransfer}
                      onChange={this.onChange}
                      options={warehouseoptions}
                      error={errors.prodwarehousetransfer}
                      info="Product Warehouse Transfer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/*} <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up" />
  </a>*/}
        </div>
      </div>
    );
  }
}

StockTransfer.propTypes = {
  stock: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  stock: state.stock,
  warehouse: state.warehouse,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    getCurrentStock,
    createStock,
    editStock,
    addWarehouse,
    getCurrentWarehouses,
    singleprodwarehousebyid,
    deleteWarehousebyid
  }
)(withRouter(StockTransfer));
