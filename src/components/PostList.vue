<template>
  <a-card :bordered="false" :body-style="{padding:'16px'}">
    <div>
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="关键词：">
              <a-input v-model="queryParam.keyword" @keyup.enter="handleQuery"/>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
          <span>
            <a-space>
              <a-button type="primary" @click="handleQuery">查询</a-button>
              <a-button @click="handleResetParam">重置</a-button>

            </a-space>

          </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-space>
        <router-link :to="{name: 'PostWrite'}">
          <a-button type="primary" icon="plus">写文章</a-button>
        </router-link>
        <router-link :to="{name:'Attachment'}">
          <a-button type="primary">我的文件</a-button>
        </router-link>
      </a-space>

    </div>
    <div class="post-table">
      <a-table :columns="columns"
               :dataSource="posts"
               :loading="postLoading"
               :pagination="false">
        <span slot="postTitle" slot-scope="text">

          <a href="../resource/1.jpg" >
            <a-tooltip placement="top" :title="'点击访问【' + text + '】'">{{text}}</a-tooltip>
          </a>
        </span>
        <span slot="tags" slot-scope="tags">
          <a-tag v-for="(tag, index) in tags" :key="index" color="green" style="margin-bottom: 8px">
            {{ tag.name }}
          </a-tag>
        </span>
        <span slot="creatTime" slot-scope="createTime">
          <a-tooltip placement="top">
              <template slot="title">
                {{ createTime | moment }}
              </template>
          </a-tooltip>
        </span>
        <span slot="action" slot-scope="text, post">
          <a @click="handleEditPost(post.id)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleDeletePost(post.id)">删除</a>
        </span>
      </a-table>
    </div>
  </a-card>

</template>

<script>
import postApi from "@/api/post";
import Vue from 'vue';
import dayjs from 'dayjs'



const columns = [
  {
    title: '标题',
    dataIndex: 'title',
    scopedSlots: { customRender: 'postTitle' }
  },
  {
    title: '标签',
    dataIndex: 'tags',
    key: 'tags',
    scopedSlots: { customRender: 'tags' }
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    key: 'createTime'
  },
  {
    title: 'Action',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
];
Vue.filter('moment', function(dataStr, pattern = 'YYYY-MM-DD HH:mm') {
  return dayjs(dataStr).format(pattern)
})
export default {
  name: "PostList",
  data(){
    return {
      queryParam:{
        page:0,
        size:10,
        sort:null,
        keyword:null
      },
      pagination:{
        page:1,
        size:10,
        sort: null,
        total:1
      },
      selectedRowKeys: [],
      posts: [],
      columns,
      postLoading:true,
      selectedPost:[]
    }

  },
  created() {
    this.handleListPosts()
  },
  methods:{

    handleQuery(){
      this.handlePaginationChange(1, this.pagination.size)
    },
    handleResetParam(){
      this.queryParam.keyword=null
    },
    handlePaginationChange(page, pageSize){
      this.pagination.page = page
      this.pagination.size = pageSize
      this.handleListPosts()
    },
    handleListPosts(){
      this.queryParam.page = this.pagination.page-1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      postApi.query(this.queryParam).then(response=>{
        this.posts = response.data.content
        this.pagination.total = response.data.totalPages
        this.postLoading = false
      })
    },
    handleEditPost(id){
      this.$router.push({ name: 'PostEdit', query: { postId:id } })
    },
    handleDeletePost(id){
      let that = this

      this.$confirm({
        title: '确定要批量删除选中的文章吗?',
        content: '一旦删除不可恢复，请谨慎操作',
        onOk() {
          postApi.delete(id).then(()=>{
            that.$message.success('删除成功')
            }
          )
              .finally(()=>{
                that.handleListPosts()
              })
        },
        onCancel() {
        }
      })
    }
  }
}
</script>

<style scoped>
.table-operator{
  margin: 18px;
}
</style>
