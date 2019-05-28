import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import "./advinsrh.css";

import { CSVLink } from "react-csv";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import {
  getCurrentAllStock,
  deleteStock,
  singleprodstockbyid
} from "../../actions/stockActions";

import { getAdvSearchInvStock } from "../../actions/warehouseActions";

import StockActions from "../dashboard/StockActions";

import Spinner from "../common/Spinner";

import Moment from "react-moment";

class AdvancedInventorySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      advsearchdtall: [],
      querystr: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentDidMount() {
    this.props.getCurrentAllStock();

    /*  $("button").on("click", function() {
      alert("test alert using jquery");
    });
*/

    /*  axios
      .get("/api/warehouse/viewalladvsearchstock")
      .then(response => {
        const advsearchdtall = response.data;
        //console.log(advsearchdtall);
        this.setState({ advsearchdtall });
      })
      .catch(error => {
        console.log(error);
      });*/
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
      this.props.getAdvSearchInvStock(querystr);
    } else {
      console.log("search something..");
    }
  };

  handleKeyPress = event => {
    const { querystr } = this.state;

    if (event.key == "Enter" && querystr) {
      console.log("enter press here! ");
      this.props.getAdvSearchInvStock(querystr);
    }
  };

  onDeleteClick(id) {
    this.props.deleteStock(id, this.props.history); //this.props.history => this allows to do redirect functionality in deleteStock -> this action for this we use withRouter when we export class component
  }
  onEditClick(id) {
    console.log(id);
    this.props.singleprodstockbyid(id, this.props.history); //this.props.history => this allows to do redirect functionality in deleteStock -> this action for this we use withRouter when we export class component

    this.props.history.push("/edit-stock");
  }

  render() {
    const { querystr } = this.state;

    const { user } = this.props.auth;

    const { stock } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    // const advsearchdtall = this.state.advsearchdtall;

    //const advsearchdtalllen = advsearchdtall.length;

    const { advsearchresult, loading } = this.props.warehouse;

    let AdvSearchContent;
    let advsearchdtall;
    let advsearchdtalllen;
    let columns = [];
    let csvContent;
    if (advsearchresult === null) {
      AdvSearchContent = <Spinner />;
    } else {
      advsearchdtall = advsearchresult;
      advsearchdtalllen = advsearchresult.length;
      csvContent = (
        <CSVLink
          data={advsearchresult.finalallstock}
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
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">View Stock</li>
        </ol>
        <div className="container-fluid">
          <div className="col-12 row">
            <div className="col-12">
              <div class="panel panel-default">
                <div
                  class="panel-heading"
                  style={{
                    backgroundColor: "#0085C3" /*, maxWidth: "800px" */
                  }}
                >
                  <h4
                    style={{
                      padding: "10px",
                      color: "#fff",
                      textAlign: "center"
                    }}
                  >
                    Advanced Inventory Search
                  </h4>
                </div>

                <div
                  class="panel-heading"
                  style={{
                    backgroundColor: "#e6e6e6" /*, maxWidth: "800px" */
                  }}
                >
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
                              placeholder="Search by item code, item name and machine part,company name..."
                            />
                            <a
                              href="javascript:void(0)"
                              class="search_icon"
                              onClick={this.onSubmit}
                            >
                              <i class="fa fa-search" />
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {advsearchresult &&
                      advsearchdtall.finalallstock.length == null &&
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
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AdvancedInventorySearch.propTypes = {
  getCurrentStock: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  stock: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  deleteStock: PropTypes.func.isRequired,
  getAdvSearchInvStock: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  stock: state.stock,
  warehouse: state.warehouse,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentAllStock, deleteStock, singleprodstockbyid, getAdvSearchInvStock }
)(withRouter(AdvancedInventorySearch));
