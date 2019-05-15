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
  singlewarehousebyid,
  editWarehouse
} from "../../actions/warehouseActions";
import isEmpty from "../../validation/is-empty";

class EditWarehouse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singwarehousestk: {},
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentWarehouses();

    axios
      .get(`/api/warehouse/singlewarehousebyid/` + this.props.match.params.id)
      .then(res => {
        this.setState({ singwarehousestk: res.data });

        console.log(this.state.singwarehousestk);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    const state = this.state.singwarehousestk;

    state[e.target.name] = e.target.value;

    this.setState({ singwarehousestk: state });
  }

  onSubmit(e) {
    e.preventDefault();

    const {
      warehousename,
      warehouseaddress,
      warehousepincode,
      warehousecity,
      warehousecapacity
    } = this.state.singwarehousestk;

    const warehouseData = {
      warehousename,
      warehouseaddress,
      warehousepincode,
      warehousecity,
      warehousecapacity
    };

    const paramid = this.props.match.params.id;
    // console.log(paramid);
    // console.log("updated singwarehousestk" + warehouseData.totalctn);
    this.props.editWarehouse(warehouseData, paramid, this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const { errors } = this.state;

    const { warehouse } = this.props.warehouse;

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
                    <li className="breadcrumb-item active">Edit Warehouse</li>
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
                              backgroundColor: "#0085C3",
                              padding: "15px",
                              marginBottom: "20px"
                            }}
                          >
                            <h5
                              className="display-8 text-center"
                              style={{ color: "white" }}
                            >
                              Edit Your Warehouse
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
                                    value={
                                      this.state.singwarehousestk.warehousename
                                    }
                                    onChange={this.onChange}
                                    error={errors.warehousename}
                                    info="A unique warehouse Name"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Warehouse Address"
                                    name="warehouseaddress"
                                    value={
                                      this.state.singwarehousestk
                                        .warehouseaddress
                                    }
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
                                    value={
                                      this.state.singwarehousestk
                                        .warehousepincode
                                    }
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
                                    value={
                                      this.state.singwarehousestk.warehousecity
                                    }
                                    onChange={this.onChange}
                                    error={errors.warehousecity}
                                    info="Warehouse City"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Warehouse Capacity"
                                    name="warehousecapacity"
                                    value={
                                      this.state.singwarehousestk
                                        .warehousecapacity
                                    }
                                    onChange={this.onChange}
                                    error={errors.warehousecapacity}
                                    info="Put the Warehouse Capacity"
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

EditWarehouse.propTypes = {
  stock: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  stock: state.stock,
  warehouse: state.warehouse,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    addWarehouse,
    getCurrentWarehouses,
    singlewarehousebyid,
    editWarehouse
  }
)(withRouter(EditWarehouse));
