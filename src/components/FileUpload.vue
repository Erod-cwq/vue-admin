<template>
  <div>
    <file-pond
        :name="name"
        ref="pond"
        :label-idle="label"
        :allow-multiple="true"
        :allowImagePreview="true"
        :files = "fileList"
        :accepted-file-types="accepts"
        labelFileProcessing="上传中"
        labelFileProcessingComplete="上传完成"
        labelFileProcessingAborted="取消上传"
        labelFileProcessingError="上传错误"
        labelTapToCancel="点击取消"
        labelTapToRetry="点击重试"
        labelFileTypeNotAllowed="不支持当前文件格式"
        fileValidateTypeLabelExpectedTypes="请选择 {lastType} 格式的文件"
        @init="handleInit"
        :server="server"
    >
      </file-pond>
  </div>

</template>

<script>

import vueFilePond from 'vue-filepond'
import axios from "axios"
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import attachmentApi from "@/api/attachment";
const FilePond = vueFilePond(FilePondPluginFileValidateType, FilePondPluginImagePreview)
export default {
  name: "FileUpload",
  components:{
   FilePond
  },
  props:{
   name:{
     type:String,
     required:false,
     default:'file'
   },
    label:{
      type:String,
      required: false,
      default: '点击选择文件或将文件拖拽到此处'
    },
    accepts: {
      type: Array,
      required: false,
      default: () => {
        return null
      }
    },
  },
  data: function () {
   return{
     server:{
       process:(fieldName, file, metadata, load, error, progress, abort)=>{
         const formData = new FormData();
         formData.append(fieldName, file, file.name)
         const CancelToken = axios.CancelToken
         const source = CancelToken.source()
         attachmentApi.upload(
             formData,
             progressEvent =>{
               if(progressEvent.total > 0){
                 progress(progressEvent.lengthComputable, progressEvent.loaded, progressEvent.total)
               }
             },
             source.token
         )
         .then(response=>{
           load(response)
           this.$log.debug('Uploaded successfully', response)
           this.$emit('success', response, file)
         })
         .catch(failure =>{
           this.$log.debug('Failed to upload file', failure)
           this.$emit('failure', failure, file)
           error()
         })
         return{
           abort:()=>{
             abort()
             this.$log.debug('Upload operation aborted by the user')
           }
         }

       }
     },
     fileList: []
   }
  },
  methods:{
    handleInit(){
      this.$log.debug('FilePond has initialized')
    },
    handleClearFileList(){
      this.$refs.pond.removeFiles()
    }
  }
}
</script>

<style scoped>

</style>
