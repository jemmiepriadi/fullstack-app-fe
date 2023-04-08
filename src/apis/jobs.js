import Axios from "axios";
import { JOBS_URL, JOB_DETAIL_URL } from "../constants/api";

export async function getAll(){
    return Axios.get(JOBS_URL, { withCredentials:true})
}

export async function getAllJobs(data){
    let promise =  Axios.get(JOBS_URL, {params: data, withCredentials:true})
    return promise
}

export async function getJobDetail(id){
    return Axios.get(JOB_DETAIL_URL(id), {withCredentials:true})
}