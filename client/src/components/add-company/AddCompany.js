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
  deleteCompanybyid
} from "../../actions/companyAction";
import isEmpty from "../../validation/is-empty";

class AddCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyname: "",
      companyaddress: "",
      companypincode: "",
      companystate: "",
      companygstno: "",
      companyemail: "",
      companycontactno: "",
      companycontactperson: "",
      companywebsite: "",
      companypanno: "",
      companybankname: "",
      companybankaccno: "",
      companybankbranch: "",
      companybankifsccode: "",
      companydeclaration: "here is my declaration...",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentCompanies();
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
    } = this.state;

    const companyData = {
      companyname: companyname,
      companyaddress: companyaddress,
      companypincode: companypincode,
      companystate: companystate,
      companygstno: companygstno,
      companyemail: companyemail,
      companycontactno: companycontactno,
      companycontactperson: companycontactperson,
      companywebsite: companywebsite,
      companypanno: companypanno,
      companybankname: companybankname,
      companybankaccno: companybankaccno,
      companybankbranch: companybankbranch,
      companybankifsccode: companybankifsccode,
      companydeclaration: companydeclaration
    };
    console.log(companyData);
    this.props.addCompany(companyData, this.props.history);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

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
      companydeclaration,
      errors
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
                      <Link to="/company-setting">Company Setting </Link>
                    </li>
                    <li className="breadcrumb-item active">Add Company</li>
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
                              backgroundColor: "rgb(0, 133, 195)",
                              padding: "15px",
                              marginBottom: "20px"
                            }}
                          >
                            <h5
                              className="display-8 text-center"
                              style={{ color: "white" }}
                            >
                              Add Your Company
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
                                    placeholder="* Company Name"
                                    name="companyname"
                                    value={companyname.toLowerCase()}
                                    onChange={this.onChange}
                                    error={errors.companyname}
                                    info="A unique company Name"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Address"
                                    name="companyaddress"
                                    value={companyaddress}
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
                                    value={companypincode}
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
                                    value={companystate.toLowerCase()}
                                    onChange={this.onChange}
                                    error={errors.companystate}
                                    info="Company State"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company GST No"
                                    name="companygstno"
                                    value={companygstno}
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
                                    value={companyemail}
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
                                    value={companycontactno}
                                    onChange={this.onChange}
                                    error={errors.companycontactno}
                                    info="Company Contact No"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Contact Person Name"
                                    name="companycontactperson"
                                    value={companycontactperson}
                                    onChange={this.onChange}
                                    error={errors.companycontactperson}
                                    info="Put the Company Person Name"
                                  />
                                </div>

                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="Company Website"
                                    name="companywebsite"
                                    value={companywebsite}
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
                                    value={companypanno}
                                    onChange={this.onChange}
                                    error={errors.companypanno}
                                    info="Company PAN No"
                                  />
                                </div>
                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company Bank Name"
                                    name="companybankname"
                                    value={companybankname}
                                    onChange={this.onChange}
                                    error={errors.companybankname}
                                    info="Put the Company Bank Name"
                                  />
                                </div>

                                <div class="form-group col-md-4">
                                  <TextFieldGroup
                                    placeholder="* Company A/C No"
                                    name="companybankaccno"
                                    value={companybankaccno}
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
                                    value={companybankbranch}
                                    onChange={this.onChange}
                                    error={errors.companybankbranch}
                                    info="Company Bank Branch"
                                  />
                                </div>
                                <div class="form-group col-md-6">
                                  <TextFieldGroup
                                    placeholder="* Company Bank IFSC"
                                    name="companybankifsccode"
                                    value={companybankifsccode}
                                    onChange={this.onChange}
                                    error={errors.companybankifsccode}
                                    info="Put the Company Bank IFSC"
                                  />
                                </div>

                                <div class="form-group col-md-8">
                                  <TextFieldGroup
                                    placeholder="Company  Declaration"
                                    name="companydeclaration"
                                    value={companydeclaration}
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

AddCompany.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  company: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  warehouse: state.warehouse,
  company: state.company,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  { addCompany, getCurrentCompanies }
)(withRouter(AddCompany));
