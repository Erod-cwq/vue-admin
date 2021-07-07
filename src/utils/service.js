import axios from 'axios'
import store from '@/store'
const service = axios.create({
    timeout: 10000,
    withCredentials: true
})

function setTokenToHeader(config) {
    // set token
    const token = store.state.user.token

    if (token && token.access_token) {
        config.headers['ADMIN-Authorization'] = token.access_token
    }
}


service.interceptors.request.use(
    config => {
        // TODO set token
        setTokenToHeader(config)
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

export default service
