import React, { Component } from "react";
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

import isEmpty from "../../validation/is-empty";

import Spinner from "../common/Spinner";

import WarehouseTransferSpinner from "../common/WarehouseTransferSpinner";

import "./model.css";

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

class MyTable extends Component {
  render() {
    return (
      <ReactTable
        data={this.props.mydata}
        columns={[
          {
            Header: "Sno",
            id: "row",
            maxWidth: 50,
            filterable: false,
            sortable: false,
            Cell: row => {
              return <div>{row.index + 1}</div>;
            }
          },
          {
            Header: "Product Image",
            accessor: "itemprimaryimg",
            maxWidth: 350,
            Cell: row => (
              <span>
                <center>
                  <img
                    style={{ maxWidth: "70px" }}
                    class=""
                    src={row.value}
                    alt="product img"
                  />
                </center>
              </span>
            )
          },
          {
            Header: "Item Code",
            accessor: "itemcode",
            maxWidth: 100,
            filterable: true
          },
          {
            Header: "Available Qty",
            accessor: "quantity",
            maxWidth: 290,
            filterable: true
          },
          {
            Header: "Transfer Qty",
            accessor: "_id",
            maxWidth: 350,
            Cell: row => (
              <div key={row.index}>
                <TextFieldGroup
                  type="number"
                  placeholder={`* Transfer Qty #${row.index} `}
                  //  onChange={this.handleInputChange.bind(this, row.index)}
                  onChange={e => this.props.action(row.index, e.target.value)}
                  value={this.props.itemquantitytransfer[row.index]}
                />
              </div>
            )
          },
          {
            Header: "Operation",
            columns: [
              {
                Header: "Transfer",
                accessor: "_id",
                maxWidth: 100,
                sortable: false,
                Cell: row => (
                  <span>
                    <center>
                      <button
                        onClick={e =>
                          this.onTransferStockClick(
                            row.value,
                            this.props.itemquantitytransfer[row.index]
                          )
                        }
                        // onClick={this.onAddtocartClick.bind(this, row.value)}
                        className="btn btn-default"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          backgroundColor: "#0085C3"
                        }}
                      >
                        Transfer
                      </button>
                    </center>
                  </span>
                )
              },
              {
                Header: "Stock View",
                accessor: "_id",
                maxWidth: 100,
                filterable: false,
                Cell: row => (
                  <span>
                    <center>
                      <Link
                        target="_blank"
                        to={`/show-stock/${row.value}`}
                        style={{
                          textDecoration: "none",
                          color: "rgb(0, 133, 195)",
                          fontSize: 25
                        }}
                      >
                        <i class="fa fa-eye" />
                      </Link>
                    </center>
                  </span>
                )
              }
            ]
          }
        ]}
        defaultPageSize={5}
        pageSizeOptions={[5, 10, 15, 20, 25, 30, 35, 40, 50]}
        style={{
          height: "600px", // This will force the table body to overflow and scroll, since there is not enough room
          maxWidth: "100%"
        }}
        className="-striped -highlight"
      />
    );
  }
}

class StockTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodwarehouseorigin: "",
      prodwarehousetransfer: "",
      itemquantitytransfer: [],
      actionadd: "add",
      actiondec: "dec",
      actiondelete: "delete",
      show: false,
      modelconfigid: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    // Bind the this context to the handleInputChange function
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    console.log("componentDidMount is called !!");
    this.props.getCurrentStock();
    this.props.getCurrentWarehouses();

    this.props.getCurrentOriginWareStock(this.state.prodwarehouseorigin);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("componentDidUpdate is called !!");
    const { prodwarehouseorigin } = this.state;
    if (this.state.prodwarehouseorigin == "" || 0) {
      console.log("select origin");
    } else {
      if (prevState.prodwarehouseorigin !== this.state.prodwarehouseorigin) {
        //dispatch(searchAction(this.state.search));
        this.props.getCurrentOriginWareStock(this.state.prodwarehouseorigin);
        console.log("value is : " + this.state.prodwarehouseorigin);
      }
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
    this.setState({ prodwarehouseorigin: e.target.value });
  };

  handleInputChange(index, newValue) {
    //console.log("array index:" + index);
    // var itemquantitytransfer = this.state.itemquantitytransfer.slice(); // Make a copy of the itemquantitytransfer first.

    //copy the array first
    const updatedArray = [...this.state.itemquantitytransfer];

    updatedArray[index] = newValue; // Update it with the modified itemquantitytransfer.
    this.setState({ itemquantitytransfer: updatedArray }); // Update the state.

    // console.log("product ctn transfer array is : " + itemquantitytransfer);

    {
      /*}  console.log(
      "product ctn transfer array len is : " + itemquantitytransfer.length
    );

  */
    }
  }

  onSubmit(e) {
    e.preventDefault();

    // this.props.editStock(stockData, this.props.history);
  }

  showModalClick = id => {
    this.setState({ show: true, modelconfigid: id });
    console.log("modelconfigid set to : " + id);

    var prodconfigsid = id;
    var prodwarehouseorigin = this.state.prodwarehouseorigin;

    this.props.ProductSizeConfigsByid(prodconfigsid, prodwarehouseorigin);
  };
  hideModalClick = () => {
    this.setState({ show: false, modelconfigid: "" });
    console.log("modelconfigid set to : '' ");
  };

  deleteItem(
    prosizeconfig_id,
    prodwarehouseorigin,
    prodwarehousetransfer,
    ctntrans,
    actiondelete
  ) {
    //console.log(prosizeconfig_id, actiondelete);

    this.props.warehoustransdeletebyidinsession(
      prosizeconfig_id,
      prodwarehouseorigin,
      prodwarehousetransfer,
      ctntrans,
      actiondelete,
      this.props.history
    );
  }
  render() {
    const {
      prodwarehouseorigin,
      prodwarehousetransfer,
      itemquantitytransfer
    } = this.state;

    const { errors } = this.state;

    const { stock } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

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
          { label: "* Select Your Warehouse", value: 0 }
        ];

        // concat function is used for join two arrays
        warehouseoptions = firstoptinsellist.concat(actualwarehouses);

        // console.log(warehouseoptions);
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
                        onChange={this.handleOriginChange}
                        options={warehouseoptions}
                        error={errors.prodwarehouseorigin}
                        info="Product Warehouse Origin"
                      />
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
                      {/*console.log(originwarehousestks)*/}
                      {/*originwarehousestks.finalwarehouseproducts &&
                        originwarehousestks.finalwarehouseproducts.map(
                          (item, index) => {
                            return (
                              <TextFieldGroup
                                key={item._id}
                                type="number"
                                placeholder={`* Transfer Qty #${index} `}
                                //  onChange={this.handleInputChange.bind(this, row.index)}
                                onChange={e =>
                                  this.handleInputChange(index, e.target.value)
                                }
                                value={this.state.itemquantitytransfer[index]}
                              />
                            );
                          }
                        )*/}
                      <MyTable
                        action={this.handleInputChange}
                        itemquantitytransfer={itemquantitytransfer}
                        mydata={originwarehousestks.finalwarehouseproducts}
                      />
                    </div>
                  )}
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
  warehouse: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  stock: state.stock,
  warehouse: state.warehouse,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  { getCurrentStock, getCurrentWarehouses, getCurrentOriginWareStock }
)(withRouter(StockTransfer));
