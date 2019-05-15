import React, { Component } from "react";
import axios from "axios";

import "./showstock.css";

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
  singleprodstockbyid,
  addonexistprodstock
} from "../../actions/stockActions";

import {
  getCurrentWarehouses,
  singleprodwarehouseitemsbyid
} from "../../actions/warehouseActions";

import Spinner from "../common/Spinner";

class AddonExistingStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prodstk_id: "",
      itemcode: "",
      prodwarehouse: "",
      prodorigin: "",
      quantity: "",
      errors: {}
      //singprodstk: {}
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    var param_id = this.props.match.params.id;

    this.props.singleprodstockbyid(this.props.match.params.id);
    this.props.singleprodwarehouseitemsbyid(this.props.match.params.id);

    this.props.getCurrentWarehouses();

    axios
      .get(`/api/stock/singleprodstock/` + this.props.match.params.id)
      .then(res => {
        this.setState({ itemcode: res.data.itemcode }); //here we call singleprodstock api second time for setstate the itemcode

        console.log(res.data.itemcode);
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { prodcateg } = this.state;
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

  onSubmit = e => {
    e.preventDefault();

    const { prodwarehouse, prodorigin, quantity, itemcode } = this.state;

    if (prodwarehouse == "" || prodwarehouse == 0) {
      alert("Please Select Warehouse from the List!!");
    } else if (prodorigin == "" || prodorigin == 0) {
      alert("Origin Field cannot be empty or 0 !!");
    } else if (parseInt(quantity) <= 0) {
      alert("The Item quantity : " + quantity + " be greater then 0");
    } else if (quantity == "") {
      alert("The Item quantity : " + quantity + " Cannot Be Empty");
    }

    const AddStockData = {
      prodstk_id: this.props.match.params.id,
      itemcode: itemcode,
      prodwarehouse: prodwarehouse,
      prodorigin: prodorigin,
      quantity: quantity
    };

    if (
      !(quantity == "") &&
      !(prodwarehouse == "" || prodwarehouse == 0) &&
      !(prodorigin == "" || prodorigin == 0) &&
      !(parseInt(quantity) <= 0)
    ) {
      console.log("great validation check success");

      console.log(AddStockData);
      this.props.addonexistprodstock(AddStockData, this.props.history);
    }
  };

  render() {
    const { warehouse, warehousebyid, loading } = this.props.warehouse;
    const { stock, stockbyid } = this.props.stock; //here we pass the stock props in with all the stocks contains and store in stocks const for used in this component

    const {
      errors,
      prodwarehouse,
      prodorigin,
      quantity,
      itemcode
    } = this.state;

    let warehouseoptionsloading;
    let TotalWarehouseItem;
    let warehouseoptions = [];

    if (warehouse === null || loading) {
      warehouseoptionsloading = "";
    } else {
      if (Object.keys(warehouse).length > 0) {
        TotalWarehouseItem = Object.keys(warehouse).length;
        // console.log("Total Warehouse is : " + TotalWarehouseItem);
        // Select options for warehouse
        const actualwarehouses = warehouse.map(w => ({
          label: w.warehouseaddress,
          value: w.warehouseaddress
        }));

        // console.log(actualwarehouses);
        const firstoptinsellist = [
          { label: "* Select Your Warehouse", value: 0 }
        ];

        // concat function is used for join two arrays
        warehouseoptions = firstoptinsellist.concat(actualwarehouses);

        // console.log(warehouseoptions);
      }
    }

    let showstockcontent;
    let showstockid;

    if (stockbyid === null) {
      showstockcontent = <Spinner />;
    } else {
      if (Object.keys(stockbyid).length > 0) {
        //console.log(stockbyid.articlenum);

        showstockid = (
          <li className="breadcrumb-item active">{stockbyid.itemcode}</li>
        );
      }

      if (Object.keys(stockbyid).length > 0) {
        //  const showstocklen = Object.keys(stockbyid);
        //console.log(showstocklen);

        showstockcontent = (
          <div>
            <div className="col-12 row">
              <br />
              <div className="col-1">&#8205;</div>
              <div class="col-3">
                <div class="card card-bordered">
                  {stockbyid.itemprimaryimg ? (
                    <img
                      style={{ width: "100%" }}
                      class="card-img-top img-fluid"
                      src={stockbyid.itemprimaryimg}
                      alt="item img"
                    />
                  ) : (
                    <Spinner />
                  )}
                </div>
              </div>

              <div className="col-8">
                <div
                  class="panel-body"
                  /*  style={{ height: "500px", overflowY: "scroll" }}
                   */
                >
                  <form onSubmit={this.onSubmit} enctype="multipart/form-data">
                    <div class="form-row">
                      <div class="form-group col-md-4">
                        <TextFieldGroup
                          placeholder="Itemcode"
                          name="itemcode"
                          value={itemcode}
                          onChange={this.onChange}
                          error={errors.itemcode}
                          info="Item Code"
                          disabled
                        />
                      </div>
                      <div class="form-group col-md-4">
                        <SelectListGroup
                          placeholder="Item Warehouse"
                          name="prodwarehouse"
                          value={prodwarehouse}
                          onChange={this.onChange}
                          options={warehouseoptions}
                          error={errors.prodwarehouse}
                          info="Item Warehouse"
                        />
                      </div>

                      <div class="form-group col-md-4">
                        <TextFieldGroup
                          placeholder="Item Origin"
                          name="prodorigin"
                          value={prodorigin}
                          onChange={this.onChange}
                          error={errors.prodorigin}
                          info="Put the Item Origin"
                        />
                      </div>
                      <div class="form-group col-md-4">
                        <TextFieldGroup
                          placeholder="* Total Qty"
                          name="quantity"
                          type="number"
                          value={quantity}
                          onChange={this.onChange}
                          error={errors.quantity}
                          info="Number of Total Qty"
                        />
                      </div>
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
        );
      }
    }

    return (
      <div style={{ backgroundColor: "#F3F8FB" }}>
        <div id="wrapper">
          <StockActions />

          {/*} <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up" />
  </a>*/}

          <div id="content-wrapper">
            <div className="container-fluid">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/view-stock">View Stock</Link>
                </li>
                <li className="breadcrumb-item active">
                  Add on Existing Product Stock
                </li>

                {showstockid ? showstockid : <div />}
              </ol>

              {showstockcontent ? showstockcontent : <div />}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddonExistingStock.propTypes = {
  stock: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  stock: state.stock,
  warehouse: state.warehouse,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    createStock,
    editStock,
    singleprodstockbyid,
    addonexistprodstock,
    singleprodwarehouseitemsbyid,
    getCurrentWarehouses
  }
)(withRouter(AddonExistingStock));
