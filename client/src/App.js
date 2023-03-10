import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import ItemTable from './components/ItemTable';
import ItemProfile from './components/ItemProfile';
import OrderTable from './components/OrderTable';
import OrderItemsTable from './components/OrderItemsTable';
import AddOrder from './components/AddOrder';
import BrandTable from './components/BrandTable';
import CategoryTable from './components/CategoryTable';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { WinWidthProvider } from './context/WinWidthContext';

function App() {
  return (
    <WinWidthProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/" render={() => (
            <Redirect to="/items" />
          )} />
          <Route exact path='/items' component={ItemTable} />
          <Route exact path='/orders' component={OrderTable} />
          <Route exact path='/orders/:id' component={OrderItemsTable} />
          <Route exact path='/add-order' component={AddOrder} />
          <Route exact path='/item/:id' component={ItemProfile} />
          <Route exact path='/brands' component={BrandTable}/>
          <Route exact path='/categories' component={CategoryTable}/>
        </Switch>
      </Router>
    </WinWidthProvider>
  );
}

export default App;
