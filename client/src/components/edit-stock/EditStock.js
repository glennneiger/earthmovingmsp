import React, { Component } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";

import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import SelectListGroup from "../common/SelectListGroup";

import StockActions from "../dashboard/StockActions";
import {
  createStock,
  editStock,
  singleprodstockbyid
} from "../../actions/stockActions";

import isEmpty from "../../validation/is-empty";

import Spinner from "../common/Spinner";

class EditStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      singprodstk: {},
      machinenames: [],
      focused: false,
      mpinput: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.handlempInputChange = this.handlempInputChange.bind(this);
    this.handlempInputKeyDown = this.handlempInputKeyDown.bind(this);
    this.handlempRemoveItem = this.handlempRemoveItem.bind(this);
  }

  componentDidMount() {
    //this.props.singleprodstockbyid(this.props.match.params.id);

    axios
      .get(`/api/stock/singleprodstock/` + this.props.match.params.id)
      .then(res => {
        this.setState({ singprodstk: res.data });
        this.setState({ machinenames: res.data.machinenames });

        //   console.log("machinenames is : " + this.state.machinenames);

        //console.log(this.state.singprodstk);
      });
  }

  onChange(e) {
    const state = this.state.singprodstk;

    state[e.target.name] = e.target.value;

    this.setState({ singprodstk: state });
  }

  onSubmit = () => {
    const {
      itemtechname,
      itempartno,
      itemid,
      itemidunit,
      itemod,
      itemodunit,
      itemlength,
      itemlengthunit,
      itemthickness,
      itemthicknessunit,
      hsncode,
      minrate,
      rate,
      maxrate,
      itemremark
    } = this.state.singprodstk; //take prev value that was set in repsonse

    let machinenames = JSON.stringify(this.state.machinenames);

    const stockData = {
      itemtechname,
      itemid,
      itemidunit,
      itemod,
      itemodunit,
      itemlength,
      itemlengthunit,
      itemthickness,
      itemthicknessunit,
      machinenames,
      hsncode,
      minrate,
      rate,
      maxrate,
      itemremark
    };

    const paramid = this.props.match.params.id;
    // console.log(paramid);
    //console.log("updated stock data" + stockData.itemwidth);
    this.props.editStock(stockData, paramid, this.props.history);
  };

  handlempInputChange(evt) {
    this.setState({ mpinput: evt.target.value });
  }

  handlempInputKeyDown(evt) {
    if (evt.keyCode === 13) {
      const { value } = evt.target;

      this.setState(state => ({
        machinenames: [...state.machinenames, value],
        mpinput: ""
      }));
    }

    if (
      this.state.machinenames.length &&
      evt.keyCode === 8 &&
      !this.state.mpinput.length
    ) {
      this.setState(state => ({
        machinenames: state.machinenames.slice(0, state.machinenames.length - 1)
      }));
    }
  }

  handlempRemoveItem(index) {
    return () => {
      this.setState(state => ({
        machinenames: state.machinenames.filter((item, i) => i !== index)
      }));
    };
  }
  ///////////////

  render() {
    // Select options for item id unit
    const itemidunitoptions = [
      { label: "Select Item ID Unit", value: 0 },
      { label: "mm", value: "mm" },
      { label: "inch", value: "inch" },
      { label: "cm", value: "cm" }
    ];

    // Select options for item od unit
    const itemodunitoptions = [
      { label: "Select Item OD Unit", value: 0 },
      { label: "mm", value: "mm" },
      { label: "inch", value: "inch" },
      { label: "cm", value: "cm" }
    ];

    // Select options for item LENGTH unit
    const itemlengthunitoptions = [
      { label: "Select Item Length Unit", value: 0 },
      { label: "mm", value: "mm" },
      { label: "inch", value: "inch" },
      { label: "cm", value: "cm" }
    ];

    // Select options for item Thickness unit
    const itemthicknessunitoptions = [
      { label: "Select Item Thickness Unit", value: 0 },
      { label: "mm", value: "mm" },
      { label: "inch", value: "inch" },
      { label: "cm", value: "cm" }
    ];

    const styles = {
      container: {
        border: "1px solid #ddd",
        padding: "5px",
        borderRadius: "5px"
      },

      machinenames: {
        display: "inline-block",
        padding: "2px",
        border: "1px solid #0085c3",
        fontFamily: "Helvetica, sans-serif",
        borderRadius: "5px",
        marginRight: "5px",
        cursor: "pointer"
      },

      machinenamesinput: {
        outline: "none",
        border: "none",
        fontSize: "14px",
        fontFamily: "Helvetica, sans-serif"
      }
    };
    const { errors } = this.state;

    const { stock, loading, stockbyid } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    let stockbyidContent;
    if (this.state.singprodstk === null) {
      stockbyidContent = <Spinner />;
    } else {
      stockbyidContent = (
        <div className="row">
          <div className="col-md-12">
            <div>
              <div className="row">
                <div className="col-md-10 m-auto">
                  <p className="lead text-center">
                    Let's get some information to make your stock stand out
                  </p>

                  <p>
                    <img
                      style={{ width: "100px", height: "100px" }}
                      src={this.state.singprodstk.itemprimaryimg}
                    />
                  </p>
                  <small className="d-block pb-3">* = required fields</small>

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
                        Edit Your stock
                      </h5>
                    </div>

                    <div
                      class="panel-body"
                      /* style={{
                  height: "500px",
                  overflowY: "scroll"
                }}
                */
                    >
                      <div class="form-row">
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="* Item Technical Name"
                            name="itemtechname"
                            value={this.state.singprodstk.itemtechname}
                            onChange={this.onChange}
                            error={errors.itemtechname}
                            info="Put Item Technical Name"
                          />
                        </div>

                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="* Item Part No"
                            name="itempartno"
                            value={this.state.singprodstk.itempartno}
                            onChange={this.onChange}
                            error={errors.itempartno}
                            info="A unique Item Part No"
                            disabled
                          />
                        </div>

                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="* Item Hsn Code"
                            name="hsncode"
                            value={this.state.singprodstk.hsncode}
                            onChange={this.onChange}
                            error={errors.hsncode}
                            info="Put the Item Hsn Code"
                          />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item ID"
                            name="itemid"
                            type="number"
                            value={this.state.singprodstk.itemid}
                            onChange={this.onChange}
                            error={errors.itemid}
                            info="Put Item ID"
                          />
                        </div>
                        <div class="form-group col-md-2">
                          <SelectListGroup
                            placeholder="Item ID Unit"
                            name="itemidunit"
                            value={this.state.singprodstk.itemidunit}
                            onChange={this.onChange}
                            options={itemidunitoptions}
                            error={errors.itemidunit}
                            info="Put Item ID Unit"
                          />
                        </div>
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item OD"
                            name="itemod"
                            type="number"
                            value={this.state.singprodstk.itemod}
                            onChange={this.onChange}
                            error={errors.itemod}
                            info="Put Item OD"
                          />
                        </div>

                        <div class="form-group col-md-2">
                          <SelectListGroup
                            placeholder="Item OD Unit"
                            name="itemodunit"
                            value={this.state.singprodstk.itemodunit}
                            onChange={this.onChange}
                            options={itemodunitoptions}
                            error={errors.itemodunit}
                            info="Put Item OD Unit"
                          />
                        </div>
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item Length"
                            name="itemlength"
                            type="number"
                            value={this.state.singprodstk.itemlength}
                            onChange={this.onChange}
                            error={errors.itemlength}
                            info="Put Item Length"
                          />
                        </div>
                        <div class="form-group col-md-2">
                          <SelectListGroup
                            placeholder="Item Length Unit"
                            name="itemlengthunit"
                            value={this.state.singprodstk.itemlengthunit}
                            onChange={this.onChange}
                            options={itemlengthunitoptions}
                            error={errors.itemlengthunit}
                            info="Put Item Length Unit"
                          />
                        </div>
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item Thickness"
                            name="itemthickness"
                            type="number"
                            value={this.state.singprodstk.itemthickness}
                            onChange={this.onChange}
                            error={errors.itemthickness}
                            info="Put Item Thickness"
                          />
                        </div>
                        <div class="form-group col-md-2">
                          <SelectListGroup
                            placeholder="Item Thickness Unit"
                            name="itemthicknessunit"
                            value={this.state.singprodstk.itemthicknessunit}
                            onChange={this.onChange}
                            options={itemthicknessunitoptions}
                            error={errors.itemthicknessunit}
                            info="Put Item Thickness Unit"
                          />
                        </div>
                      </div>

                      <div class="form-row">
                        <div
                          class="form-group col-md-6"
                          style={{ backgroundColor: "#e4e4e4" }}
                        >
                          <label>
                            <ul style={styles.container}>
                              {console.log(
                                "machinenames type is : " +
                                  typeof this.state.machinenames
                              )}
                              {this.state.machinenames &&
                                this.state.machinenames.map((item, i) => (
                                  <li
                                    key={i}
                                    style={styles.machinenames}
                                    onClick={this.handlempRemoveItem(i)}
                                  >
                                    {item}
                                    <span style={{ color: "red", padding: 5 }}>
                                      (x)
                                    </span>
                                  </li>
                                ))}
                              <input
                                style={styles.machinenamesinput}
                                value={this.state.mpinput}
                                onChange={this.handlempInputChange}
                                onKeyDown={this.handlempInputKeyDown}
                              />
                            </ul>
                            <span>* Put Machine Names</span>
                          </label>
                        </div>
                        <div
                          class="form-group col-md-6"
                          style={{ backgroundColor: "rgb(202, 206, 200)" }}
                        >
                          <TextFieldGroup
                            placeholder="Item Rate"
                            name="rate"
                            value={this.state.singprodstk.rate}
                            onChange={this.onChange}
                            error={errors.rate}
                            info="Item Rate"
                          />
                        </div>
                      </div>

                      <div class="form-row">
                        <div class="form-group col-md-6">
                          <TextFieldGroup
                            placeholder="Item Min Rate"
                            name="minrate"
                            value={this.state.singprodstk.minrate}
                            onChange={this.onChange}
                            error={errors.minrate}
                            info="Item Min Rate"
                          />
                        </div>

                        <div class="form-group col-md-6">
                          <TextFieldGroup
                            placeholder="Item Max Rate"
                            name="maxrate"
                            value={this.state.singprodstk.maxrate}
                            onChange={this.onChange}
                            error={errors.maxrate}
                            info="Item Max Rate"
                          />
                        </div>
                        <div class="form-group col-md-12">
                          <TextAreaFieldGroup
                            placeholder="Item Remark"
                            name="itemremark"
                            value={this.state.singprodstk.itemremark}
                            onChange={this.onChange}
                            error={errors.itemremark}
                            info="Item Remark"
                          />
                        </div>
                      </div>

                      <input
                        onClick={this.onSubmit}
                        type="submit"
                        value="Submit"
                        className="btn btn-info btn-block mt-4"
                      />
                      <br />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
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
                <li className="breadcrumb-item">
                  <Link to="/view-stock">View Stock</Link>
                </li>
                <li className="breadcrumb-item active">Edit Stock</li>
              </ol>
            </div>
          </div>

          {this.state.singprodstk && stockbyidContent}
          {/*} <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up" />
  </a>*/}
        </div>
      </div>
    );
  }
}

EditStock.propTypes = {
  stock: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  stock: state.stock,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  { createStock, editStock, singleprodstockbyid }
)(withRouter(EditStock));
