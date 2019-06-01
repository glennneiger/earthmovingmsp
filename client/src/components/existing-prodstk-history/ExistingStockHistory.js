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
  getAddExisStockHistoryDates,
  getRemoveExisStockHistoryDates,
  getEditExisStockHistoryDates,
  getAddExisHisbyDate
} from "../../actions/stockActions";

import StockActions from "../dashboard/StockActions";

import Spinner from "../common/Spinner";

import Moment from "react-moment";

class ExistingStockHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addstockdtall: []
    };
  }
  componentDidMount() {
    this.props.getCurrentProfile(); //here we call the getCurrentProfile when componentDidMount

    this.props.getCurrentStock();

    this.props.getAddExisStockHistoryDates();
    this.props.getRemoveExisStockHistoryDates();
    this.props.getEditExisStockHistoryDates();

    /*  $("button").on("click", function() {
      alert("test alert using jquery");
    });
*/

    /* axios
      .get("/api/stock/existaddstockhisalldates")
      .then(response => {
        const addstockdtall = response.data;
        //console.log(addstockdtall);
        this.setState({ addstockdtall });
      })
      .catch(error => {
        console.log(error);
      });*/
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

    const {
      stock,
      existingaddstockhistory,
      existingaddstockhistoryloading,
      existingaddstockhistorybydate,
      existingremovstockhistory,
      existingremovstockhistoryloading,
      existingremovstockhistorybydate,
      existingeditstockhistory,
      existingeditstockhistoryloading,
      existingeditstockhistorybydate
    } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    let showexistingaddstockhistory;

    let addstkhiscolumns = [];

    if (existingaddstockhistory === null) {
      showexistingaddstockhistory = <Spinner />;
    } else {
      if (Object.keys(existingaddstockhistory).length > 0) {
        addstkhiscolumns = [
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
            Header: "Added Date",
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

        showexistingaddstockhistory = (
          <ReactTable
            showPaginationBottom={false}
            showPaginationTop={true}
            data={existingaddstockhistory}
            columns={addstkhiscolumns}
            defaultPageSize={5}
            pageSizeOptions={[
              10,
              30,
              60,
              90,
              120,
              150,
              180,
              210,
              240,
              270,
              300
            ]}
            style={
              {
                //height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                /*, maxWidth: "800px" */
              }
            }
            className="-striped -highlight"
          />
        );
      }
    }

    let showexistingremovestockhistory;

    let removestkhiscolumns = [];

    if (existingremovstockhistory === null) {
      showexistingremovestockhistory = <Spinner />;
    } else {
      if (Object.keys(existingremovstockhistory).length > 0) {
        removestkhiscolumns = [
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
            Header: "Removed Qty Date",
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

        showexistingremovestockhistory = (
          <ReactTable
            showPaginationBottom={false}
            showPaginationTop={true}
            data={existingremovstockhistory}
            columns={removestkhiscolumns}
            defaultPageSize={5}
            pageSizeOptions={[
              10,
              30,
              60,
              90,
              120,
              150,
              180,
              210,
              240,
              270,
              300
            ]}
            style={
              {
                //height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                /*, maxWidth: "800px" */
              }
            }
            className="-striped -highlight"
          />
        );
      }
    }

    let showexistingeditstockhistory;

    let editstkhiscolumns = [];

    if (existingeditstockhistory === null) {
      showexistingeditstockhistory = <Spinner />;
    } else {
      if (Object.keys(existingeditstockhistory).length > 0) {
        editstkhiscolumns = [
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
            Header: "Edited Date",
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

        showexistingeditstockhistory = (
          <ReactTable
            showPaginationBottom={false}
            showPaginationTop={true}
            data={existingeditstockhistory}
            columns={editstkhiscolumns}
            defaultPageSize={5}
            pageSizeOptions={[
              10,
              30,
              60,
              90,
              120,
              150,
              180,
              210,
              240,
              270,
              300
            ]}
            style={
              {
                //height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                /*, maxWidth: "800px" */
              }
            }
            className="-striped -highlight"
          />
        );
      }
    }

    return (
      <div>
        <StockActions />
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Edited Stock History</li>
        </ol>

        <div class="container-fluid">
          <nav>
            <div class="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
              <a
                class="nav-item nav-link active"
                id="nav-home-tab"
                data-toggle="tab"
                href="#nav-home"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
              >
                Added Stock History Dates
              </a>
              <a
                class="nav-item nav-link"
                id="nav-profile-tab"
                data-toggle="tab"
                href="#nav-profile"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                Edited Stock History Dates
              </a>
              <a
                class="nav-item nav-link"
                id="nav-contact-tab"
                data-toggle="tab"
                href="#nav-contact"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
              >
                Removed Stock History Dates
              </a>
            </div>
          </nav>
          <div class="tab-content py-3 px-3 px-sm-0" id="nav-tabContent">
            <div
              class="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              <br />
              <div className="container-fluid">
                <br />{" "}
                {showexistingaddstockhistory ? (
                  showexistingaddstockhistory
                ) : (
                  <div>
                    <p style={{ textAlign: "center" }}>No Data</p>
                  </div>
                )}
              </div>
            </div>

            <div
              class="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              {showexistingeditstockhistory ? (
                showexistingeditstockhistory
              ) : (
                <div>
                  <p style={{ textAlign: "center" }}>No Data</p>
                </div>
              )}
            </div>
            <div
              class="tab-pane fade"
              id="nav-contact"
              role="tabpanel"
              aria-labelledby="nav-contact-tab"
            >
              {showexistingremovestockhistory ? (
                showexistingremovestockhistory
              ) : (
                <div>
                  <p style={{ textAlign: "center" }}>No Data</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ExistingStockHistory.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  getCurrentStock: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  stock: PropTypes.object.isRequired,
  deleteStock: PropTypes.func.isRequired,
  getAddExisStockHistoryDates: PropTypes.func.isRequired,
  getRemoveExisStockHistoryDates: PropTypes.func.isRequired,
  getEditExisStockHistoryDates: PropTypes.func.isRequired,
  getAddExisHisbyDate: PropTypes.func.isRequired
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
    getAddExisStockHistoryDates,
    getRemoveExisStockHistoryDates,
    getEditExisStockHistoryDates,
    getAddExisHisbyDate
  }
)(withRouter(ExistingStockHistory));
