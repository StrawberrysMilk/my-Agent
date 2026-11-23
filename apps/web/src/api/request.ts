import axios from 'axios'

const request = axios.create({
    baseURL: '/api',
    timeout: 10_000,
    headers: {
        'content-type': 'application/json',
    }
})

request.interceptors.request.use(config => {
    return config
})

request.interceptors.response.use((response) => response, (error) => {
    return Promise.reject(error)
})

export default request
