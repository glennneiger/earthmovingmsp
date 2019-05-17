import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import "./css/newstockhistory.css";

import { CSVLink } from "react-csv";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { deleteStock } from "../../actions/stockActions";
import { singleprodstockbyid } from "../../actions/stockActions";

import { getCurrentProfile } from "../../actions/profileActions";
import {
  getCurrentStock,
  getExistingStockHistoryProdStockDates,
  getExistingStockHistorybyDate
} from "../../actions/stockActions";

import StockActions from "../dashboard/StockActions";

import Spinner from "../common/Spinner";

import Moment from "react-moment";

class NewStockHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockdtall: []
    };
  }
  componentDidMount() {
    this.props.getCurrentProfile(); //here we call the getCurrentProfile when componentDidMount

    this.props.getCurrentStock();

    // this.props.getExistingStockHistoryProdStockDates();

    /*  $("button").on("click", function() {
      alert("test alert using jquery");
    });
*/

    axios
      .get("/api/stock/existingstockhistoryall")
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
    const { profile, loading } = this.props.profile;

    const { stock } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    const stockdtall = this.state.stockdtall;

    const stockdtalllen = stockdtall.length;

    const columns = [
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
        Header: "CREATED DATE",
        accessor: "date",
        filterable: true
      },
      {
        Header: "Operation",
        columns: [
          {
            Header: "Stock View",
            accessor: "date",
            filterable: false,
            Cell: row => (
              <span>
                <center>
                  <Link
                    target="_blank"
                    to={`/existing-stock-history-by-date/${row.value}`}
                    className="btn btn-primary"
                    style={{ textDecoration: "none", color: "white" }}
                  >
                    All Stock By Date
                  </Link>
                </center>
              </span>
            )
          }
        ]
      }
    ];

    return (
      <div>
        <StockActions />
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Existing Stock History</li>
        </ol>

        <div className="col-12 row">
          <div className="col-12">
            <center>
              <div class="panel panel-default">
                <div
                  class="panel-heading"
                  style={{ backgroundColor: "#0085C3", maxWidth: "800px" }}
                >
                  <h4 style={{ padding: "10px", color: "#fff" }}>
                    Existing Stock History
                  </h4>
                </div>

                <div
                  class="panel-heading"
                  style={{ backgroundColor: "#e6e6e6", maxWidth: "800px" }}
                >
                  {" "}
                  <div
                    style={{
                      padding: "10px",
                      color: "#fff",
                      textAlign: "right"
                    }}
                  >
                    <span>
                      <span>
                        {" "}
                        <CSVLink
                          data={stockdtall}
                          filename={"Inventory-Stock.csv"}
                          className="btn btn-sm btn-success"
                        >
                          Export CSV
                        </CSVLink>
                      </span>

                      <span>
                        <p>
                          {stockdtalllen === 0 ? (
                            <span>
                              <p> Total Stock Item: Loding..</p>
                            </span>
                          ) : (
                            <span>
                              <p> Total Stock Item: {stockdtalllen}</p>
                            </span>
                          )}
                        </p>
                      </span>
                    </span>
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
                              height: "600px", // This will force the table body to overflow and scroll, since there is not enough room
                              maxWidth: "800px"
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
    );
  }
}

NewStockHistory.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentStock: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  stock: PropTypes.object.isRequired,
  deleteStock: PropTypes.func.isRequired,
  getExistingStockHistoryProdStockDates: PropTypes.func.isRequired,
  getExistingStockHistorybyDate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  stock: state.stock,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    getCurrentStock,
    deleteStock,
    singleprodstockbyid,
    getExistingStockHistoryProdStockDates,
    getExistingStockHistorybyDate
  }
)(withRouter(NewStockHistory));
