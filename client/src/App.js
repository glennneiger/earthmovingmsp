import React, { Component } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";

import { setCurrentUser, logoutUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";

import { Provider } from "react-redux";
import store from "./store";

import PrivateRoute from "./components/common/PrivateRoute";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Landing from "./components/layout/Landing";
import Help from "./components/help/Help";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";

import WarehouseSetting from "./components/WarehouseSetting/WarehouseSetting";
import AddWarehouse from "./components/add-warehouse/AddWarehouse";
import EditWarehouse from "./components/edit-warehouse/EditWarehouse";

import CreateStock from "./components/create-stock/CreateStock";

import ViewStock from "./components/dashboard/ViewStock";

import EditStock from "./components/edit-stock/EditStock";

import ShowStock from "./components/show-stock/ShowStock";

import AddonExistingStock from "./components/add-prodstk-on-existing-stock/AddonExistingStock";

import StockTransfer from "./components/stock-transfer/StockTransfer";
import ShowWarehouseTransfer from "./components/show-warehouse-transfer/ShowWarehouseTransfer";

import NewStockHistory from "./components/new-prodstk-history/NewStockHistory";

import NewStockHistoryByDate from "./components/new-stock-history-by-date/NewStockHistoryByDate";

import ExistingStockHistory from "./components/existing-prodstk-history/ExistingStockHistory";

import ExistingStockHistoryByDate from "./components/existing-stock-history-by-date/ExistingStockHistoryByDate";

import DeletedStockHistory from "./components/deleted-prodstk-history/DeletedStockHistory";

import DeletedStockHistoryByDate from "./components/deleted-stock-history-by-date/DeletedStockHistoryByDate";

import WarehouseTransferHistory from "./components/warehouse-prodstk-transfer-history/warehouse-transfer-history";

import WarehouseTransferHistoryByDate from "./components/warehouse-transfer-history-by-date/WarehouseTransferHistoryByDate";

import AdvancedInventorySearch from "./components/advanced-inventory-search/AdvancedInventorySearch";

import CompanySetting from "./components/CompanySetting/CompanySetting";

import AddCompany from "./components/add-company/AddCompany";

import EditCompany from "./components/edit-company/EditCompany";

import CreateInvoice from "./components/create-invoice/CreateInvoice";

import CartProducts from "./components/cart-products/cartproducts";

import "./App.css";

// Check for token for every single page request
//find jwttoken in chrome developer tool in Local Storage where key is jwtToken and value Bearer-----so on
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    //decoded.exp => in object its has exp value if this exp value is less then the currentTime so we logout the user and redirect user to the /login
    // Logout user
    store.dispatch(logoutUser());

    // Clear current Profile
    store.dispatch(clearCurrentProfile());

    // Redirect to login
    window.location.href = "/login";
  }
}

var NotFound = ({ match }) => (
  <div>Sorry But The Page {match.url} was not found</div>
);

class App extends Component {
  constructor(props) {
    super();

    this.state = {
      isFull: false
    };
  }

  goFull = () => {
    this.setState({ isFull: true });
  };

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <div className="">
              {/*} <Route exact path="/register" component={Register} />*/}
              <Route exact path="/help" component={Help} />

              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/warehouse-setting"
                  component={WarehouseSetting}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-warehouse"
                  component={AddWarehouse}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-warehouse/:id"
                  component={EditWarehouse}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-stock"
                  component={CreateStock}
                />
              </Switch>

              <Switch>
                <PrivateRoute exact path="/view-stock" component={ViewStock} />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-stock/:id"
                  component={EditStock}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/show-stock/:id"
                  component={ShowStock}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-on-existing-stock/:id"
                  component={AddonExistingStock}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/stock-transfer"
                  component={StockTransfer}
                />
              </Switch>
              <Switch>
                {/* this route we used for display the newly stock transfer after response success*/}
                <PrivateRoute
                  exact
                  path="/show-warehouse-transfer/:id"
                  component={ShowWarehouseTransfer}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/new-stock-history"
                  component={NewStockHistory}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/new-stock-history-by-date/:date"
                  component={NewStockHistoryByDate}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/existing-stock-history"
                  component={ExistingStockHistory}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/existing-stock-history-by-date/:date"
                  component={ExistingStockHistoryByDate}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/deleted-stock-history"
                  component={DeletedStockHistory}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/deleted-stock-history-by-date/:date"
                  component={DeletedStockHistoryByDate}
                />
              </Switch>

              <Switch>
                <PrivateRoute
                  exact
                  path="/warehouse-transfer-history"
                  component={WarehouseTransferHistory}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/warehouse-transfer-history-by-date/:date"
                  component={WarehouseTransferHistoryByDate}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/advanced-inventory-search"
                  component={AdvancedInventorySearch}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/company-setting"
                  component={CompanySetting}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/add-company"
                  component={AddCompany}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/edit-company/:id"
                  component={EditCompany}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/create-invoice"
                  component={CreateInvoice}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path="/cartproducts"
                  component={CartProducts}
                />
              </Switch>
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
