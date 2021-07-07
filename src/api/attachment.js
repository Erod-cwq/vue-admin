import service from "@/utils/service";

const baseUrl = '/admin/attachment'

const attachmentApi = {}

attachmentApi.upload = (formFile, uploadProgress, cancelToken)=>{
    return service({
        url:`${baseUrl}/upload`,
        timeout: 8640000,
        data:formFile,
        onUploadProgress:uploadProgress,
        cancelToken: cancelToken,
        method:'post'
    })
}

attachmentApi.query = (queryParam)=>{
    return service({
        url:baseUrl,
        params:queryParam,
        method:'get'
    })
}

attachmentApi.getMediaType = ()=>{
    return service({
        url:`${baseUrl}/media_type`,
        method:'get'
    })
}

attachmentApi.delete = (id)=>{
    return service({
        url:`${baseUrl}/${id}`,
        method:'delete'

    })
}
export default attachmentApi
