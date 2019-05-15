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
  getCurrentWarehouses
} from "../../actions/warehouseActions";
import isEmpty from "../../validation/is-empty";

class AddWarehouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warehousename: "",
      warehouseaddress: "",
      warehousepincode: "",
      warehousecity: "",
      warehousecapacity: "",
      warehouseImage: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentWarehouses();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange = e => {
    switch (e.target.name) {
      case "warehouseImage":
        this.setState({ warehouseImage: e.target.files[0] });
        break;
      default:
        this.setState({ [e.target.name]: e.target.value });
    }
  };

  onSubmit(e) {
    e.preventDefault();

    const {
      warehousename,
      warehouseaddress,
      warehousepincode,
      warehousecity,
      warehousecapacity,
      warehouseImage
    } = this.state;

    let warehouseData = new FormData();
    warehouseData.append("warehousename", warehousename);
    warehouseData.append("warehouseaddress", warehouseaddress);

    warehouseData.append("warehousepincode", warehousepincode);
    warehouseData.append("warehousecity", warehousecity);

    warehouseData.append("warehousecapacity", warehousecapacity);

    warehouseData.append("warehouseImage", warehouseImage);
    console.log(warehouseData);
    this.props.addWarehouse(warehouseData, this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { errors } = this.state;

    const {
      warehousename,
      warehouseaddress,
      warehousepincode,
      warehousecity,
      warehousecapacity
    } = this.state;

    return (
      <div>
        <StockActions />
        <div id="wrapper">
          <div id="content-wrapper">
            <div className="container-fluid">
              <div className="row">
                <div className="col-md-12">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <Link to="/">Dashboard </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/warehouse-setting">Warehouse Setting </Link>
                    </li>
                    <li className="breadcrumb-item active">Add Warehouse</li>
                  </ol>
                  <div>
                    <div className="row">
                      <div className="col-md-10 m-auto">
                        <p className="lead text-center">
                          Let's get some information to make your Warehouse
                          Stand Out
                        </p>
                        <small className="d-block pb-3">
                          * = required fields
                        </small>

                        <div
                          class="panel panel-default"
                          style={{
                            backgroundColor: "#efefef",
                            padding: "25px"
                          }}
                        >
                          <div
                            class="panel-heading"
                            style={{
                              backgroundColor: "rgb(0, 133, 195)",
                              padding: "15px",
                              marginBottom: "20px"
                            }}
                          >
                            <h5
                              className="display-8 text-center"
                              style={{ color: "white" }}
                            >
                              Add Your Warehouse
                            </h5>
                          </div>

                          <div
                            class="panel-body"
                            /*  style={{ height: "500px", overflowY: "scroll" }}
                             */
                          >
                            <form
                              onSubmit={this.onSubmit}
                              enctype="multipart/form-data"
                            >
                              <div class="form-row">
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Warehouse Name"
                                    name="warehousename"
                                    value={warehousename.toLowerCase()}
                                    onChange={this.onChange}
                                    error={errors.warehousename}
                                    info="A unique warehouse Name"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Warehouse Address"
                                    name="warehouseaddress"
                                    value={warehouseaddress}
                                    onChange={this.onChange}
                                    error={errors.warehouseaddress}
                                    info="Put the Warehouse Address"
                                  />
                                </div>

                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Warehouse Pincode"
                                    name="warehousepincode"
                                    type="number"
                                    value={warehousepincode}
                                    onChange={this.onChange}
                                    error={errors.warehousepincode}
                                    info="Warehouse Pincode"
                                  />
                                </div>
                              </div>

                              <div class="form-row">
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Warehouse City"
                                    name="warehousecity"
                                    value={warehousecity.toLowerCase()}
                                    onChange={this.onChange}
                                    error={errors.warehousecity}
                                    info="Warehouse City"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="Warehouse Capacity"
                                    name="warehousecapacity"
                                    value={warehousecapacity}
                                    onChange={this.onChange}
                                    error={errors.warehousecapacity}
                                    info="Put the Warehouse Capacity"
                                  />
                                </div>

                                <div class="input-group col-md-6">
                                  <input
                                    type="file"
                                    name="warehouseImage"
                                    onChange={this.onChange}
                                  />
                                </div>

                                <input
                                  type="submit"
                                  value="Submit"
                                  className="btn btn-info btn-block mt-4"
                                />
                                <br />
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*} <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up" />
  </a>*/}
      </div>
    );
  }
}

AddWarehouse.propTypes = {
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
  { addWarehouse, getCurrentWarehouses }
)(withRouter(AddWarehouse));
