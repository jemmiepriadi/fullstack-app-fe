import React, {useEffect} from "react";
import {connect} from 'react-redux'
import * as authApi from "../../apis/auth";
import { Redirect} from 'react-router-dom';
import queryString from 'query-string'
import {displayAlert} from "../../redux/actions/notif";
import {Formik, Form, Field} from "formik";
import * as auth from "../../redux/actions/auth";
import Cookies from "js-cookie";
import { bindActionCreators } from "redux";

class LoginForm extends React.PureComponent {
    state = {
        showPassword: false
    }

    render() {
        return <Form>
            <div className='form-group'>
                <label>Email</label>
                <Field
                    name='email'
                    type='text'
                    className='form-control'
                />
            </div>
            <div className='form-group'>
                <label>Password</label>
                <div>
                <Field
                    name='password'
                    type={this.state.showPassword ? 'text' : 'password'}
                    className='form-control'
                    style={{paddingRight:'2em'}}
                />
                {/* <span style={{float: "right", position: "relative",
                    marginTop: '-33px', marginRight:'10px', zIndex:2}}>
                {this.state.showPassword ? (
                    <EyeSlashFill onClick={this.seePassword} />
                ):(
                    <EyeFill onClick={this.seePassword}/>
                )}
                </span> */}
                </div>
            </div>
            <button type='submit' className='btn btn-primary'>Login</button>
        </Form>
    }

    seePassword = () => {
        this.setState({showPassword: !this.state.showPassword})
    }
}

class LoginPage extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            loginSuccess: false
        }
    }
    
    async handleChange(fieldname, value){
        this.setState({
          [fieldname]: value
        })
      }

      componentDidMount(){
      }

    render() {
        if (this.state.loginSuccess){
            // let targetPage = queryString.parse
            return <Redirect to={'/jobsList'}/>
        } else {
            return <div className={'d-flex flex-column'} style={{'transform':'translateY(50%)'}}>
                    <h3 className={'align-self-center'} style={{'textAlign':'center'}}>Login</h3>
                    <div className='align-self-center' style={{width:'300px'}}>
                        <Formik
                            initialValues={{email: '',password: ''}}
                            onSubmit={this.submit}
                            component={LoginForm}
                        />
                    </div>
            </div>
        }
    }

    submit = async ({email,password}) => {
        let data = {
            email: email,
            password: password  
        }
        try {
            const login = await authApi.login(data)
            const responseToken = login.data?.data?.token 
            if(responseToken){
                Cookies.set('auth_token',responseToken, { path: '/' });
            }
            let cookie = Cookies?.get('auth_token');
            let token = {
                token: cookie
            }
            const response = cookie != null ? await authApi.getMeByToken(token) :await authApi.me()
            // const response = await authApi.me();
            const user = response?.data?.data;
            this.props.displayAlert({message:'Login successful',type:'success'})
            sessionStorage.setItem('email', user.email)
            let change = await this.handleChange("loginSuccess", true)
            if(change)return <Redirect to={'/jobsList'}/>
        } catch (e) {
            this.props.displayAlert({message:'Login failed',type:'success'})
        }
    }
}


const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        displayAlert: ({ message, type }) => displayAlert({ message, type })
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
