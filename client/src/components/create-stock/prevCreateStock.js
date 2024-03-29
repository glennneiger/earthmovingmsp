import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import Dropzone from "react-dropzone";
import PropTypes from "prop-types";
import TextFieldGroup from "../common/TextFieldGroup";
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
const acceptedFileTypesArray = acceptedFileTypes.split(",").map(item => {
  return item.trim();
});

class CreateStock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      itemname: "",
      itemcode: "",
      machinepart: [],
      itemlength: "",
      itemwidth: "",
      itemheight: "",
      forcompany: [],
      hsncode: "",
      itemwarehouse: "",
      rack: "",
      quantity: "",
      minrate: "",
      rate: "",
      maxrate: "",
      productImage: "",
      focused: false,
      mpinput: "",
      fcinput: "",
      acceptedFiles: "",
      errors: {}
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
      itemname,
      itemcode,
      machinepart,
      itemlength,
      itemwidth,
      itemheight,
      forcompany,
      hsncode,
      itemwarehouse,
      rack,
      quantity,
      minrate,
      rate,
      maxrate,
      productImage
    } = this.state;

    if (machinepart.length > 0 && forcompany.length > 0) {
      console.log("final machinepart is : " + machinepart);

      console.log("final forcompany is : " + forcompany);
    }

    /*} axios.post("/api/stock/addnewstock", formData).then(result => {
      // access results...

      console.log(result);
    });*/
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

  verifyFile = files => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      const currentFileSize = currentFile.size;
      if (currentFileSize > itemImageMaxSize) {
        alert(
          "This File is not allowed. " +
            currentFileSize +
            " only file should be 250 kb"
        );
      }
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("This File is not allowed. Only images are allowed");
      }
      return true;
    }
  };

  handleOnDrop = (files, rejectedFiles) => {
    if (files && files.length <= 4) {
      console.log("accepted files are : " + files);
      console.log("accepted file length is : " + files.length);
      this.setState({ acceptedFiles: files });
      /*
      const isVerified = this.verifyFile(files);
      if (isVerified) {
        //imageBase64Data
        //const currentFile = files[0];
        const currentFiles = files;
        this.setState({ acceptedFiles: currentFiles });
       const myFileItemReader = new FileReader();
        myFileItemReader.addEventListener(
          "load",
          () => {
            console.log(myFileItemReader.result);
            this.setState({ acceptedFiles: myFileItemReader.result });
          },
          false
        );
        myFileItemReader.readAsDataURL(currentFile);
      }
   */
    } else {
      alert("You Cannot upload more then 4 images");
    }

    if (rejectedFiles && rejectedFiles.length > 0) {
      //this.verifyFile(rejectedFiles);
      console.log("rejected files are : " + rejectedFiles);
      const currentRejectedFile = rejectedFiles[0];
      const currentRejectedFileType = currentRejectedFile.type;
      const currentRejectedFileSize = currentRejectedFile.size;
      if (currentRejectedFileSize > itemImageMaxSize) {
        alert(
          "You can upload only image types (jpg,jpeg,png..) or image size should be less then 250 kb"
        );
      }
    }
  };

  render() {
    const {
      itemname,
      itemcode,
      machinepart,
      itemlength,
      itemwidth,
      itemheight,
      forcompany,
      hsncode,
      itemwarehouse,
      rack,
      quantity,
      minrate,
      rate,
      maxrate,
      productImage,
      acceptedFiles
    } = this.state;

    let itemfiles;
    if (acceptedFiles) {
      itemfiles = acceptedFiles.map(file => (
        <li key={file.path}>
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
                                  placeholder="* Item Name"
                                  name="itemname"
                                  value={itemname.toLowerCase()}
                                  onChange={this.onChange}
                                  error={errors.itemname}
                                  info="put Item Name"
                                />
                              </div>

                              <div class="form-group col-md-4">
                                <TextFieldGroup
                                  placeholder="* Item Code"
                                  name="itemcode"
                                  value={itemcode}
                                  onChange={this.onChange}
                                  error={errors.itemcode}
                                  info="A unique itemcode"
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
                                  placeholder="Item Width"
                                  name="itemwidth"
                                  type="number"
                                  value={itemwidth}
                                  onChange={this.onChange}
                                  error={errors.itemwidth}
                                  info="Put Item Width"
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
                              <div class="form-group col-md-4">
                                <TextFieldGroup
                                  placeholder="Item Height"
                                  name="itemheight"
                                  type="number"
                                  value={itemheight}
                                  onChange={this.onChange}
                                  error={errors.itemheight}
                                  info="Put Item Height"
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
                                    {this.state.machinepart.map((item, i) => (
                                      <li
                                        key={i}
                                        style={styles.machinepart}
                                        onClick={this.handlempRemoveItem(i)}
                                      >
                                        {item}
                                        <span>(x)</span>
                                      </li>
                                    ))}
                                    <input
                                      style={styles.machinepartinput}
                                      value={this.state.mpinput}
                                      onChange={this.handlempInputChange}
                                      onKeyDown={this.handlempInputKeyDown}
                                    />
                                  </ul>
                                  <span>Put Machine Part Names</span>
                                </label>
                              </div>

                              <div
                                class="form-group col-md-6"
                                style={{ backgroundColor: "#e4e4e4" }}
                              >
                                <label>
                                  <ul style={styles.container}>
                                    {this.state.forcompany.map((item, i) => (
                                      <li
                                        key={i}
                                        style={styles.forcompany}
                                        onClick={this.handlefcRemoveItem(i)}
                                      >
                                        {item}
                                        <span>(x)</span>
                                      </li>
                                    ))}
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
                            </div>
                            <div class="form-row">
                              <div class="form-group col-md-6">
                                <TextFieldGroup
                                  placeholder="Item Quantity"
                                  name="quantity"
                                  value={quantity}
                                  onChange={this.onChange}
                                  error={errors.quantity}
                                  info="Item Quantity"
                                />
                              </div>

                              <div class="form-group col-md-6">
                                <TextFieldGroup
                                  placeholder="Item Rate"
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
                                  name="maxrate"
                                  value={maxrate}
                                  onChange={this.onChange}
                                  error={errors.maxrate}
                                  info="Item Max Rate"
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

                              <div class="form-group col-md-6">
                                <TextFieldGroup
                                  placeholder="Rack"
                                  name="rack"
                                  type="text"
                                  value={rack}
                                  onChange={this.onChange}
                                  error={errors.rack}
                                  info="Put Rack"
                                />
                              </div>
                            </div>
                            {/*}  <input
                              type="file"
                              name="productImage"
                              onChange={this.onChange}
                                    />*/}
                            {/*}   // Note that there will be nothing logged when files
                            are dropped*/}

                            <div
                              style={{
                                backgroundColor: "azure",
                                padding: "25px"
                              }}
                            >
                              <Dropzone
                                onDrop={this.handleOnDrop}
                                multiple={true}
                                accept={acceptedFileTypes}
                                maxSize={itemImageMaxSize}
                              >
                                {({ getRootProps, getInputProps }) => (
                                  <div className="container">
                                    <div
                                      {...getRootProps({
                                        className: "dropzone",
                                        onDrop: event => event.stopPropagation()
                                      })}
                                    >
                                      <input {...getInputProps()} />
                                      <p style={{ textAlign: "center" }}>
                                        Upload File Here
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </Dropzone>
                            </div>
                            <hr />
                            {itemfiles > 0 && (
                              <div class="container">
                                <div class="row">
                                  <div class="col-md-6">{itemfiles}</div>
                                  <div class="col-md-6">
                                    <p style={{ color: "green" }}>done</p>
                                  </div>
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
