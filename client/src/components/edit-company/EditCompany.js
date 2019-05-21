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
  addCompany,
  getCurrentCompanies,
  deleteCompanybyid,
  editCompany
} from "../../actions/companyAction";
import isEmpty from "../../validation/is-empty";

import Companyimg from "./img/company2.jpg";

class EditCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      singcompanydata: {},
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentCompanies();

    axios
      .get(`/api/company/singlecompanybyid/` + this.props.match.params.id)
      .then(res => {
        this.setState({ singcompanydata: res.data });

        console.log(this.state.singcompanydata);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onChange(e) {
    const state = this.state.singcompanydata;

    state[e.target.name] = e.target.value;

    this.setState({ singcompanydata: state });
  }

  onSubmit(e) {
    e.preventDefault();

    const {
      companyname,
      companyaddress,
      companypincode,
      companystate,
      companygstno,
      companyemail,
      companycontactno,
      companycontactperson,
      companywebsite,
      companypanno,
      companybankname,
      companybankaccno,
      companybankbranch,
      companybankifsccode,
      companydeclaration
    } = this.state.singcompanydata;

    const companyData = {
      companyname,
      companyaddress,
      companypincode,
      companystate,
      companygstno,
      companyemail,
      companycontactno,
      companycontactperson,
      companywebsite,
      companypanno,
      companybankname,
      companybankaccno,
      companybankbranch,
      companybankifsccode,
      companydeclaration
    };

    const paramid = this.props.match.params.id;
    // console.log(paramid);
    // console.log("updated singcompanydata" + warehouseData.totalctn);
    this.props.editCompany(companyData, paramid, this.props.history);
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
                      <Link to="/company-setting">Company Setting </Link>
                    </li>
                    <li className="breadcrumb-item active">Edit Company</li>
                  </ol>
                  <div>
                    <div className="row">
                      <div className="col-md-10 m-auto">
                        <p className="lead text-center">
                          Let's get some information to make your Company Stand
                          Out
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
                              Edit Your Company
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
                                {this.state.singcompanydata.companyname && (
                                  <div class="form-group col-md-4">
                                    <TextFieldGroup
                                      placeholder="* Company Name"
                                      name="companyname"
                                      value={
                                        this.state.singcompanydata.companyname
                                      }
                                      onChange={this.onChange}
                                      error={errors.companyname}
                                      info="A unique company Name"
                                    />
                                  </div>
                                )}{" "}
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Address"
                                    name="companyaddress"
                                    value={
                                      this.state.singcompanydata.companyaddress
                                    }
                                    onChange={this.onChange}
                                    error={errors.companyaddress}
                                    info="Put the Company Address"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Pincode"
                                    name="companypincode"
                                    type="number"
                                    value={
                                      this.state.singcompanydata.companypincode
                                    }
                                    onChange={this.onChange}
                                    error={errors.companypincode}
                                    info="Company Pincode"
                                  />
                                </div>
                              </div>

                              <div class="form-row">
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company State"
                                    name="companystate"
                                    value={
                                      this.state.singcompanydata.companystate
                                    }
                                    onChange={this.onChange}
                                    error={errors.companystate}
                                    info="Company State"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company GST No"
                                    name="companygstno"
                                    value={
                                      this.state.singcompanydata.companygstno
                                    }
                                    onChange={this.onChange}
                                    error={errors.companygstno}
                                    info="Put the Company GST No"
                                  />
                                </div>

                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Email"
                                    type="email"
                                    name="companyemail"
                                    value={
                                      this.state.singcompanydata.companyemail
                                    }
                                    onChange={this.onChange}
                                    error={errors.companyemail}
                                    info="Put the Company Email"
                                  />
                                </div>

                                <br />
                              </div>

                              <div class="form-row">
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Contact No"
                                    type="number"
                                    name="companycontactno"
                                    value={
                                      this.state.singcompanydata
                                        .companycontactno
                                    }
                                    onChange={this.onChange}
                                    error={errors.companycontactno}
                                    info="Company Contact No"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Contact Person Name"
                                    name="companycontactperson"
                                    value={
                                      this.state.singcompanydata
                                        .companycontactperson
                                    }
                                    onChange={this.onChange}
                                    error={errors.companycontactperson}
                                    info="Put the Company Person Name"
                                  />
                                </div>

                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="Company Website"
                                    name="companywebsite"
                                    value={
                                      this.state.singcompanydata.companywebsite
                                    }
                                    onChange={this.onChange}
                                    error={errors.companywebsite}
                                    info="Put the Company Website"
                                  />
                                </div>

                                <br />
                              </div>

                              <div class="form-row">
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company PAN No"
                                    name="companypanno"
                                    value={
                                      this.state.singcompanydata.companypanno
                                    }
                                    onChange={this.onChange}
                                    error={errors.companypanno}
                                    info="Company PAN No"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Bank Name"
                                    name="companybankname"
                                    value={
                                      this.state.singcompanydata.companybankname
                                    }
                                    onChange={this.onChange}
                                    error={errors.companybankname}
                                    info="Put the Company Bank Name"
                                  />
                                </div>

                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Company A/C No"
                                    name="companybankaccno"
                                    value={
                                      this.state.singcompanydata
                                        .companybankaccno
                                    }
                                    onChange={this.onChange}
                                    error={errors.companybankaccno}
                                    info="Put the Company A/C No"
                                  />
                                </div>

                                <br />
                              </div>
                              <div class="form-row">
                                <div class="form-group col-md-6">
                                  <TextFieldGroup
                                    placeholder="* Company Bank Branch"
                                    name="companybankbranch"
                                    value={
                                      this.state.singcompanydata
                                        .companybankbranch
                                    }
                                    onChange={this.onChange}
                                    error={errors.companybankbranch}
                                    info="Company Bank Branch"
                                  />
                                </div>
                                <div class="form-group col-md-6">
                                  <TextFieldGroup
                                    placeholder="* Company Bank IFSC"
                                    name="companybankifsccode"
                                    value={
                                      this.state.singcompanydata
                                        .companybankifsccode
                                    }
                                    onChange={this.onChange}
                                    error={errors.companybankifsccode}
                                    info="Put the Company Bank IFSC"
                                  />
                                </div>

                                <div class="form-group col-md-8">
                                  <TextFieldGroup
                                    placeholder="Company  Declaration"
                                    name="companydeclaration"
                                    value={
                                      this.state.singcompanydata
                                        .companydeclaration
                                    }
                                    onChange={this.onChange}
                                    error={errors.companydeclaration}
                                    info="Company  Declaration"
                                  />
                                </div>

                                <br />
                              </div>

                              <input
                                type="submit"
                                value="Submit"
                                className="btn btn-info btn-block mt-4"
                              />
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

EditCompany.propTypes = {
  stock: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  company: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  stock: state.stock,
  warehouse: state.warehouse,
  company: state.company,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    addCompany,
    getCurrentCompanies,
    deleteCompanybyid,
    editCompany
  }
)(withRouter(EditCompany));
