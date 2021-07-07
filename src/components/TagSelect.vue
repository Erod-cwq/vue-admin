<template>
  <div>
    <a-select
      v-model="selectedTagNames"
      class="w-full"
      allowClear
      mode="tags"
      placeholder="选择或输入标签"
      @change="handleChange">
      <a-select-option v-for="tag in tags" :key="tag.id" :value="tag.name">{{tag.name}} </a-select-option>
      </a-select>
  </div>
</template>

<script>
import tagApi from "@/api/tag";
import axios from 'axios'
export default {
  name: "TagSelect",
  model: {
    prop: 'tagIds',
    event: 'change'
  },
  props:{
    tagIds:{
      type:Array,
      required:false,
      default:()=>[]
    }
  },
  data(){
    return{
      tags:[],
      selectedTagNames:[]
    }
  },
  created() {
    this.handleListTags()
  },
  watch:{
    tags(val){
      if(val){
        this.selectedTagNames = this.tagIds.map(tagId => this.tagIdMap[tagId].name)
      }
    }
  },
  computed:{
    tagNameMap(){
      const tagNameMap = {}
      this.tags.forEach(tag=>{tagNameMap[tag.name] = tag})
      return tagNameMap
    },
    tagIdMap(){
      const tagIdMap = {}
      this.tags.forEach(tag=>{tagIdMap[tag.id] = tag})
      return tagIdMap
    }
  },
  methods:{
    handleListTags(callback){
      tagApi.listAll(true).then(response => {
        this.tags = response.data
        if(callback){
          callback()
        }
      })
    },
    handleChange(){
      const tagNamesToCreate = this.selectedTagNames.filter(tagName => !this.tagNameMap[tagName])

      if(tagNamesToCreate === []){
        const tagIds = this.selectedTagNames.map(tagName => this.tagNameMap[tagName].id)
        this.$emit('change', tagIds)
        return
      }
      const creatPromises = tagNamesToCreate.map(tagName => tagApi.createWithName(tagName))
      axios.all(creatPromises).then(
          axios.spread(()=>{
            this.handleListTags(()=>{
              const tagIds = this.selectedTagNames.map(tagName => this.tagNameMap[tagName].id)
              this.$emit('change', tagIds)
            })
          })
      )
    }
  }
}
</script>

<style scoped>

</style>
