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
  createWareHouseTransfer,
  addtransprodtosession,
  getCurrentSessionWarehoustrans,
  warehoustransdeletebyidinsession
} from "../../actions/warehousetransAction";

import isEmpty from "../../validation/is-empty";

import Spinner from "../common/Spinner";

import WarehouseTransferSpinner from "../common/WarehouseTransferSpinner";

//import { Tbl } from "./Tbl";

import "./model.css";

import "./jquery.dataTables.css";
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

class TranferQtyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemindex: ""
    };
  }

  componentDidMount() {
    this.props.tblData.map((item, index) => {
      if (item._id == this.props.rowData._id) {
        //   console.log(item._id + " at index : " + index);
        this.setState({ itemindex: index });
      }
    });
  }

  render() {
    const { itemindex } = this.state;
    return (
      <td>
        {/*console.log(
          this.props.rowData,
          this.props.tdData,
          "_id is : " + this.props.rowData._id
        )*/}

        <TextFieldGroup
          type="text"
          placeholder={`* Transfer Qty`}
          onChange={this.props.action.bind(this, itemindex)}
          //onChange={e => this.props.action(this.props.tdData, e.target.value)}
          value={this.props.itemquantitytransfer[itemindex]}
        />
      </td>
    );
  }
}

class TranferfinallyComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemindex: ""
    };
    this.deleteItem = this.deleteItem.bind(this);
  }

  componentDidMount() {
    this.props.tblData.map((item, index) => {
      if (item._id == this.props.rowData._id) {
        //console.log(item._id + " at index : " + index);
        this.setState({ itemindex: index });
      }
    });
  }

  deleteItem() {
    alert("delete " + this.props.rowData._id);
    console.log(this.props.rowData, this.props.tdData);
  }

  transfinclick() {
    this.props.transferclick(
      this.props.rowData._id,
      this.props.itemquantitytransfer[this.state.itemindex]
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
          onClick={this.transfinclick.bind(this)}
          /*  onClick={this.props.transferclick.bind(
            this,
            this.props.rowData._id,
            this.props.itemquantitytransfer[this.props.rowData._id]
          )}*/
          // onClick={this.onAddtocartClick.bind(this, row.value)}
          className="btn btn-default"
          style={{
            textDecoration: "none",
            color: "white",
            backgroundColor: "#0085C3"
          }}
        >
          ADD IN LIST
        </button>
      </td>
    );
  }
}

/*ranferfinallyComponent.propTypes = {
  transferclick: React.PropTypes.func
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

class StockTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodwarehouseorigin: "",
      prodwarehousetransfer: "",
      itemquantitytransfer: [],
      wtransstockdtall: [],
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

    this.props.getCurrentSessionWarehoustrans();
    this.props.getCurrentStock();
    this.props.getCurrentWarehouses();

    this.props.getCurrentOriginWareStock(this.state.prodwarehouseorigin);
  }

  componentDidUpdate(prevProps, prevState) {
    /* console.log(this.el);

    $(document).ready(function() {
      $("#example").DataTable();
    });*/
    const { prodwarehouseorigin } = this.state;
    if (this.state.prodwarehouseorigin == "" || 0) {
      console.log("select origin");
    } else {
      if (prevState.prodwarehouseorigin !== this.state.prodwarehouseorigin) {
        //dispatch(searchAction(this.state.search));
        this.props.getCurrentOriginWareStock(this.state.prodwarehouseorigin);
        console.log(
          "prodwarehouseorigin is : " + this.state.prodwarehouseorigin
        );
      }
    }
  }

  componentWillUnmount() {
    //this.$el.DataTable.destroy(true);
  }
  onTransferStockClick(e) {
    if (!this.state.wtransstockdtall) {
      alert("First Make The Warehouse Transfer List");
    }
    if (this.state.wtransstockdtall) {
      console.log("great validation check success");
      console.log("ready to transfer all stock");

      this.props.createWareHouseTransfer(this.props.history);
    }
  }

  onAddtowtransClick(prodstk_id, quantitytrans, e) {
    const { prodwarehouseorigin, prodwarehousetransfer } = this.state;

    console.log("warehouse origin is : " + prodwarehouseorigin);

    console.log("prodstk_id is : " + prodstk_id);
    console.log("quantitytrans is : " + quantitytrans);

    if (prodwarehousetransfer == "" || prodwarehousetransfer == 0) {
      alert("Please Select Transfer Warehouse from the List!!");
    } else if (prodwarehousetransfer == prodwarehouseorigin) {
      alert("Stock Cannot Be Transfer in Same Warehouse!!");
    } else if (parseInt(quantitytrans) <= 0) {
      alert(
        "The Item Transfer Quantity : " + quantitytrans + " be greater then 0 "
      );
    } else if (quantitytrans == null) {
      alert(
        "The Item Transfer Quantity : " + quantitytrans + " Cannot Be Empty!!"
      );
    }

    if (
      !(quantitytrans == null) &&
      !(prodwarehouseorigin == "" || prodwarehouseorigin == 0) &&
      !(prodwarehousetransfer == "" || prodwarehousetransfer == 0) &&
      !(prodwarehousetransfer == prodwarehouseorigin) &&
      !(parseInt(quantitytrans) <= 0)
    ) {
      console.log("great validation check success");
      console.log(
        "trans session data would be : " + prodstk_id,
        prodwarehouseorigin,
        prodwarehousetransfer,
        quantitytrans
      );
      this.props.addtransprodtosession(
        prodstk_id,
        prodwarehouseorigin,
        prodwarehousetransfer,
        quantitytrans,
        this.props.history
      );
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

  handleInputChange = (index, event) => {
    console.log("array index:" + index);
    console.log("array event:" + event.target.value);
    var itemquantitytransfer = this.state.itemquantitytransfer.slice();

    // Make a copy of the itemquantitytransfer first.
    //var itemquantitytransfer = [...itemquantitytransfer];

    itemquantitytransfer[index] = event.target.value; // Update it with the modified itemquantitytransfer.

    this.setState({ itemquantitytransfer: itemquantitytransfer }); // Update the state.

    console.table(itemquantitytransfer);
    /* for (let [key, value] of Object.entries(itemquantitytransfer)) {
      console.log(key, value);
    }
*/
    console.log(
      "product ctn transfer array len is : " +
        Object.keys(this.state.itemquantitytransfer).length
    );
  };
  onSubmit(e) {
    e.preventDefault();

    // this.props.editStock(stockData, this.props.history);
  }

  showModalClick = () => {
    this.setState({ show: true });

    //this.props.getCurrentSessionWarehoustrans();

    axios
      .get("/api/warehousetransfer")
      .then(response => {
        const wtransstockdtall = response.data;
        console.log(response);
        this.setState({ wtransstockdtall });

        console.log(wtransstockdtall.length);
      })
      .catch(error => {
        console.log(error);
      });
  };
  hideModalClick = () => {
    this.setState({ show: false });
  };

  deleteItemfromwtransses = (
    prodstk_id,
    prodwarehouseorigin,
    prodwarehousetransfer,
    quantitytrans,
    actiondelete
  ) => {
    console.log(
      "remove from warehousetransfer session data is : " + prodstk_id,
      prodwarehouseorigin,
      prodwarehousetransfer,
      quantitytrans,
      actiondelete
    );
    this.props.warehoustransdeletebyidinsession(
      prodstk_id,
      prodwarehouseorigin,
      prodwarehousetransfer,
      quantitytrans,
      actiondelete,
      this.props.history
    );

    axios
      .get("/api/warehousetransfer")
      .then(response => {
        const wtransstockdtall = response.data;
        console.log(response);
        this.setState({ wtransstockdtall });

        console.log(wtransstockdtall.length);
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const {
      prodwarehouseorigin,
      prodwarehousetransfer,
      itemquantitytransfer,
      testinput,
      wtransstockdtall,
      errors
    } = this.state;

    const { stock } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

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
          { label: "* Select Your Warehouse", value: 0 }
        ];

        // concat function is used for join two arrays
        warehouseoptions = firstoptinsellist.concat(actualwarehouses);

        // console.log(warehouseoptions);
      }
    }

    const columns = [
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
        Header: "Item Part No",
        accessor: "itempartno",
        maxWidth: 100,
        filterable: true
      },
      {
        Header: "Warehouse Origin",
        accessor: "prodwarehouseorigin",
        maxWidth: 290,
        filterable: true
      },
      {
        Header: "Warehouse Transfer",
        accessor: "prodwarehousetransfer",
        maxWidth: 290,
        filterable: true
      },
      {
        Header: "Quantity Transfer",
        accessor: "quantitytrans",
        maxWidth: 290,
        filterable: true
      },
      {
        Header: "Remove",
        accessor: "forremovepurpose",
        maxWidth: 350,
        Cell: row => (
          <span>
            <center>
              <button
                onClick={e =>
                  this.deleteItemfromwtransses(
                    row.value[0]._id,
                    row.value[0].prodwarehouseorigin,
                    row.value[0].prodwarehousetransfer,
                    row.value[0].quantitytrans,
                    this.state.actiondelete
                  )
                }
                // onClick={this.onAddtocartClick.bind(this, row.value)}
                className="btn btn-default"
                style={{
                  textDecoration: "none",
                  color: "white",
                  backgroundColor: "red"
                }}
              >
                <i class="fa fa-times-circle" />
              </button>
            </center>
          </span>
        )
      }
    ];

    let tHead = [
      "Product Image",
      "Item Part No",
      "Item Tech Name",
      "Available Qty",
      "Transfer Qty",
      "Transfer"
    ];
    let col = [
      "itemprimaryimg",
      "itempartno",
      "itemtechname",
      "quantity",
      "transferqty",
      "transferfinally"
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
                <li className="breadcrumb-item active">Stock Transfer</li>
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
                      <Modal
                        show={this.state.show}
                        handleClose={this.hideModalClick}
                      >
                        <div className="container">
                          <div className="row">
                            <div className="col-md-12">
                              <center>
                                <h3>Stock Transfer List</h3>
                                {wtransstockdtall && (
                                  <button
                                    onClick={e => this.onTransferStockClick()}
                                    // onClick={this.onAddtocartClick.bind(this, row.value)}
                                    className="btn btn-default"
                                    style={{
                                      textDecoration: "none",
                                      color: "white",
                                      backgroundColor: "rgb(63, 94, 165)"
                                    }}
                                  >
                                    <i class="fa fa-exchange" /> Transfer
                                  </button>
                                )}
                                {wtransstockdtall && (
                                  <ReactTable
                                    data={wtransstockdtall}
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
                                  />
                                )}
                              </center>
                            </div>
                          </div>
                        </div>
                      </Modal>
                    </div>
                    <div
                      className="col-md"
                      style={{
                        backgroundColor: "#EBEBEB",
                        textAlign: "right",
                        padding: 10
                      }}
                    >
                      <button class="btn" onClick={e => this.showModalClick()}>
                        <i class="fa fa-list-ol" /> Transfer List
                      </button>
                    </div>
                  </div>
                  <div className="col-12 row">
                    <div
                      className="col-md"
                      style={{ backgroundColor: "#EBEBEB" }}
                    >
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
                          {this.state.prodwarehouseorigin != 0 && (
                            <SortableTbl
                              action={this.handleInputChange.bind(this)}
                              itemquantitytransfer={itemquantitytransfer}
                              transferclick={this.onAddtowtransClick.bind(this)}
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
                                  custd: TranferQtyComponent,
                                  keyItem: "transferqty"
                                },
                                {
                                  custd: TranferfinallyComponent,
                                  keyItem: "transferfinally"
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

StockTransfer.propTypes = {
  stock: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  warehousetransfer: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  stock: state.stock,
  warehouse: state.warehouse,
  warehousetransfer: state.warehousetransfer,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    getCurrentStock,
    getCurrentWarehouses,
    getCurrentOriginWareStock,
    createWareHouseTransfer,
    addtransprodtosession,
    getCurrentSessionWarehoustrans,
    warehoustransdeletebyidinsession
  }
)(withRouter(StockTransfer));
