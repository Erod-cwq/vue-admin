import service from "@/utils/service";

const baseUrl = '/admin/posts'

const postApi = {}

postApi.query = params =>{
    return service({
        url:baseUrl,
        params:params,
        method:'get'
    })
}

postApi.create = postToCreated =>{
    return service({
        url:baseUrl,
        data:postToCreated,
        method:'post'
    })

}

postApi.get = postId =>{
    return service({
        url: `${baseUrl}/${postId}`,
        method:'get'
    })
}

postApi.update = (postId, postToUpdate) =>{
    return service({
        url:`${baseUrl}/${postId}`,
        method:'put',
        data: postToUpdate
    })
}

postApi.delete = postId =>{
    return service({
        url: `${baseUrl}/${postId}`,
        method:'delete'
    })
}

postApi.upload = formData =>{
    return service({
        url: `${baseUrl}/picture`,
        timeout: 8640000, // 24 hours
        data: formData, // form data
        method: 'post'
    })
}

export default postApi
