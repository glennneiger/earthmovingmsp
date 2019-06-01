import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import axios from "axios";
import $ from "jquery";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CSVLink } from "react-csv";

import "./showdeletedstockhist.css";
import warehousetransferimg from "./img/warehouse_transfer2.png";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import StockActions from "../dashboard/StockActions";

import { getDeletedStockHistoryByDate } from "../../actions/stockActions";

import Spinner from "../common/Spinner";

import Moment from "react-moment";
import { parse } from "url";

class DeletedStockHistoryByDate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {}
      // singsalesorderstk: {}
    };
  }

  componentDidMount() {
    // this.props.singleprodstockbyid();

    // this.props.getAllWarehoustransHistory();
    // this.props.singlewarehousetranshis(this.props.match.params.id);

    this.props.getDeletedStockHistoryByDate(this.props.match.params.date);
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

      pdf.save("DeletedStockHistoryReciept.pdf");
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
      deletedstockhistorybydate,
      existingstockhistoryloading
    } = this.props.stock;

    let showdeletedstockhistory;
    let showdeletedstockhistorydate;

    let deletedstockhistorydata;

    let csvContent;
    let columns = [];

    if (deletedstockhistorybydate === null) {
      showdeletedstockhistory = <Spinner />;
    } else {
      if (Object.keys(deletedstockhistorybydate).length > 0) {
        showdeletedstockhistorydate = (
          <li className="breadcrumb-item active">
            {this.props.match.params.date}
          </li>
        );
      }
      if (Object.keys(deletedstockhistorybydate).length > 0) {
        csvContent = (
          <CSVLink
            data={deletedstockhistorybydate}
            filename={"DeletedStock-History.csv"}
            className="btn btn-sm btn-success"
          >
            Export CSV
          </CSVLink>
        );
        columns = [
          {
            Header: "Item Image",
            accessor: "itemprimaryimg",
            maxWidth: 100,
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
            Header: "Item Tech Name",
            accessor: "itemtechname",
            maxWidth: 200,
            filterable: true,
            Cell: row => (
              <span>
                <center>{row.value}</center>
              </span>
            )
          },
          {
            Header: "Item Warehouse (with Quantity)",
            accessor: "warehousewithquantity",
            maxWidth: 500,
            filterable: true,
            Cell: row => (
              <span>
                <center>
                  {row.value.map(item => {
                    return (
                      <div style={{ backgroundColor: "#cecece" }}>
                        <span style={{ padding: 10 }}>
                          <span style={{ fontSize: 14 }}>
                            {item.prodwarehouse}
                          </span>
                          <span
                            class="badge"
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              marginLeft: 10
                            }}
                          >
                            {item.quantity}
                          </span>{" "}
                          Qty
                        </span>
                        <br />
                        <br />{" "}
                      </div>
                    );
                  })}
                </center>
              </span>
            )
          },
          {
            Header: "Deleted Stock Date",
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

        showdeletedstockhistory = (
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
                        alt="newstock history img"
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
                        <th>Deleted Stock History Date</th>
                        <td>{this.props.match.params.date}</td>
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
                    </thead>
                  </table>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <br />{" "}
              <ReactTable
                data={deletedstockhistorybydate}
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
                  <Link to="/deleted-stock-history">Deleted Stock History</Link>
                </li>

                {showdeletedstockhistorydate ? (
                  showdeletedstockhistorydate
                ) : (
                  <div />
                )}
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
                {showdeletedstockhistory ? showdeletedstockhistory : <div />}
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

DeletedStockHistoryByDate.propTypes = {
  errors: PropTypes.object.isRequired,
  getDeletedStockHistoryByDate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  stock: state.stock,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    getDeletedStockHistoryByDate
  }
)(withRouter(DeletedStockHistoryByDate));
