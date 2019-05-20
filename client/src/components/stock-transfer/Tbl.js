import React, { Component } from "react";

import "./jquery.dataTables.css";

const $ = require("jquery");
$.DataTable = require("datatables.net");

export class Tbl extends Component {
  componentDidMount() {
    console.log(this.props.data);
    console.log(this.el);
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.props.data,
      columns: [
        { title: "itemcode" },
        { title: "Position" },
        { title: "Office" },
        { title: "Extn." },
        { title: "Start date" },
        { title: "Salary" }
      ]
    });
  }

  componentWillUnmount() {}
  render() {
    return (
      <div>
        <table className="display" width="100%" ref={el => (this.el = el)} />
      </div>
    );
  }
}
