import Cookies from "js-cookie";
import React from "react";
import { Link, Redirect } from "react-router-dom";
import createHistory from 'history/createBrowserHistory';
import { Checkbox, Footer, Input } from "rsuite";
import { Button, Col, Form, ListGroup, Row } from "react-bootstrap";
import { getAll, getAllJobs } from "../../apis/jobs";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { displayAlert } from "../../redux/actions/notif";
import jwtDecode from "jwt-decode";


class JobListPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin:false,
            description:"",
            location:"",
            full_time:null,
            jobs:[],
            page: 1,
            size: 9
        }
        this.handleChange = this.handleChange.bind(this)
    }

    async componentDidMount(){
        let cookie = Cookies.get('auth_token' )
        let history = createHistory();
        
        if(cookie){ 
            await this.handleChange("isLogin", true)
        }else if(cookie == '' || !cookie){
            let history = createHistory();
             window.location.href="/login"
        }
        if((jwtDecode(cookie).exp * 1000 )- 60000 <= Date.now()){
            window.location.href="/logout"

        }
        let data = {
            page: 1,
            size: 9
        }
        try{
            let promise = await getAllJobs(data).catch(error =>{
                this.props.displayAlert({message: error.response.data.message, type:"error"})
                window.location.href='/logout'
                
            });
            let response = promise?.data
            await this.handleChange('jobs', response?.data?.data)
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
        if(!this.props.isLogin){
            // return <Redirect to={'/login'}/> 
         }
        return <div>
            <JobPageTitle/>
            <JobListSearch onChange={this.handleChange} isLogin={this.state.isLogin}/>
            <JobListBody onChange={this.handleChange} jobs={this.state.jobs}/>
            <JobListFooter onChange={this.handleChange} page={this.state.page} size={this.state.size} jobs={this.state.jobs}/>
        </div>
    }
}

class JobPageTitle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    render(){
        return (
        <div style={{backgroundColor:"skyblue", backgroundSize:"50%"}}>
            <h1 style={{color:"white"}}>Github Jobs</h1>
            <Button style={{float:"right"}} onClick={()=>{window.location.href="/logout"}} >Logout</Button>
        </div>
        )
    }
}

class JobListSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLogin:false,
            description:"",
            location:"",
            full_time:null,
        }
    }
    componentDidMount(){
    }

    checkType = (e) => {
        this.handleChange("full_time", e.target.checked)
    }

    async handleChange(fieldname, value){
        this.setState({
            [fieldname]: value
          })
          this.props.onChange(fieldname, value)
      }

    SearchButton = async() =>{
        let data = {}
        if(this.state?.description && this.state.description !='' ){
            data.description = this.state.description
        }
        if(this.state?.location && this.state.location != ''){
            data.location = this.state.location
        }
        if(this.state?.full_time !=null){
            data.full_time = this.state.full_time
        }
        if(this.state?.description == '' && this.state.location == '' && this.state.full_time == null ){
            return
        }
        try{
            let promise = await getAllJobs(data);
            let response = promise?.data
            this.props.onChange("jobs",response.data.data)
        }catch(e){
            
        }
        
    }

    render(){
        
        return (
            <Row className="mb-3 align-items-end">
                <Form.Group as={Col} className="form-prop col-5">
                    <Form.Label >Description:</Form.Label>        
                    <Form.Control onChange={e=> this.handleChange("description", e.target.value)}/>
                </Form.Group>
                <Form.Group as={Col} className="form-prop col-5">
                    <Form.Label >Location:</Form.Label>        
                    <Form.Control onChange={e=>this.handleChange("location",e.target.value)} />
                </Form.Group>
                <Form.Group as={Row} className="form-prop col-1">
                    <Form.Label >Full time:</Form.Label>        
                    <Form.Check  
                        onChange={e=>this.checkType(e)}
                    />
                </Form.Group>
                <Form.Group as={Col} className="form-prop">
                    <Button onClick={this.SearchButton}>Search</Button>
                </Form.Group>
            </Row>
            
        );
    }
}

class JobListBody extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount(){

    }

    renderJobs(){
        let array = []
        this.props?.jobs && this.props.jobs.forEach(job => {
            array.push(
                <table class=" table-hover ">
                    <tbody className="border">
                        <tr style={{border:"0px"}}>
                                <td colSpan={2} style={{width: "90%", fontSize:"24px"}}>
                                   <Link to={'/job/details/' + job.id}>{job.title}</Link> 
                                </td>
                                <td style={{ fontSize :"20px"}}>
                                    {job.location}
                                
                                </td>
                        </tr>
                        <tr>
                            <td>
                                <div><span style={{color:"gray"}}>{job.company}</span> - <span style={{color:"darkgreen"}}><strong>{job.type}</strong></span> </div>
                            </td>
                        </tr>
                    
                    </tbody>
                </table>
            )
        });
        return array
    }
    render(){
        return (
            <ListGroup>
                {this.renderJobs()}
            </ListGroup>)
    }
}

class JobListFooter extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    OnMore=async()=>{
        let page = 1+this.props.page
        try{
            let data = {
                page: 1+this.props.page,
                size: 9
            }
            let promise = await getAllJobs(data);
            let response = promise?.data
            let array = [...this.props.jobs, ...response.data.data]
            this.props.onChange("jobs",array)
        }catch(e){
            
        }
    }

    render(){
        return (
            <Footer style={{width:"100%", marginTop:"5%"}} >
                <Button onClick={this.OnMore} className="fixed-bottom">More Jobs</Button>
            </Footer>
        )
    }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        displayAlert: ({ message, type }) => displayAlert({ message, type })
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(JobListPage)