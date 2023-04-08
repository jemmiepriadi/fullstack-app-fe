import React from "react";
import { getJobDetail } from "../../apis/jobs";
import createHistory from 'history/createBrowserHistory';
import Cookies from "js-cookie";

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
                    if(error.response.message.toLowerCase().contains("expire")){
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
            console.log(e)
        }
        
    }

    async handleChange(fieldname, value){
        this.setState({
            [fieldname]: value
          })
      }

    render(){
        return(
            <div dangerouslySetInnerHTML={{__html:this.state.job.description}}></div>
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
        let id = this.props?.match?.params?.id;
        console.log(id)
    }
    render(){
        return(
            <div>hah</div>
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
        let id = this.props?.match?.params?.id;
        console.log(id)
    }
    render(){
        return(
            <div>hah</div>
        )
    }
}