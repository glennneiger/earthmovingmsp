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
import "./companysetting.css";

import Spinner from "../common/Spinner";

import Companyimg from "./img/company2.jpg";

class CompanySetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentCompanies();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.company !== this.props.company) {
      //this.props.getCurrentCompanies();
    }
  }

  onDeleteClick(id) {
    // console.log(id);
    this.props.deleteCompanybyid(id, this.props.history); //this.props.history => this allows to do redirect functionality in deletecompany -> this action for this we use withRouter when we export class component
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

    const { company, loading } = this.props.company;
    let companyContent;
    let TotalcompanyItem;
    let TotalSalesOrder;

    if (company === null || loading) {
      companyContent = <Spinner />;
    } else {
      if (Object.keys(company).length > 0) {
        TotalcompanyItem = Object.keys(company).length;
        // console.log("Total company is : " + TotalcompanyItem);

        const companyData = company.map(company => (
          <div
            className="col-12 col-md-4"
            key={company._id}
            style={{ padding: "5px" }}
          >
            <div class="card">
              <div class="card-header bg-transparent border-success">
                <div className="container">
                  <div className="row">
                    <div className="col-md-6">
                      <Link
                        to={`/edit-company/${company._id}`}
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
                        onClick={this.onDeleteClick.bind(this, company._id)}
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
                src={Companyimg}
              />
              <div class="card-body">
                <h5 class="card-title">Name: {company.companyname}</h5>
                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>Address:</b> {company.companyaddress}
                </p>

                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>Pincode:</b> {company.companypincode}
                </p>

                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>State:</b> {company.companystate}
                </p>
                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>GST No:</b> {company.companygstno}
                </p>
                <p
                  class="card-text"
                  style={{ padding: "5px", backgroundColor: "#F5F5F5" }}
                >
                  <b>Email:</b> {company.companyemail}
                </p>
              </div>
              {company.companybankaccno && (
                <div class="card-footer bg-transparent border-success">
                  <b style={{ color: "green" }}>A/C No :</b>{" "}
                  {company.companybankaccno}
                </div>
              )}
            </div>
          </div>
        ));

        companyContent = <div class="col-12 row">{companyData}</div>;
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
                <li className="breadcrumb-item active">Company Setting</li>
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
                              to="/add-company"
                              style={{
                                backgroundColor: "#333333",
                                color: "#fff"
                              }}
                            >
                              <i
                                class="fa fa-plus-circle mr-2"
                                aria-hidden="true"
                              />
                              ADD COMPANY
                            </Link>
                          </li>
                        </ul>
                      </div>
                      {companyContent}
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

CompanySetting.propTypes = {
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
  { addCompany, getCurrentCompanies, deleteCompanybyid }
)(withRouter(CompanySetting));
