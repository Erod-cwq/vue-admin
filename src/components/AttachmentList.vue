<template>
<page-view>
  <a-row :gutter="12" type="flex" align="middle">
    <a-col :span="18">
      <a-card :body-style="{padding:'16px'}" bordered="true">
        <div class="search-wrapper">
          <a-form layout="inline">
            <a-row :gutter="36">
              <a-col :span="8">
                <a-form-item label="关键词">
                  <a-input v-model="queryParam.keyword" @keyup.enter="handleQuery()"></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="文件类型">
                  <a-select
                      v-model="queryParam.mediaType"
                      @change="handleQuery()"
                      :loading="mediaTypesLoading"
                      allowClear
                  >
                    <a-select-option v-for="(item, index) in mediaTypes" :key="index" :value="item">
                    {{item}}
                    </a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <span>
                  <a-space>
                    <a-button type="primary" @click="handleQuery">查找</a-button>
                    <a-button @click="handleResetParam">重置</a-button>
                  </a-space>
                </span>
              </a-col>
            </a-row>
          </a-form>
        </div>
        <div style="margin: 20px">
          <a-button type="primary" icon="cloud-upload" @click="uploadVisible=true">上传文件</a-button>
        </div>


      </a-card>
    </a-col>
    <a-col :span="24">
      <a-list item-layout="horizontal" :data-source="formattedDatas">
        <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
          <a slot="actions">编辑</a>
          <a slot="actions" @click="handleDelete(item.id)">删除</a>
          <a-list-item-meta>
            <a slot="title" @click="handleShowPicture(item)">{{ item.name }}</a>
            <a-avatar
                slot="avatar"
                :src="item.thumbPath"
                shape="square"
                v-show="handleJudgeMediaType(item)"
                :size="64"
                @click="handleShowPicture(item)"
                style="cursor: pointer"
            />
            <a-avatar
                slot="avatar"
                shape="square"
                v-show="!handleJudgeMediaType(item)"
                :size="64"
            >无</a-avatar>
          </a-list-item-meta>
        </a-list-item>
      </a-list>
    </a-col>
  </a-row>
  <div class="page-wrapper">
    <a-pagination
        class="pagination"
        :current="pagination.page"
        :total="pagination.total"
        :defaultPageSize="pagination.size"
        :pageSizeOptions="['10', '20', '30', '40', '50']"
        showSizeChanger
        @change="handlePaginationChange"
        @showSizeChange="handlePaginationChange"
        showLessItems
    />
  </div>
  <a-modal title="上传文件" v-model="uploadVisible" :footer="null" :afterClose="onUploadClose" destroyOnClose>
    <FileUpload ref="upload"></FileUpload>

  </a-modal>
  <div class="full" v-show="pictureVisible" v-if="selectedAttachment" @click="pictureVisible=false">
    <img ref="img" :src="selectedAttachment.path"  alt="无法加载" height="100%"/>
  </div>
</page-view>
</template>

<script>
// eslint-disable-next-line no-unused-vars

import attachmentApi from "@/api/attachment";
import  PageView  from "@/components/PageView"
const cocoSsd = require('@tensorflow-models/coco-ssd')
import '@tensorflow/tfjs-backend-cpu'
import '@tensorflow/tfjs-backend-webgl'
export default {
  name: "AttachmentList",
  components:{
    PageView
  },
  data() {
    return {
      uploadVisible: false,
      pictureVisible: false,
      selectedAttachment: {},
      mediaTypes: [],
      attachments: [],
      listLoading: true,
      mediaTypesLoading: true,
      queryParam: {
        page: 0,
        size: 10,
        sort: null,
        keyword: null,
        mediaType: null
      },
      pagination: {
        page: 1,
        size: 10,
        sort: null,
        total: 1
      }
    }
  },
  created() {
    this.handleListAttachments()
    this.handleListMediaTypes()
  },
  computed: {
    formattedDatas() {
      return this.attachments
    }
  },
  methods: {
    detect(){
      (async () => {
        const img = this.$refs.img
        // Load the model.
        const model = await cocoSsd.load();

        // Classify the image.
        const predictions = await model.detect(img);

        console.log('Predictions: ');
        console.log(predictions);
      })();
    },
    onUploadClose() {
      this.$refs.upload.handleClearFileList()
      this.handlePaginationChange(1, this.pagination.size)
      this.handleListMediaTypes()
    },
    handleResetParam() {
      this.queryParam.keyword = null
      this.queryParam.mediaType = null
      this.handlePaginationChange(1, this.pagination.size)
      this.handleListMediaTypes()
    },
    handlePaginationChange(page, size) {
      this.pagination.page = page
      this.pagination.size = size
      this.handleListAttachments()
    },
    handleQuery() {
      this.handlePaginationChange(1, this.pagination.size)
    },
    handleListAttachments() {
      this.queryParam.page = this.pagination.page - 1
      this.queryParam.size = this.pagination.size
      this.queryParam.sort = this.pagination.sort
      this.listLoading = true
      attachmentApi.query(this.queryParam).then(
          response => {
            this.attachments = response.data.content
            this.pagination.total = response.data.totalElements
          }
      ).finally(() => {
        setTimeout(() => {
          this.listLoading = false
        }, 200)
      })
    },
    handleListMediaTypes() {
      this.mediaTypesLoading = true
      attachmentApi.getMediaType()
          .then(response => {
            this.mediaTypes = response.data;
          }).finally(() => {
        setTimeout(() => {
          this.mediaTypesLoading = false
        }, 200)
      })
    },
    handleJudgeMediaType(attachement) {
      let mediaType = attachement.mediaType
      if (mediaType) {
        let prefix = mediaType.split('/')[0]
        return prefix === 'image';
      }
      return false

    },

    handleShowPicture(attachment) {
      if (this.handleJudgeMediaType(attachment)) {
        this.selectedAttachment = attachment
        this.pictureVisible = true
        this.detect()
      }
    },
    handleDelete(id) {
      let that = this
      this.handlePaginationChange(1, this.pagination.size)
      this.$confirm({
        title: '确定要批量删除选中的附件吗?',
        content: '一旦删除不可恢复，请谨慎操作',
        onOk() {
          attachmentApi.delete(id).then(()=>{
              that.$message.success('删除成功')
              }
          )
          .finally(()=>{
            that.handleListAttachments()
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
.full{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  cursor: zoom-out;
  display: block;
  background-color: rgba(0,0,0,0.5);
  text-align: center;
}
.page-wrapper {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: end;
  -ms-flex-pack: end;
  justify-content: flex-end;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: horizontal;
  -webkit-box-direction: normal;
  flex-flow: row wrap;}

.pagination {
  margin-top: 1rem;
}

</style>
