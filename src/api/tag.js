import service from "@/utils/service";
const baseUrl = '/admin/tags'
const tagApi = {}

tagApi.listAll = (more=false)=>{
    return service({
        url:baseUrl,
        params: {
            more: more
        },
        method:'get'
    })
}

tagApi.createWithName = (tagName)=>{
    return service({
        url:baseUrl,
        data:{
            name:tagName
        },
        method:'post'
    })
}

export default tagApi
