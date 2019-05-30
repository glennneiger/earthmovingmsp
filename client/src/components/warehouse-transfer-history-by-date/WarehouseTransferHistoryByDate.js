import React, { Component } from "react";
import axios from "axios";
import $ from "jquery";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import "./showwarehousetranshist.css";
import warehousetransferimg from "./img/warehouse_transfer2.png";

import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

import StockActions from "../dashboard/StockActions";

import { getWarehoustransHistorybyDate } from "../../actions/warehousetransAction";

import Spinner from "../common/Spinner";

import Moment from "react-moment";
import { parse } from "url";

class WarehouseTransferHistoryByDate extends Component {
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

    this.props.getWarehoustransHistorybyDate(this.props.match.params.date);
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

      pdf.save("StockTransferHistoryReciept.pdf");
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
      warehoustranshistorybydate,
      loading
    } = this.props.warehousetransfer;

    let showwarehousetransstockhistory;
    let showwarehousetransstockhistorydate;

    let newstockhistorydata;

    if (warehoustranshistorybydate === null) {
      showwarehousetransstockhistory = <Spinner />;
    } else {
      if (Object.keys(warehoustranshistorybydate).length > 0) {
        showwarehousetransstockhistorydate = (
          <li className="breadcrumb-item active">
            {this.props.match.params.date}
          </li>
        );
      }
      if (Object.keys(warehoustranshistorybydate).length > 0) {
        newstockhistorydata = warehoustranshistorybydate[0].transferitmlist.map(
          (warehousetransstkhisdata, index) => {
            return (
              <div className="card" key={`${warehousetransstkhisdata._id}`}>
                <div
                  class="card-header text-light"
                  style={{ backgroundColor: "#dedede" }}
                />

                <div className="row">
                  {warehousetransstkhisdata.itemprimaryimg && (
                    <div className="col-4">
                      <img
                        style={{ width: "150px", border: "1px solid black" }}
                        class="img-responsive"
                        src={warehousetransstkhisdata.itemprimaryimg}
                        alt="transfer product image"
                      />
                    </div>
                  )}

                  <div className="col-8">
                    <p className="product-partno">
                      <strong>
                        Item Part No : {warehousetransstkhisdata.itempartno}
                      </strong>
                    </p>

                    <p>
                      <small>
                        Warehouse Origin:{" "}
                        <b>{warehousetransstkhisdata.prodwarehouseorigin}</b>
                      </small>
                    </p>
                    <p>
                      <small>
                        Warehouse Transfer:{" "}
                        <b>{warehousetransstkhisdata.prodwarehousetransfer}</b>
                      </small>
                    </p>

                    <p>
                      <small>
                        Quantity Transfer:{" "}
                        <b>{warehousetransstkhisdata.quantitytrans}</b>
                      </small>
                    </p>

                    <p>
                      <small>
                        Transfer Date:{" "}
                        <b>
                          {" "}
                          <Moment format="YYYY/MM/DD hh:mm A">
                            {warehousetransstkhisdata.date}
                          </Moment>
                        </b>
                      </small>
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        );

        showwarehousetransstockhistory = (
          <div>
            <div className="col-12 row">
              <br />
              <div className="col-1">&#8205;</div>
              <div class="col-3">
                <div class="card card-bordered">
                  {warehousetransferimg ? (
                    <img
                      style={{ width: "100%" }}
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
                      <th>Warehouse Transfer History Date</th>
                      <td>{this.props.match.params.date}</td>
                    </tr>

                    <tr>
                      <th>History INVOICE </th>
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

            <div className="col-12 row">
              <br />
              <div className="col-1">&#8205;</div>

              <div className="col-3">
                <h5>Warehouse Transfer History</h5>
                <hr />
              </div>

              <div className="col-8">{newstockhistorydata}</div>
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
                  <Link to="/warehouse-transfer-history">
                    Warehouse Transfer History
                  </Link>
                </li>

                {showwarehousetransstockhistorydate ? (
                  showwarehousetransstockhistorydate
                ) : (
                  <div />
                )}
              </ol>
              <div
                id="canvas_div_pdf"
                style={{
                  backgroundColor: "#f5f5f5",
                  width: "210mm",
                  minHeight: "297mm",
                  padding: "50px",
                  marginLeft: "auto",
                  marginRight: "auto"
                }}
              >
                {showwarehousetransstockhistory ? (
                  showwarehousetransstockhistory
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

WarehouseTransferHistoryByDate.propTypes = {
  errors: PropTypes.object.isRequired,
  getWarehoustransHistorybyDate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  stock: state.stock,
  warehousetransfer: state.warehousetransfer,
  errors: state.errors //here we listen the errors from the server response in root reducer
});

export default connect(
  mapStateToProps,
  {
    getWarehoustransHistorybyDate
  }
)(withRouter(WarehouseTransferHistoryByDate));
