import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorker from './utils/serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import Cookies from 'js-cookie';
import NotifBar from './constants/NotifBar/NotifBar';

// import { ReactNotifications } from 'react-notifications-component'
const JobListPage = lazy(() => import("./Pages/Jobs/JobListPage"));
const JobDetailPage = lazy(() => import("./Pages/Jobs/JobDetailPage"));
const LoginPage = lazy(() => import("./Pages/Auth/LoginPage"));
const LogoutPage = lazy(() => import("./Pages/Auth/LogoutPage"));


class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          isLogin:Cookies.get('auth_token') ? true : false,
          cookie: Cookies.get('auth_token') ?? ''
      }
      this.handleChange = this.handleChange.bind(this)
  }

  async componentDidMount(){
  }
  
  async handleChange(fieldname, value){
    this.setState({
      [fieldname]: value
    })
  }

  render(){
    let isLoggedIn = this.state.isLogin
      return (
        <Suspense fallback={<div>Loading... </div>}>

          <Router>
            <NotifBar />
            <Switch>
              <Route path='/login' component={LoginPage} />
              <Route path='/jobsList' component={JobListPage} />
              <Route path='/job/details/:id' component={JobDetailPage} />

              <Route path='/logout' component={LogoutPage} />

            </Switch>

          </Router>
        </Suspense>
      );
  }
}

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <App />
      </Provider> 
    {/* <App/> */}
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
serviceWorker.unregister();
