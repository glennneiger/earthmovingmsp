import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import "./css/viewstock.css";

import { CSVLink } from "react-csv";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import {
  getCurrentAllStock,
  deleteStock,
  singleprodstockbyid
} from "../../actions/stockActions";

import StockActions from "./StockActions";

import Spinner from "../common/Spinner";

import Moment from "react-moment";

class ViewStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockdtall: []
    };
  }
  componentDidMount() {
    this.props.getCurrentAllStock();

    /*  $("button").on("click", function() {
      alert("test alert using jquery");
    });
*/

    axios
      .get("/api/stock/viewallstock")
      .then(response => {
        const stockdtall = response.data;
        //console.log(stockdtall);
        this.setState({ stockdtall });
      })
      .catch(error => {
        console.log(error);
      });
  }

  onDeleteClick(id) {
    this.props.deleteStock(id, this.props.history); //this.props.history => this allows to do redirect functionality in deleteStock -> this action for this we use withRouter when we export class component
  }
  onEditClick(id) {
    console.log(id);
    this.props.singleprodstockbyid(id, this.props.history); //this.props.history => this allows to do redirect functionality in deleteStock -> this action for this we use withRouter when we export class component

    this.props.history.push("/edit-stock");
  }

  render() {
    const { user } = this.props.auth;

    const { stock, loading } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    // const stockdtall = this.state.stockdtall;

    //const stockdtalllen = stockdtall.length;

    let stockContent;
    let stockdtall;
    let stockdtalllen;
    let columns = [];
    let csvContent;
    if (stock === null) {
      stockContent = <Spinner />;
    } else {
      stockdtall = stock;
      stockdtalllen = stock.length;
      csvContent = (
        <CSVLink
          data={stock}
          filename={"Inventory-Stock.csv"}
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
          Header: "Quantity",
          accessor: "quantity",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Rate",
          accessor: "rate",
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
              Header: "Edit",
              accessor: "_id",
              maxWidth: 50,
              sortable: false,
              Cell: row => (
                <span>
                  <center>
                    <Link
                      to={`/edit-stock/${row.value}`}
                      className="ui basic button green"
                      style={{
                        color: "green",
                        cursor: "pointer",
                        fontSize: 25
                      }}
                    >
                      <i class="fa fa-edit" />
                    </Link>
                  </center>
                </span>
              )
            },
            {
              Header: "Delete",
              accessor: "_id",
              maxWidth: 100,
              sortable: false,
              Cell: row => (
                <span>
                  <center>
                    <i
                      class="fa fa-trash"
                      onClick={this.onDeleteClick.bind(this, row.value)}
                      style={{
                        color: "red",
                        cursor: "pointer",
                        fontSize: 25
                      }}
                    />
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
            },
            {
              Header: "ADD STOCK",
              accessor: "_id",
              maxWidth: 120,
              filterable: false,
              Cell: row => (
                <span>
                  <center>
                    <Link
                      target="_blank"
                      to={`/add-on-existing-stock/${row.value}`}
                      className=""
                      style={{
                        color: "#AF0808",

                        cursor: "pointer",
                        fontSize: 25
                      }}
                    >
                      <i class="fa fa-plus-circle" />
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
                    Inventory Stock
                  </h4>
                </div>

                <div
                  class="panel-heading"
                  style={{
                    backgroundColor: "#e6e6e6" /*, maxWidth: "800px" */
                  }}
                >
                  <div className="container row" style={{ padding: 20 }}>
                    <div className="col-md-6">
                      <p>
                        {stock === 0 ? (
                          <span>
                            <p> Total Stock Item: Loding..</p>
                          </span>
                        ) : (
                          <span>
                            <p>
                              Total Item:{" "}
                              <b style={{ fontSize: 16 }}>{stockdtalllen}</b>
                            </p>
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-md-6" style={{ textAlign: "right" }}>
                      {stock && csvContent}
                    </div>
                  </div>
                </div>

                <div class="panel-body">
                  <div>
                    <div>
                      {stock === null || loading ? (
                        <Spinner />
                      ) : (
                        <div>
                          {/*{console.log(stockdtall)}*/}
                          <ReactTable
                            data={stockdtall}
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

ViewStock.propTypes = {
  getCurrentStock: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  stock: PropTypes.object.isRequired,
  deleteStock: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  stock: state.stock,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentAllStock, deleteStock, singleprodstockbyid }
)(withRouter(ViewStock));
