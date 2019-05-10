import React, { Component } from "react";

import "./css/jquery.dataTables.min.css";

const $ = require("jquery");
$.DataTable = require("datatables.net");

export class Tbl extends Component {
  componentDidMount() {
    console.log(this.el);
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: [
        { title: "Product Image" },
        { title: "Article No" },
        { title: "Article Name" },
        { title: "Created Date" },

        { title: "Stock Edit" },

        { title: "Stock Delete" }
      ]
    });
  }

  render() {
    return (
      <div>
        <table
          id="dataTable"
          className="display"
          width="100%"
          ref={el => (this.el = el)}
        />
      </div>
    );
  }
}
