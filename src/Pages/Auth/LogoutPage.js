import React from "react";
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom';
import Cookies from "js-cookie";

class LogoutPage extends React.PureComponent {
    componentDidMount() {
        Cookies.remove('auth_token',{path:'/'})
        sessionStorage.removeItem('email')
    }

    render() {
        return <Redirect to={'/login'}/>
    }
}

export default connect()(LogoutPage)