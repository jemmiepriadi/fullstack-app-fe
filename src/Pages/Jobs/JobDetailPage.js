import React from "react";
import { getJobDetail } from "../../apis/jobs";
import createHistory from 'history/createBrowserHistory';
import Cookies from "js-cookie";
import { attemptLogout } from "../../redux/actions/auth";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import { displayAlert } from "../../redux/actions/notif";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import jwtDecode from "jwt-decode";

class JobDetailPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            job:""
        }
    }
    async componentDidMount(){
        let cookie = Cookies.get('auth_token' )
        
        if(cookie){ 
            // await this.handleChange("isLogin", true)
        }else if(cookie == '' || !cookie){
             window.location.href="/login"
        }
        if((jwtDecode(cookie).exp * 1000 )- 60000 <= Date.now()){
            window.location.href="/logout"

        }
        try{
            let id = this.props?.match?.params?.id;
            let promise = await getJobDetail(id).catch(error =>{
                this.props.displayAlert({message: error.response.data.message, type:"error"})
                window.location.href='/logout'
                  
            });;
            let response = promise.data
            this.handleChange('job', response?.data)
        }catch(e){
            console.log(e.message)
        }
        
    }

    async handleChange(fieldname, value){
        this.setState({
            [fieldname]: value
          })
      }

    render(){
        let history =createHistory();
        return(
            <div>
                <JobDetailHead />
                <Link to={""} onClick={()=>history.goBack()}>
                    <h5>&lt;-back</h5>
                </Link>
                <JobDetailBody job={this.state.job}/>
            </div>
        )
    }
}

class JobDetailHead extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
    }
    render(){
        return(
            <div style={{backgroundColor:"skyblue", backgroundSize:"50%", display:"flow"}}>
                <h1 style={{color:"white"}}>Github Jobs</h1>
                <Button style={{float:"right"}} onClick={()=>{window.location.href="/logout"}} >Logout</Button>
            </div>      
        )
    }
}

class JobDetailBody extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
    }
    render(){
        return(
            <div style={{padding: "3%",
                marginTop: "3%",
                marginBottom: "3%",
                borderRadius: "0.5rem",
                boxShadow: "0px -10px 20px 0px darkslategray",
                width: "100%",
                background:" #fff"}}>
                <h9>{this.props?.job?.type}</h9>
                <h1>{this.props?.job?.title}</h1>
                <hr />
                 <div style={{
                    display: "flex",
                    alignItems: 'top',
                    width:"100%"}}>
                    <div style={{float:"left"}} dangerouslySetInnerHTML={{__html:this.props.job.description}}></div>
                    <div style={{float:"left"}}><img src="https://traderepublic.com/img/tr-share.jpg" style={{width:"100%"}}/></div>
                </div>  
            </div>
        )
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        displayAlert: ({ message, type }) => displayAlert({ message, type })
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(JobDetailPage)