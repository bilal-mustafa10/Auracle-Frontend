import {Sections} from "@/helpers/parse-description";
import axios, { AxiosResponse } from 'axios';

const baseURL = "https://1925-212-161-126-135.ngrok-free.app/api/"

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        "ngrok-skip-browser-warning": "69420",
    }
});

export interface PlanData {
    context: string;
    project_plan: string;
    requirements_USPs: string;
    requirements_details: string;
    risk_assessment: string;
}

interface ResponseHeaders {
    'content-length': string;
    'content-type': string;
    date: string;
    'ngrok-trace-id': string;
    server: string;
}

interface ResponseData {
    answer: PlanData;
    headers: ResponseHeaders;
    request: XMLHttpRequest;
    status: number;
    statusText: string;
    [key: string]: any; // For any other properties not specified here
}

export const checkConnection = async () => {
    try {
        const response: AxiosResponse<ResponseData> = await api.get('data');
        console.log('response: ', response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getSoftwarePlan = async (query: Sections) => {

    const data = {
        "idea": query['idea'],
        "problemDefinition": query['Problem definition'],
        "metricsAndGoals": query['Metrics and goals'],
        "targetAudience": query['Target audience/personas'],
        "constraints": query['Constraints'],
        "solutionOverview": query['Solution overview']
    }


    console.log('query: ', data)

    try {
        const response: AxiosResponse<ResponseData> = await api.post('plan', data);
        console.log('response: ', response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


export const postRe = async (requriements: string, plan: string) => {

    const data = {
        "requirements_USPs": requriements,
        "project_plan": plan,
    }


    console.log('query: ', data)

    try {
        const response = await api.post('agent_monday', data);
        console.log('response: ', response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

