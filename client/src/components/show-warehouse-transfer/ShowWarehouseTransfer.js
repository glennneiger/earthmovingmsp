import React, { Component } from "react";

import ReactTable from "react-table";
import "react-table/react-table.css";

import { CSVLink } from "react-csv";

import axios from "axios";
import $ from "jquery";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./showwarehoutranshis.css";
import warehousetransferimg from "./img/warehouse_transfer2.png";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import StockActions from "../dashboard/StockActions";

import {
  getAllWarehoustransHistoryProdStockDates,
  singlewarehousetranshis
} from "../../actions/warehousetransAction";

import Spinner from "../common/Spinner";

import Moment from "react-moment";
import { parse } from "url";

class ShowWarehouseTransfer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
      // singsalesorderstk: {}
    };
  }

  componentDidMount() {
    // this.props.singleprodstockbyid();

    this.props.getAllWarehoustransHistoryProdStockDates();
    this.props.singlewarehousetranshis(this.props.match.params.id);

    {
      /*} axios
      .get(`/api/salesorder/singlepsalesorder/` + this.props.match.params.id)
      .then(res => {
        this.setState({ singsalesorderstk: res.data });

        console.log(this.state.singsalesorderstk);
      });
    */
    }
  }

  windowPrint(e) {
    e.preventDefault();
    window.print();
  }
  printDocument(e) {
    e.preventDefault();
    // const canvas_div_pdf = document.getElementById("canvas_div_pdf");

    var HTML_Width = $("#canvas_div_pdf").width();
    var HTML_Height = $("#canvas_div_pdf").height();
    console.log("width is : " + HTML_Width);
    console.log("height is : " + HTML_Height);
    var top_left_margin = 15;
    var PDF_Width = HTML_Width + top_left_margin * 2;
    var PDF_Height = PDF_Width * 1.5 + top_left_margin * 2;
    var canvas_image_width = HTML_Width;
    var canvas_image_height = HTML_Height;

    var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

    html2canvas($("#canvas_div_pdf")[0], { allowTaint: true }).then(function(
      canvas
    ) {
      canvas.getContext("2d");

      console.log(canvas.height + "  " + canvas.width);

      var imgData = canvas.toDataURL("image/jpeg", 1.0);
      var pdf = new jsPDF("p", "pt", [PDF_Width, PDF_Height]);
      pdf.addImage(
        imgData,
        "JPG",
        top_left_margin,
        top_left_margin,
        canvas_image_width,
        canvas_image_height
      );

      for (var i = 1; i <= totalPDFPages; i++) {
        pdf.addPage(PDF_Width, PDF_Height);
        pdf.addImage(
          imgData,
          "JPG",
          top_left_margin,
          -(PDF_Height * i) + top_left_margin * 4,
          canvas_image_width,
          canvas_image_height
        );
      }

      pdf.save("WarehouseTransferReciept.pdf");
    });
  }

  invoicepdfgenerator(e) {
    e.preventDefault();

    // Default export is a4 paper, portrait, using milimeters for units

    var doc = new jsPDF();

    doc.text("Hello world!", 10, 10);
    doc.save("a4.pdf");

    {
      /*
    var doc = new jsPDF({
      // orientation: 'landscape',
      unit: "in",
      // format: [4, 2]  // tinggi, lebar
      format: [this.state.tinggi, this.state.lebar]
    });
    doc.text(
      `PDF size: ${this.state.tinggi} x ${this.state.lebar} in`,
      0.5,
      0.5
    );
    doc.text(`PDF filename: ${this.state.judul}`, 0.5, 0.8);
    doc.text(`Recipient: ${this.state.nama}`, 0.5, 1.1);
    doc.text(`Message: ${this.state.pesan}`, 0.5, 1.4);
    doc.addImage(this.state.gambar, "JPEG", 0.5, 2, 2.5, 2.5);
    // format: (image_file, 'image_type', X_init, Y_init, X_fin, Y_fin)

    doc.save(`${this.state.judul}`);

    */
    }
  }

  render() {
    const { errors } = this.state;

    const {
      warehousetransferhistory,
      warehoustranshistorybyid
    } = this.props.warehousetransfer;

    let showwarehousetranshistory;
    let showwarehoustransferid;

    let transferproductscontents;

    let columns = [];
    let csvContent;
    if (warehoustranshistorybyid === null) {
      showwarehousetranshistory = <Spinner />;
    } else {
      columns = [
        {
          Header: "Item Image",
          accessor: "itemprimaryimg",
          maxWidth: 200,
          filterable: false,
          Cell: row => (
            <span>
              <center>
                <img
                  style={{ maxWidth: "70px" }}
                  class=""
                  src={row.value}
                  alt="item primary img"
                />
              </center>
            </span>
          )
        },
        {
          Header: "Item Part No",
          accessor: "itempartno",
          maxWidth: 200,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Warehouse Origin",
          accessor: "prodwarehouseorigin",
          maxWidth: 200,
          filterable: true,
          Cell: row => (
            <span>
              <center>{row.value}</center>
            </span>
          )
        },
        {
          Header: "Warehouse Transfer",
          accessor: "prodwarehousetransfer",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center> {row.value}</center>
            </span>
          )
        },
        {
          Header: "Quantity Transfer",
          accessor: "quantitytrans",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center> {row.value}</center>
            </span>
          )
        },
        {
          Header: "Transfer Date",
          accessor: "date",
          maxWidth: 290,
          filterable: true,
          Cell: row => (
            <span>
              <center>
                <Moment format="YYYY/MM/DD hh:mm A">{row.value}</Moment>
              </center>
            </span>
          )
        }
      ];

      if (Object.keys(warehoustranshistorybyid).length > 0) {
        showwarehoustransferid = (
          <li className="breadcrumb-item active">
            {warehoustranshistorybyid._id}
          </li>
        );
      }
      if (Object.keys(warehoustranshistorybyid).length > 0) {
        csvContent = (
          <CSVLink
            data={
              warehoustranshistorybyid.warehousetransproducts[0].transferitmlist
            }
            filename={"Warehouse-Transfer.csv"}
            className="btn btn-sm btn-success"
          >
            Export CSV
          </CSVLink>
        );
        showwarehousetranshistory = (
          <div>
            <div className="container-fluid">
              <div className="col-12 row">
                <br />
                <div className="col-2">&#8205;</div>
                <div class="col-3">
                  <div
                    class="card card-bordered"
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    {warehousetransferimg ? (
                      <img
                        style={{ width: 100, height: 100 }}
                        class="card-img-top img-fluid"
                        src={warehousetransferimg}
                        alt="transfer img"
                      />
                    ) : (
                      <Spinner />
                    )}
                  </div>
                </div>
                <div className="col-5">
                  <table className="table table-striped table-hover  rtable">
                    <thead>
                      <tr>
                        <th>Warehouse Transfer Date</th>
                        <td>
                          {" "}
                          <Moment format="YYYY/MM/DD hh:mm A">
                            {warehoustranshistorybyid.date}
                          </Moment>
                        </td>
                      </tr>

                      <tr>
                        <th>Save Invoice PDF </th>
                        <td>
                          <input
                            style={{
                              cursor: "pointer",
                              backgroundColor: "goldenrod",
                              color: "#fff",
                              padding: "5px"
                            }}
                            // onClick={this.printDocument.bind(this)}
                            onClick={this.windowPrint.bind(this)}
                            type="button"
                            name="Pdf"
                            value="Download Invoice"
                          />
                        </td>
                      </tr>

                      <tr>
                        <th>Save Invoice CSV</th>
                        <td>{csvContent}</td>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <br />{" "}
              <ReactTable
                data={
                  warehoustranshistorybyid.warehousetransproducts[0]
                    .transferitmlist
                }
                columns={columns}
                defaultPageSize={5}
                pageSizeOptions={[
                  10,
                  30,
                  60,
                  90,
                  120,
                  150,
                  180,
                  210,
                  240,
                  270,
                  300
                ]}
                style={
                  {
                    //height: "600px" // This will force the table body to overflow and scroll, since there is not enough room
                    /*, maxWidth: "800px" */
                  }
                }
                className="-striped -highlight"
              />
            </div>
          </div>
        );
      }
    }

    return (
      <div style={{ backgroundColor: "#F3F8FB", paddingBottom: "50px" }}>
        <div id="wrapper">
          <StockActions />

          <div id="content-wrapper">
            <div className="container-fluid">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Dashboard</Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link to="/stock-transfer">Stock Transfer</Link>
                </li>
                <li className="breadcrumb-item active">
                  Show Warehouse Transfer
                </li>

                {showwarehoustransferid ? showwarehoustransferid : <div />}
              </ol>
              <div
                id="canvas_div_pdf"
                style={{
                  backgroundColor: "#f5f5f5",
                  maxWidth: "461mm",
                  minHeight: "297mm",
                  padding: "50px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                {showwarehousetranshistory ? (
                  showwarehousetranshistory
                ) : (
                  <div />
                )}
              </div>
            </div>
          </div>
          <div />

          {/*} <a class="scroll-to-top rounded" href="#page-top">
          <i class="fas fa-angle-up" />
  </a>*/}
        </div>
      </div>
    );
  }
}

ShowWarehouseTransfer.propTypes = {
  errors: PropTypes.object.isRequired,
  getAllWarehoustransHistoryProdStockDates: PropTypes.object.isRequired,
  singlewarehousetranshis: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  errors: state.errors, //here we listen the errors from the server response in root reducer

  warehousetransfer: state.warehousetransfer
});

export default connect(
  mapStateToProps,
  { getAllWarehoustransHistoryProdStockDates, singlewarehousetranshis }
)(withRouter(ShowWarehouseTransfer));
