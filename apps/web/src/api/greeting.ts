import request from './request'

export interface GreetingRequest {
    name: string
}

export interface GreetingResponse {
    message: string
}

export function createGreeting(data: GreetingRequest) {
    return request.post<GreetingResponse>('/greeting', data).then((response) => response.data)
}
