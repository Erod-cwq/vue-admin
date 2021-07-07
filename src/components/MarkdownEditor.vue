<template>
  <div>
    <halo-editor
        ref="md"
        v-model="originalContentData"
        :boxShadow="false"
        :toolbars="toolbars"
        :ishljs="true"
        autofocus
        @imgAdd="handleAttachmentUpload"/>

  </div>
</template>

<script>
import { toolbars } from '@/core/const'
import { haloEditor } from 'halo-editor'
import 'halo-editor/dist/css/index.css'
import postApi from "@/api/post";
export default {
  name: "MarkdownEditor",
  components:{
    haloEditor
  },
  props: {
    originalContent: {
      type: String,
      required: false,
      default: ''
    },
    selectedPictureIds:{
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      toolbars,
      originalContentData: '',
      pictureIds:this.selectedPictureIds
    }
  },
  watch:{
    originalContent(val){
      this.originalContentData =val
    },
    originalContentData(val) {
      this.$emit('onContentChange', val)
    },
    pictureIds(val){
      this.pictureIds = val
      this.$emit('onRefreshPictureIds', val)
    }
  },
  methods:{
    handleAttachmentUpload(pos, $file){
      let formdata = new FormData()
      formdata.append('file', $file)
      postApi.upload(formdata).then(response => {
        let responseObject = response.data
        let HaloEditor = this.$refs.md
        HaloEditor.$img2Url(pos, encodeURI(responseObject.path))
        this.pictureIds.push(responseObject.id)
      })
    }
  }
}
</script>

<style scoped>

</style>
