import {ProjectInfo} from "@/helpers/parse-description";
import axios, { AxiosResponse } from 'axios';

const baseURL = "https://4b84-62-252-209-93.ngrok-free.app/api/"

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

export const getSoftwarePlan = async (query: ProjectInfo | string) => {
    const data = {
        "context": query
    }
    try {
        const response: AxiosResponse<ResponseData> = await api.post('plan', data);
        console.log('response: ', response);
        return response.data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};
