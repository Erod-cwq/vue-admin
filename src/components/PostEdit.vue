<template>
<div class="editor">
  <a-space>
    <a-button type="primary" @click="postSettingVisible = true">发布</a-button>
  </a-space>
  <div class="editor">
    <a-row :gutter="12">
      <a-col :span="24">
        <div class="title">
          <a-input v-model="post.title" size="large" placeholder="请输入文章标题" />
        </div>

        <div id="editor">
          <MarkdownEditor
              ref="editor"
              :original-content="post.originalContent"
              :selected-picture-ids="pictureIds"
               @onContentChange="onContentChange"
               @onRefreshPictureIds="refreshPictureIdsFromEditor"/>
        </div>
      </a-col>

    </a-row>
  </div>
  <post-setting
  :post="post"
  :tagIds="selectedTagIds"
  :visible="postSettingVisible"
  :pictureIds = "pictureIds"
  @close="postSettingVisible=false"
  @onRefreshTagIds="refreshTagIdsFromSetting"
  @onRefreshPost="onRefreshPostFromSetting"
  />


</div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor";
import PostSetting from "@/components/PostSetting";
import postApi from "@/api/post";
export default {
  name: "PostEdit",
  components:{
    MarkdownEditor,
    PostSetting
  },
  data(){
    return{
      post:{},
      contentChanges: 0,
      postSettingVisible:false,
      selectedTagIds: [],
      pictureIds:[]

    }
  },
  beforeRouteEnter(to, from, next){
    const postId = to.query.postId
    next(vm => {
      if(postId){
        postApi.get(postId).then(response =>{
          const post = response.data
          vm.post = post
          vm.selectedTagIds = post.tagIds
          vm.pictureIds = post.pictureIds
        })
      }
    })
  },
  destroyed() {
    if(this.postSettingVisible){
      this.postSettingVisible = false
    }
  },
  watch:{
    pictureIds(val){
      this.pictureIds = val
    }
  },
  methods:{
    onContentChange(val){
      this.contentChanges++
      this.post.originalContent = val
    },
    refreshTagIdsFromSetting(val){
      this.selectedTagIds = val
    },
    refreshPictureIdsFromEditor(val){
      this.pictureIds = val
    },
    onRefreshPostFromSetting(post) {
      this.post = post
    },
  }
}
</script>

<style scoped>
.editor{
  margin: 18px;
}
.title{
  margin: 10px;
}
</style>
