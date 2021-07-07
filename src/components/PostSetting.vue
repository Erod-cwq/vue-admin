<template>
  <a-drawer
    title="文章设置"
    width="480"
    placement="right"
    closable
    @close="onClose"
    :visible="visible">
    <div class="drawer-content">
      <div>
        <h3>基本设置</h3>
        <div class="drawer-items">
          <a-form layout="vertical">
            <a-form-item label="文章标题">
              <a-input v-model="selectedPost.title" />
            </a-form-item>

            <a-form-item label="发表时间">
              <a-date-picker
              showTime
              :defaultValue="pickerDefaultValue"
              format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择文章发表时间"
              @change="onPostDateChange"
              @ok="onPostDateOk"/>
            </a-form-item>
          </a-form>
        </div>
      </div>
      <a-divider />
      <div class="mb-4">
        <h3 class="post-setting-drawer-title">标签</h3>
        <div class="post-setting-drawer-item">
          <a-form layout="vertical">
            <a-form-item>
              <TagSelect v-model="selectedTagIds" />
            </a-form-item>
          </a-form>
        </div>
      </div>

      <a-divider class="divider-transparent"/>
      <a-button
          type="primary"
          @click="handlePublish">
        发布</a-button>

    </div>

  </a-drawer>


</template>

<script>
import { datetimeFormat } from '@/utils/datetime'
import TagSelect from "@/components/TagSelect";
import postApi from "@/api/post";
export default {
name: "PostSetting",
  components:{
  TagSelect
  },
  props:{
    visible: {
      type: Boolean,
      required: false,
      default: true
    },
    post:{
      type:Object,
      required: true
    },
    tagIds:{
      type: Array,
      required:true
    },
    pictureIds:{
      type: Array,
      required:true
    }
  },
  data(){
  return{
    selectedPost: this.post,
    selectedTagIds: this.tagIds,
    selectedPictureIds: this.pictureIds,
  }
  },
  methods:{
    onClose() {
      this.$emit('close', false)
    },
    onPostDateChange(value) {
      this.selectedPost.createTime = value.valueOf()
    },
    onPostDateOk(value) {
      this.selectedPost.createTime = value.valueOf()
    },
    handlePublish(){
      this.selectedPost.status = 'PUBLISHED'
      this.createOrUpdatePost()
    },
    createOrUpdatePost(){
      if(!this.selectedPost.title){
        this.$notification['error']({
          message:'提示',
          description:'文章标题不能为空!'
        })
        return
      }
      this.selectedPost.tagIds = this.selectedTagIds
      this.selectedPost.pictureIds = this.selectedPictureIds
      if(this.selectedPost.id){
        postApi.update(this.selectedPost.id, this.selectedPost)
      }
      else {
        postApi.create(this.selectedPost).then(response=>{
          this.selectedPost = response.data
        })
      }
      this.$router.replace({name:'Post'})

    }
  },
  computed:{
    pickerDefaultValue() {
      if (this.selectedPost.createTime) {
        const date = new Date(this.selectedPost.createTime);
        return datetimeFormat(date, 'YYYY-MM-DD HH:mm:ss')
      }
      return datetimeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss')
    }
  },
  watch:{
  tagIds(val){
      this.selectedTagIds = val
    },
  selectedTagIds(val){
    this.$emit('onRefreshTagIds', val)
  },
    selectedPost(val) {
      this.$emit('onRefreshPost', val)
    },
    post(val) {
      this.selectedPost = val
    },
    pictureIds(val){
    this.selectedPictureIds = val
    }

  }
}
</script>

<style scoped>

</style>
