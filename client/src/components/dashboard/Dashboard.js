import React, { Component } from "react";
//import Modal from "react-responsive-modal";

import ReactTable from "react-table";

import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import StockActions from "./StockActions";

import { getAdvSearchInvStock } from "../../actions/warehouseActions";

import Spinner from "../common/Spinner";

import "./css/dashboard.css";

import "./css/model.css";

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";

  return (
    <div className={showHideClassName}>
      <section className="modal-main">
        {children}
        <center>
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
        </center>
      </section>
    </div>
  );
};

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      show: false,
      querystr: "",
      advsearchdtall: []
    };

    this.onChange = this.onChange.bind(this);

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    //here we call the getCurrentProfile when componentDidMount
    //this.props.getCurrentSalesOrder();
    // this.props.getCurrentStock();
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
      this.setState({
        show: true,
        querystr: querystr
      });
      console.log("enter press here! ");
      console.log("query string is : " + querystr);
      this.props.getAdvSearchInvStock(querystr);
    }
  };

  showModalClick = querystr => {
    if (querystr) {
      this.setState({
        show: true,
        querystr: querystr
      });
      this.props.getAdvSearchInvStock(querystr);
    } else {
      console.log("search something..");
    }
  };
  hideModalClick = () => {
    this.setState({ show: false, querystr: "" });
    console.log("querystr set to : '' ");
  };

  render() {
    const { open, querystr } = this.state;
    const { user } = this.props.auth;

    const { advsearchresult, loading } = this.props.warehouse;

    let AdvSearchContent;
    let advsearchdtall;
    let advsearchdtalllen;
    let columns = [];

    let headers = [];
    let csvContent;
    if (advsearchresult === null) {
      AdvSearchContent = <Spinner />;
    } else {
      advsearchdtall = advsearchresult;
      advsearchdtalllen = advsearchresult.length;

      headers = [
        { label: "Item Unique ID", key: "_id" },
        { label: "Item Tech Name", key: "itemtechname" },
        { label: "Item Part No", key: "itempartno" },
        { label: "Machine Names", key: "machinenames" },
        { label: "Item ID With Unit", key: "itemidwithunit" },
        { label: "Item OD With Unit", key: "itemodwithunit" },
        { label: "Item Length With Unit", key: "itemlengthwithunit" },
        { label: "Item Thickness With Unit", key: "itemthicknesswithunit" },
        { label: "Item Hsn Code", key: "hsncode" },
        { label: "Item Min Rate", key: "minrate" },
        { label: "Item Rate", key: "rate" },
        { label: "Item Max Rate", key: "maxrate" },
        { label: "Item Primary Image", key: "itemprimaryimg" }
      ];

      csvContent = (
        <CSVLink
          data={advsearchresult.finalallstock}
          headers={headers}
          filename={"Inventory-advsearchresult.csv"}
          className="btn btn-sm btn-success"
        >
          Export CSV
        </CSVLink>
      );
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
          Header: "Item Part No",
          accessor: "itempartno",
          maxWidth: 200,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Item Tech Name",
          accessor: "itemtechname",
          maxWidth: 300,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "ID",
          accessor: "itemidwithunit",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>
                {row.value.map(data => {
                  return data;
                })}
              </center>
            </span>
          )
        },
        {
          Header: "OD",
          accessor: "itemodwithunit",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>
                {row.value.map(data => {
                  return data;
                })}
              </center>
            </span>
          )
        },
        {
          Header: "Length",
          accessor: "itemlengthwithunit",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>
                {row.value.map(data => {
                  return data;
                })}
              </center>
            </span>
          )
        },
        {
          Header: "Thickness",
          accessor: "itemthicknesswithunit",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>
                {row.value.map(data => {
                  return data;
                })}
              </center>
            </span>
          )
        },
        {
          Header: "Machine Names",
          accessor: "machinenames",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>
                {row.value.map(data => {
                  return (
                    <h5>
                      <span class="badge badge-success">{data}</span>
                    </h5>
                  );
                })}
              </center>
            </span>
          )
        },
        {
          Header: "Operation",
          columns: [
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
                      className=""
                      style={{
                        textDecoration: "none",
                        color: "#0085C3",
                        cursor: "pointer",
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
      ];
    }

    return (
      <div>
        <StockActions />

        <div
          className="main-content-inner"
          style={{ backgroundColor: "#F9F9F9" }}
        >
          <div className="container">
            <div className="row">
              <Modal
                show={this.state.show}
                handleClose={this.hideModalClick}
                center
              >
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <center>
                        <div
                          class="form-group col-md-12"
                          style={{ padding: 5 }}
                        >
                          <p>
                            Query String : <b>{this.state.querystr}</b>
                          </p>
                          <div
                            class="panel-heading"
                            style={{
                              backgroundColor:
                                "#e6e6e6" /*, maxWidth: "800px" */
                            }}
                          >
                            <div style={{ textAlign: "right" }}>
                              {advsearchresult &&
                                advsearchdtall.finalallstock.length > 0 &&
                                csvContent}
                            </div>
                          </div>

                          <div class="panel-body">
                            <div>
                              <div>
                                {advsearchresult && (
                                  <div>
                                    {/*{console.log(advsearchdtall)}*/}
                                    <ReactTable
                                      data={advsearchdtall.finalallstock}
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
                                        height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                                        /*, maxWidth: "800px" */
                                      }}
                                      className="-striped -highlight"
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </center>
                    </div>
                  </div>
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
                        <a
                          href="#"
                          class="search_icon"
                          onClick={e => this.showModalClick(querystr)}
                        >
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
  auth: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  getAdvSearchInvStock: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  warehouse: state.warehouse
});

export default connect(
  mapStateToProps,
  { getAdvSearchInvStock }
)(withRouter(Dashboard));
