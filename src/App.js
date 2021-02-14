import logo from './logo.svg';
import './App.css';
import Nav from './Nav';
import Login from './login';
import Package from './package/package';
import AddPackage from './package/addPackage';
import EditPackage from './package/editPackage';
import Calendar from './calendar/calendar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div>
          {/* {typeof localStorage.status !== "undefined" ? <Nav /> : ''} */}
          <Nav />
          <Switch>
            <Route path="/" exact component={Package} />
            <Route path="/login" component={Login} />
            <Route path="/package" exact component={Package} />
            <Route path="/package/addPackage" component={AddPackage} />
            <Route path="/package/editPackage" component={EditPackage} />
            <Route path="/calendar" component={Calendar} />
          </Switch>
      </div>
    </Router>
  );
}

export default App;
