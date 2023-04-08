import React from "react";
import {connect} from 'react-redux'
import {Redirect} from 'react-router-dom';
import Cookies from "js-cookie";
import {setUser} from "../../../redux/actions/auth";

class LogoutPage extends React.PureComponent {
    componentDidMount() {
        Cookies.remove('auth_token',{path:'/'})
        localStorage.removeItem('picking_filter');
        this.props.dispatch(setUser({user: null}))
    }

    render() {
        return <Redirect to={'/login'}/>
    }
}

export default connect()(LogoutPage)