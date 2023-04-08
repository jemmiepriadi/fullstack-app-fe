import React from "react";
import { getJobDetail } from "../../apis/jobs";
import createHistory from 'history/createBrowserHistory';
import Cookies from "js-cookie";
import { attemptLogout } from "../../redux/actions/auth";
import { Link } from "react-router-dom";

export default class JobDetailPage extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            job:""
        }
    }
    async componentDidMount(){
        let cookie = Cookies.get('auth_token' )
        let history = createHistory();
        
        if(cookie){ 
            // await this.handleChange("isLogin", true)
        }else if(cookie == '' || !cookie){
             history = createHistory();
             window.location.href="/login"
        }
        try{
            let id = this.props?.match?.params?.id;
            let promise = await getJobDetail(id).catch(error =>{
                if (error.response) {
                    if(error.response.data.message.toString().toLowerCase().includes("the token has expired")){
                        attemptLogout()
                        window.location.href="/login"
                    }
                  }  else {
                    console.log('Error', error.message);
                    return error.message;
                  }
                  
            });;
            let response = promise.data
            console.log(response.data)
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
<div style={{backgroundColor:"skyblue", backgroundSize:"50%"}}><h1 style={{color:"white"}}>Github Jobs</h1></div>        )
    }
}

class JobDetailBody extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount(){
        let id = this.props?.match?.params?.id;
        console.log(id)
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