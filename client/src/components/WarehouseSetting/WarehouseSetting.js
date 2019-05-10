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
  addWarehouse,
  getCurrentWarehouses,
  deleteWarehousebyid
} from "../../actions/warehouseActions";

import isEmpty from "../../validation/is-empty";
import "./warehousesetting.css";

import Spinner from "../common/Spinner";

class WarehouseSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentWarehouses();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.warehouse !== this.props.warehouse) {
      //this.props.getCurrentWarehouses();
    }
  }

  onDeleteClick(id) {
    // console.log(id);
    this.props.deleteWarehousebyid(id, this.props.history); //this.props.history => this allows to do redirect functionality in deleteWarehouse -> this action for this we use withRouter when we export class component
  }

  onDeleteProdCategClick(id) {
    // console.log(id);
    this.props.deleteProdcategbyid(id, this.props.history);
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

  render() {
    const { errors } = this.state;

    const { warehouse, loading } = this.props.warehouse;
    let warehouseContent;
    let TotalWarehouseItem;
    let TotalSalesOrder;

    if (warehouse === null || loading) {
      warehouseContent = <Spinner />;
    } else {
      if (Object.keys(warehouse).length > 0) {
        TotalWarehouseItem = Object.keys(warehouse).length;
        // console.log("Total Warehouse is : " + TotalWarehouseItem);

        const warehouseData = warehouse.map(warehouse => (
          <div
            className="col-12 col-md-4"
            key={warehouse._id}
            style={{ padding: "5px" }}
          >
            <div class="card">
              <div class="card-header bg-transparent border-success">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <Link
                        to={`/edit-warehouse/${warehouse._id}`}
                        style={{ backgroundColor: "#fff", color: "goldenrod" }}
                      >
                        <i
                          class="fa fa-pencil-square-o mr-2"
                          aria-hidden="true"
                        />
                        Edit
                      </Link>
                    </div>{" "}
                    <div className="col-md-6">
                      <span
                        onClick={this.onDeleteClick.bind(this, warehouse._id)}
                        style={{
                          backgroundColor: "#fff",
                          color: "red",
                          cursor: "pointer"
                        }}
                      >
                        <b>
                          <i class="fa fa-trash mr-2" aria-hidden="true" />
                          Delete
                        </b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <img
                class="card-img-top"
                style={{ width: "100%", height: 150 }}
                src={warehouse.warehouseImage}
              />
              <div class="card-body">
                <h5 class="card-title">Name: {warehouse.warehousename}</h5>
                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>Address:</b> {warehouse.warehouseaddress}
                </p>

                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>Pincode:</b> {warehouse.warehousepincode}
                </p>

                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>City:</b> {warehouse.warehousecity}
                </p>
                {warehouse.racks && (
                  <p
                    class="card-text"
                    style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                  >
                    <b>Racks:</b> {warehouse.racks}
                  </p>
                )}
              </div>
              {warehouse.warehousecapacity && (
                <div class="card-footer bg-transparent border-success">
                  <b style={{ color: "green" }}>Capacity:</b>{" "}
                  {warehouse.warehousecapacity}
                </div>
              )}
            </div>
          </div>
        ));

        warehouseContent = <div class="col-12 row">{warehouseData}</div>;
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
                <li className="breadcrumb-item active">Warehouse Setting</li>
              </ol>
            </div>
          </div>

          <div className="col-12 tabs">
            <div class="">
              <div class="col-12 row">
                <div class="col-12">
                  <div class="tab-content">
                    <div class="tab-pane active" id="tab_a">
                      <div
                        style={{
                          textAlign: "right",
                          backgroundColor: "#F5F5F5"
                        }}
                      >
                        <ul class="nav navbar navbar-left d-flex d-inline-flex ">
                          <li class="nav-item d-inline-flex  align-items-center mr-2">
                            <Link
                              class="nav-link d-inline-flex"
                              to="/add-warehouse"
                              style={{
                                backgroundColor: "#333333",
                                color: "#fff"
                              }}
                            >
                              <i
                                class="fa fa-plus-circle mr-2"
                                aria-hidden="true"
                              />
                              ADD WAREHOUSE
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {warehouseContent}
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

WarehouseSetting.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  warehouse: state.warehouse,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  { addWarehouse, getCurrentWarehouses, deleteWarehousebyid }
)(withRouter(WarehouseSetting));
