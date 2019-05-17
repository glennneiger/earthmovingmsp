import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import "./css/warehousetransferhis.css";

import { CSVLink } from "react-csv";

import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";

import { getAllWarehoustransHistoryProdStockDates } from "../../actions/warehousetransAction";

import { getCurrentProfile } from "../../actions/profileActions";

import StockActions from "../dashboard/StockActions";

import Spinner from "../common/Spinner";

import Moment from "react-moment";

class WarehouseTransferHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // salesorderall: []
    };
  }
  componentDidMount() {
    this.props.getCurrentProfile(); //here we call the getCurrentProfile when componentDidMount

    this.props.getAllWarehoustransHistoryProdStockDates();

    /*  $("button").on("click", function() {
      alert("test alert using jquery");
    });
*/

    {
      /*   axios
      .get("/api/salesorder/all")
      .then(response => {
        const salesorderall = response.data;
        //console.log(salesorderall);
        this.setState({ salesorderall });
      })
      .catch(error => {
        console.log(error);
      });

    */
    }
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;

    const { warehousetransferhistory } = this.props.warehousetransfer;

    let warehousetransferhistoryContent;
    let warehousetransferhistorycsvcontent;

    if (warehousetransferhistory === null) {
      warehousetransferhistoryContent = <Spinner />;
    } else {
      if (Object.keys(warehousetransferhistory).length > 0) {
        const warehousetransferhistorylen = Object.keys(
          warehousetransferhistory
        ).length;
        //console.log(warehousetransferhistorylen);

        warehousetransferhistorycsvcontent = (
          <div>
            <CSVLink
              data={warehousetransferhistory}
              filename={"Warehouse-transfer.csv"}
              className="btn btn-sm btn-success"
            >
              Export CSV
            </CSVLink>
          </div>
        );
      }
      if (Object.keys(warehousetransferhistory).length > 0) {
        const warehousetransferhistorylen = Object.keys(
          warehousetransferhistory
        ).length;
        //  console.log(warehousetransferhistorylen);
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
                        to={`/warehouse-transfer-history-by-date/${row.value}`}
                        className="btn btn-primary"
                        style={{ textDecoration: "none", color: "white" }}
                      >
                        All Stock Transfer By Date
                      </Link>
                    </center>
                  </span>
                )
              }
            ]
          }
        ];

        warehousetransferhistoryContent = (
          <div>
            <p className="lead text-muted">
              Total Warehouse Transfer:{" "}
              <strong>{warehousetransferhistorylen}</strong>{" "}
            </p>

            <div>
              {/*{console.log(salesorder)}*/}
              <ReactTable
                data={warehousetransferhistory}
                columns={columns}
                defaultPageSize={5}
                pageSizeOptions={[5, 10, 15, 20, 25, 30, 35, 40, 50]}
                style={{
                  height: "600px", // This will force the table body to overflow and scroll, since there is not enough room
                  maxWidth: "800px"
                }}
                className="-striped -highlight"
              />
            </div>
          </div>
        );
      }
    }

    //const salesorderlen = salesorder.length;

    return (
      <div>
        <StockActions />
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
          </li>
          <li className="breadcrumb-item active">Warehouse Transfer History</li>
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
                    Warehouse Transfer History
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
                        {warehousetransferhistorycsvcontent ? (
                          warehousetransferhistorycsvcontent
                        ) : (
                          <div />
                        )}
                      </span>
                    </span>
                  </div>
                </div>

                <div class="panel-body">
                  <div>
                    <div>
                      {warehousetransferhistoryContent ? (
                        warehousetransferhistoryContent
                      ) : (
                        <div>
                          <h2>You Have No Warehouse Transfer Yet!!</h2>
                          <br />
                          Go For :&nbsp;
                          <Link
                            style={{
                              backgroundColor: "grey",
                              padding: "5px",
                              color: "#fff"
                            }}
                            to="/stock-transfer"
                          >
                            New Warehouse Transfer
                          </Link>
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

WarehouseTransferHistory.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  getAllWarehoustransHistoryProdStockDates: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth,
  warehousetransfer: state.warehousetransfer
});

export default connect(
  mapStateToProps,
  {
    getCurrentProfile,
    getAllWarehoustransHistoryProdStockDates
  }
)(withRouter(WarehouseTransferHistory));
