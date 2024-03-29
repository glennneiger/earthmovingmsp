import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";

import TextAreaFieldGroup from "../common/TextAreaFieldGroup";

import SelectListGroup from "../common/SelectListGroup";
import StockActions from "../dashboard/StockActions";

import { logoutUser } from "../../actions/authActions";
import { createStock } from "../../actions/stockActions";

import { getCurrentWarehouses } from "../../actions/warehouseActions";

// Authorization HOC
const Authorization = (WrappedComponent, allowedRoles) =>
  class WithAuthorization extends Component {
    constructor(props) {
      super(props);

      // In this case the user is hardcoded, but it could be loaded from anywhere.
      // Redux, MobX, RxJS, Backbone...
    }

    unAuthUserRedirectToDashboard = () => {
      this.props.history.push("/dashboard");
    };

    render() {
      const { isAuthenticated, user } = this.props.auth;

      console.log(user.role);
      //  console.log(this.props.auth.user.role);
      if (allowedRoles.includes(user.role)) {
        //here we return WrappedComponent which is Authorizationtest
        return <WrappedComponent {...this.props} />;
      } else {
        return (
          <div>
            <h1>
              <span style={{ color: "red" }}>{user.role}</span> Have No
              Authority To View This Content!
              <button
                onClick={this.unAuthUserRedirectToDashboard}
                type="button"
                value="go dashboard"
              />
              {this.unAuthUserRedirectToDashboard()}
              {/*here we CALL the unAuthUserRedirectToDashboard() function for redirect to dashboard */}
            </h1>
          </div>
        );
        //here you can show error or dispatch error or redirect to dashboard page
      }
    }
  };

const itemImageMaxSize = 250000; //250kb
const acceptedFileTypes =
  "images/x-png,image/png,image/jpg,image/jpeg,image/gif";

class CreateStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemtechname: "",
      itempartno: "",
      machinenames: [],
      itemid: "",
      itemidunit: "",
      itemod: "",
      itemodunit: "",
      itemlength: "",
      itemlengthunit: "",
      itemthickness: "",
      itemthicknessunit: "",
      hsncode: "",
      itemwarehouse: "",
      //  rack: "",
      quantity: "",
      minqtyreqfornotify: "",
      minrate: "",
      rate: "",
      maxrate: "",
      itemremark: "",
      productImage: "",
      focused: false,
      mpinput: "",
      acceptedFiles: "",
      errors: {}
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.handlempInputChange = this.handlempInputChange.bind(this);
    this.handlempInputKeyDown = this.handlempInputKeyDown.bind(this);
    this.handlempRemoveItem = this.handlempRemoveItem.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentWarehouses();
  }

  componentDidUpdate(prevProps, prevState) {}
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
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

  onSubmit = () => {
    const {
      itemtechname,
      itempartno,
      machinenames,
      itemid,
      itemidunit,
      itemod,
      itemodunit,
      itemlength,
      itemlengthunit,
      itemthickness,
      itemthicknessunit,
      hsncode,
      itemwarehouse,
      //  rack,
      quantity,
      minqtyreqfornotify,
      minrate,
      rate,
      maxrate,
      itemremark,
      acceptedFiles
    } = this.state;

    // if (machinenames.length > 0) {
    console.log("acceptedFiles is : " + acceptedFiles);
    //}

    let stockData = new FormData();
    stockData.append("itemtechname", itemtechname);
    stockData.append("itempartno", itempartno);
    stockData.append("machinenames", JSON.stringify(machinenames));

    stockData.append("itemid", itemid);
    stockData.append("itemidunit", itemidunit);

    stockData.append("itemod", itemod);
    stockData.append("itemodunit", itemodunit);

    stockData.append("itemlength", itemlength);
    stockData.append("itemlengthunit", itemlengthunit);

    stockData.append("itemthickness", itemthickness);
    stockData.append("itemthicknessunit", itemthicknessunit);

    stockData.append("hsncode", hsncode);
    stockData.append("itemwarehouse", itemwarehouse);
    // stockData.append("rack", rack);
    stockData.append("quantity", quantity);

    stockData.append("minqtyreqfornotify", minqtyreqfornotify);

    stockData.append("minrate", minrate);
    stockData.append("rate", rate);
    stockData.append("maxrate", maxrate);

    stockData.append("itemremark", itemremark);

    for (let i = 0; i < acceptedFiles.length; i += 1) {
      stockData.append("file", acceptedFiles[i]);
      console.log("acceptedFiles where i =" + i + " " + acceptedFiles[i]);
    }

    stockData.append("acceptedFiles", acceptedFiles);
    /*const stockData = {
      itemtechname: itemtechname,
      itempartno: itempartno,
      machinenames: JSON.stringify(machinenames), 
      itemid: itemid,
      itemidunit: itemidunit,
      itemod: itemod,
      itemodunit: itemodunit,
      itemlength: itemlength,
      itemlengthunit: itemlengthunit,
      itemthickness: itemthickness,
      itemthicknessunit: itemthicknessunit,
      hsncode: hsncode,
      itemwarehouse: itemwarehouse,
      rack: rack,
      quantity: quantity,
      minrate: minrate,
      rate: rate,
      maxrate: maxrate,
      acceptedFiles: acceptedFiles
    };*/
    // console.log("stockData Data is : " + stockData);
    //console.table(stockData);

    this.props.createStock(stockData, this.props.history);

    /*} axios.post("/api/stock/addnewstock", formData).then(result => {
      // access results...

      console.log(result);
    });*/
  };

  handlempInputChange(evt) {
    this.setState({ mpinput: evt.target.value });
  }

  handlempInputKeyDown(evt) {
    console.log(
      "this.state.machinenames is : " + typeof this.state.machinenames
    );
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

  handleOnDrop = (files, rejectedFiles) => {
    if (files.length <= 4) {
      //  console.log("accepted files are : " + files);
      // console.log("accepted file length is : " + files.length);
      this.setState({ acceptedFiles: files });
    } else {
      alert("You Cannot upload more then 4 images");
    }

    console.log("rejected files are : " + rejectedFiles);
  };

  render() {
    const {
      itemtechname,
      itempartno,
      machinenames,
      itemid,
      itemidunit,
      itemod,
      itemodunit,
      itemlength,
      itemlengthunit,
      itemthickness,
      itemthicknessunit,
      hsncode,
      itemwarehouse,
      // rack,
      quantity,
      minqtyreqfornotify,
      minrate,
      rate,
      maxrate,
      itemremark,
      productImage,
      acceptedFiles
    } = this.state;

    let itemfiles;
    if (acceptedFiles) {
      itemfiles = acceptedFiles.map(file => (
        <li className="list-group-item list-group-item-success" key={file.path}>
          {console.log(file)}
          {file.path} - {file.size} bytes
        </li>
      ));
    }
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

    const { isAuthenticated, user } = this.props.auth;

    const { warehouse, loading } = this.props.warehouse;

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
                    <li className="breadcrumb-item active">Create Stock</li>
                  </ol>
                  <div>
                    <div className="row">
                      <div className="col-md-10 m-auto">
                        <p className="lead text-center">
                          Let's get some information to make your stock stand
                          out
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
                              Add Your Stock
                            </h5>
                          </div>

                          <div
                            class="panel-body"
                            /*  style={{ height: "500px", overflowY: "scroll" }}
                             */
                          >
                            {/*}   <form
                              onSubmit={this.onSubmit}
                              enctype="multipart/form-data"
                            >
                          */}
                            <div class="form-row">
                              <div class="form-group col-md-4">
                                <TextFieldGroup
                                  placeholder="* Item Technical name"
                                  name="itemtechname"
                                  value={itemtechname.toLowerCase()}
                                  onChange={this.onChange}
                                  error={errors.itemtechname}
                                  info="Put Technical name"
                                />
                              </div>

                              <div class="form-group col-md-4">
                                <TextFieldGroup
                                  placeholder="* Item Part No"
                                  name="itempartno"
                                  value={itempartno}
                                  onChange={this.onChange}
                                  error={errors.itempartno}
                                  info="A unique Item Part No"
                                />
                              </div>
                              <div class="form-group col-md-4">
                                <TextFieldGroup
                                  placeholder="* Item Hsn Code"
                                  name="hsncode"
                                  value={hsncode}
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
                                  value={itemid}
                                  onChange={this.onChange}
                                  error={errors.itemid}
                                  info="Put Item ID"
                                />
                              </div>
                              <div class="form-group col-md-2">
                                <SelectListGroup
                                  placeholder="Item ID Unit"
                                  name="itemidunit"
                                  value={itemidunit}
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
                                  value={itemod}
                                  onChange={this.onChange}
                                  error={errors.itemod}
                                  info="Put Item OD"
                                />
                              </div>

                              <div class="form-group col-md-2">
                                <SelectListGroup
                                  placeholder="Item OD Unit"
                                  name="itemodunit"
                                  value={itemodunit}
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
                                  value={itemlength}
                                  onChange={this.onChange}
                                  error={errors.itemlength}
                                  info="Put Item Length"
                                />
                              </div>
                              <div class="form-group col-md-2">
                                <SelectListGroup
                                  placeholder="Item Length Unit"
                                  name="itemlengthunit"
                                  value={itemlengthunit}
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
                                  value={itemthickness}
                                  onChange={this.onChange}
                                  error={errors.itemthickness}
                                  info="Put Item Thickness"
                                />
                              </div>
                              <div class="form-group col-md-2">
                                <SelectListGroup
                                  placeholder="Item Thickness Unit"
                                  name="itemthicknessunit"
                                  value={itemthicknessunit}
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
                                    {this.state.machinenames.map((item, i) => (
                                      <li
                                        key={i}
                                        style={styles.machinenames}
                                        onClick={this.handlempRemoveItem(i)}
                                      >
                                        {item}
                                        <span
                                          style={{ color: "red", padding: 5 }}
                                        >
                                          (x)
                                        </span>
                                      </li>
                                    ))}
                                    <input
                                      style={styles.machinenamesinput}
                                      value={this.state.mpinput.toLowerCase()}
                                      onChange={this.handlempInputChange}
                                      onKeyDown={this.handlempInputKeyDown}
                                    />
                                  </ul>
                                  <span>* Put Machine Names</span>
                                </label>
                              </div>

                              <div
                                class="form-group col-md-6"
                                style={{
                                  backgroundColor: "rgb(202, 206, 200)"
                                }}
                              >
                                <TextFieldGroup
                                  placeholder="Item Rate"
                                  type="number"
                                  name="rate"
                                  value={rate}
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
                                  type="number"
                                  name="minrate"
                                  value={minrate}
                                  onChange={this.onChange}
                                  error={errors.minrate}
                                  info="Item Min Rate"
                                />
                              </div>

                              <div class="form-group col-md-6">
                                <TextFieldGroup
                                  placeholder="Item Max Rate"
                                  type="number"
                                  name="maxrate"
                                  value={maxrate}
                                  onChange={this.onChange}
                                  error={errors.maxrate}
                                  info="Item Max Rate"
                                />
                              </div>
                            </div>
                            <div class="form-row">
                              <div
                                class="form-group col-md-6"
                                style={{
                                  backgroundColor: "rgb(220, 228, 215)"
                                }}
                              >
                                <TextFieldGroup
                                  placeholder="* Item Quantity"
                                  type="number"
                                  name="quantity"
                                  value={quantity}
                                  onChange={this.onChange}
                                  error={errors.quantity}
                                  info="Item Quantity"
                                />
                              </div>

                              <div
                                class="form-group col-md-6"
                                style={{
                                  backgroundColor: "rgb(224, 202, 202)"
                                }}
                              >
                                <TextFieldGroup
                                  placeholder="Item Min Quantity Required"
                                  type="number"
                                  name="minqtyreqfornotify"
                                  value={minqtyreqfornotify}
                                  onChange={this.onChange}
                                  error={errors.minqtyreqfornotify}
                                  info="Item Min Quantity Required (for notification purpose if item original quantity is crossed min quantity in future so it'll help for you to get notification)"
                                />
                              </div>
                            </div>
                            <div class="form-row">
                              <div class="form-group col-md-12">
                                <TextAreaFieldGroup
                                  placeholder="Item Remark"
                                  name="itemremark"
                                  value={itemremark}
                                  onChange={this.onChange}
                                  error={errors.itemremark}
                                  info="Item Remark"
                                />
                              </div>
                            </div>
                            <hr />
                            <br />
                            <div class="form-row">
                              <div class="form-group col-md-6">
                                <SelectListGroup
                                  placeholder="* Item Warehouse"
                                  name="itemwarehouse"
                                  value={itemwarehouse}
                                  onChange={this.onChange}
                                  options={warehouseoptions}
                                  error={errors.itemwarehouse}
                                  info="product Warehouse"
                                />
                              </div>

                              {/*}   <div class="form-group col-md-6">
                                <TextFieldGroup
                                  placeholder="Rack"
                                  name="rack"
                                  type="text"
                                  value={rack}
                                  onChange={this.onChange}
                                  error={errors.rack}
                                  info="Put Rack"
                                />
                                    </div>*/}
                            </div>
                            {/*}  <input
                              type="file"
                              name="productImage"
                              onChange={this.onChange}
                                    />*/}
                            {/*}   // Note that there will be nothing logged when files
                            are dropped*/}

                            <Dropzone
                              onDrop={this.handleOnDrop}
                              multiple={true}
                              accept={acceptedFileTypes}
                              maxSize={itemImageMaxSize}
                            >
                              {({
                                getRootProps,
                                getInputProps,
                                isDragActive,
                                isDragReject
                              }) => (
                                <div className="col-md-4 btn btn-primary">
                                  <div
                                    {...getRootProps({
                                      className: "dropzone",
                                      onDrop: event => event.stopPropagation()
                                    })}
                                  >
                                    <input {...getInputProps()} />
                                    {!isDragActive &&
                                      "click here to choose images"}
                                    {isDragActive &&
                                      !isDragReject &&
                                      "click here to choose images"}
                                    {isDragReject &&
                                      "File type not accepted, sorry!"}
                                  </div>
                                </div>
                              )}
                            </Dropzone>
                            <p>
                              Image Upload Config:
                              <br />
                              1) max upload 4 images
                              <br />
                              2) max size 250kb/image
                            </p>

                            {itemfiles && (
                              <div class="container">
                                <div class="row">
                                  <hr />
                                  <div class="col-md-6">{itemfiles}</div>
                                </div>
                              </div>
                            )}
                            <input
                              onClick={this.onSubmit}
                              type="button"
                              value="Submit"
                              className="btn btn-info btn-block mt-4"
                            />
                            <br />
                            {/*</form>*/}
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
      </div>
    );
  }
}

CreateStock.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  stock: PropTypes.object.isRequired,
  warehouse: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
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
    logoutUser,
    createStock,
    getCurrentWarehouses
  }
)(
  withRouter(
    Authorization(CreateStock, [
      "atozadmin@30876DC5-7DF0-4103-A475-998C11E0A7E6",
      "inventoryuser"
    ])
  )
);
