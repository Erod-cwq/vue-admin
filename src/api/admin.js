import service from "@/utils/service";

const baseUrl = '/admin'

const adminApi = {}

adminApi.login = (username, password, authcode) => {
    return service({
        url: `${baseUrl}/login`,
        data: {
            username: username,
            password: password,
            authcode: authcode
        },
        method: 'post'
    })
}

adminApi.try = () =>{
    return service({
        url:'/currentprice.json',
        method:'get'
    })
}

export default adminApi
