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
      singprodstk: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.handlempInputChange = this.handlempInputChange.bind(this);
    this.handlempInputKeyDown = this.handlempInputKeyDown.bind(this);
    this.handlempRemoveItem = this.handlempRemoveItem.bind(this);

    this.handlefcInputChange = this.handlefcInputChange.bind(this);
    this.handlefcInputKeyDown = this.handlefcInputKeyDown.bind(this);
    this.handlefcRemoveItem = this.handlefcRemoveItem.bind(this);
  }

  componentDidMount() {
    //this.props.singleprodstockbyid(this.props.match.params.id);

    axios
      .get(`/api/stock/singleprodstock/` + this.props.match.params.id)
      .then(res => {
        this.setState({ singprodstk: res.data });

        console.log(this.state.singprodstk);
      });
  }

  onChange(e) {
    const state = this.state.singprodstk;

    state[e.target.name] = e.target.value;

    this.setState({ singprodstk: state });
  }

  onSubmit = () => {
    const {
      itemname,
      itemcode,
      machinepart,
      itemlength,
      itemwidth,
      itemheight,
      forcompany,
      hsncode,
      minrate,
      rate,
      maxrate
    } = this.state.singprodstk;

    const stockData = {
      itemname,
      itemlength,
      itemwidth,
      itemheight,
      hsncode,
      minrate,
      rate,
      maxrate
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
        machinepart: [...state.machinepart, value],
        mpinput: ""
      }));
    }

    if (
      this.state.machinepart.length &&
      evt.keyCode === 8 &&
      !this.state.mpinput.length
    ) {
      this.setState(state => ({
        machinepart: state.machinepart.slice(0, state.machinepart.length - 1)
      }));
    }
  }

  handlempRemoveItem(index) {
    return () => {
      this.setState(state => ({
        machinepart: state.machinepart.filter((item, i) => i !== index)
      }));
    };
  }

  ///////////////

  handlefcInputChange(evt) {
    this.setState({ fcinput: evt.target.value });
  }

  handlefcInputKeyDown(evt) {
    if (evt.keyCode === 13) {
      const { value } = evt.target;

      this.setState(state => ({
        forcompany: [...state.forcompany, value],
        fcinput: ""
      }));
    }

    if (
      this.state.forcompany.length &&
      evt.keyCode === 8 &&
      !this.state.fcinput.length
    ) {
      this.setState(state => ({
        forcompany: state.forcompany.slice(0, state.forcompany.length - 1)
      }));
    }
  }

  handlefcRemoveItem(index) {
    return () => {
      this.setState(state => ({
        forcompany: state.forcompany.filter((item, i) => i !== index)
      }));
    };
  }

  render() {
    const styles = {
      container: {
        border: "1px solid #ddd",
        padding: "5px",
        borderRadius: "5px"
      },

      machinepart: {
        display: "inline-block",
        padding: "2px",
        border: "1px solid #0085c3",
        fontFamily: "Helvetica, sans-serif",
        borderRadius: "5px",
        marginRight: "5px",
        cursor: "pointer"
      },

      forcompany: {
        display: "inline-block",
        padding: "2px",
        border: "1px solid #0085c3",
        fontFamily: "Helvetica, sans-serif",
        borderRadius: "5px",
        marginRight: "5px",
        cursor: "pointer"
      },

      machinepartinput: {
        outline: "none",
        border: "none",
        fontSize: "14px",
        fontFamily: "Helvetica, sans-serif"
      },

      forcompanyinput: {
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
                            placeholder="* Item Name"
                            name="itemname"
                            value={this.state.singprodstk.itemname}
                            onChange={this.onChange}
                            error={errors.itemname}
                            info="put Item Name"
                          />
                        </div>

                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="* Item Code"
                            name="itemcode"
                            value={this.state.singprodstk.itemcode}
                            onChange={this.onChange}
                            error={errors.itemcode}
                            info="A unique itemcode"
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
                            placeholder="Item Width"
                            name="itemwidth"
                            type="number"
                            value={this.state.singprodstk.itemwidth}
                            onChange={this.onChange}
                            error={errors.itemwidth}
                            info="Put Item Width"
                          />
                        </div>
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            name="itemlength"
                            type="number"
                            value={this.state.singprodstk.itemlength}
                            onChange={this.onChange}
                            error={errors.itemlength}
                            info="Put Item Length"
                          />
                        </div>
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item Height"
                            name="itemheight"
                            type="number"
                            value={this.state.singprodstk.itemheight}
                            onChange={this.onChange}
                            error={errors.itemheight}
                            info="Put Item Height"
                          />
                        </div>
                      </div>

                      {/*}       <div class="form-row">
                        <div
                          class="form-group col-md-6"
                          style={{ backgroundColor: "#e4e4e4" }}
                        >
                          <label>
                            <ul style={styles.container}>
                              {this.state.singprodstk.machinepart.map(
                                (item, i) => (
                                  <li
                                    key={i}
                                    style={styles.machinepart}
                                    onClick={this.handlempRemoveItem(i)}
                                  >
                                    {item}
                                    <span>(x)</span>
                                  </li>
                                )
                              )}
                              <input
                                style={styles.machinepartinput}
                                value={this.state.mpinput}
                                onChange={this.handlempInputChange}
                                onKeyDown={this.handlempInputKeyDown}
                              />
                            </ul>
                            <span>* Put Machine Part Names</span>
                          </label>
                        </div>

                        <div
                          class="form-group col-md-6"
                          style={{ backgroundColor: "#e4e4e4" }}
                        >
                          <label>
                            <ul style={styles.container}>
                              {this.state.singprodstk.forcompany.map(
                                (item, i) => (
                                  <li
                                    key={i}
                                    style={styles.forcompany}
                                    onClick={this.handlefcRemoveItem(i)}
                                  >
                                    {item}
                                    <span>(x)</span>
                                  </li>
                                )
                              )}
                              <input
                                style={styles.forcompanyinput}
                                value={this.state.fcinput}
                                onChange={this.handlefcInputChange}
                                onKeyDown={this.handlefcInputKeyDown}
                              />
                            </ul>
                            <span>Put For Company Names</span>
                          </label>
                        </div>
                                </div>*/}

                      <div class="form-row">
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item Rate"
                            name="rate"
                            value={this.state.singprodstk.rate}
                            onChange={this.onChange}
                            error={errors.rate}
                            info="Item Rate"
                          />
                        </div>

                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item Min Rate"
                            name="minrate"
                            value={this.state.singprodstk.minrate}
                            onChange={this.onChange}
                            error={errors.minrate}
                            info="Item Min Rate"
                          />
                        </div>
                        <div class="form-group col-md-4">
                          <TextFieldGroup
                            placeholder="Item Max Rate"
                            name="maxrate"
                            value={this.state.singprodstk.maxrate}
                            onChange={this.onChange}
                            error={errors.maxrate}
                            info="Item Max Rate"
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
