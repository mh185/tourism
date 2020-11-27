<template>
  <el-card>
    <el-button
      class="addBtn"
      type="primary"
      @click="add"
    >新增图文</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="informationList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column
        prop="createTime"
        label="发布时间"
      />
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="look(scope.row)">查看</el-button>
          <el-button type="success" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 ->新增 -->
    <el-dialog title="新增图文" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="内容：" label-width="120px">
          <quill-editor v-model="form.content" :options="editorOption" />
          <!-- <tinymce v-if="addStatus" v-model="form.content" :height="300" /> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button type="primary" @click="addAscertain">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑 -->
    <el-dialog title="编辑图文" :visible.sync="editStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="内容：" label-width="120px">
          <!-- <tinymce v-if="editStatus" v-model="form.content" :height="300" /> -->
          <quill-editor v-model="form.content" :options="editorOption" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStatus = false">取 消</el-button>
        <el-button type="primary" @click="editAscertain">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->查看 -->
    <el-dialog title="查看图文" :visible.sync="lookStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="内容：" label-width="120px">
          <!-- <tinymce v-model="form.content" :height="300" /> -->
          <div class="ql-editor txt" v-html="form.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookStatus = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { getToken } from '@/utils/auth'
import { getInfoById, insertImageTextLiveContent, deleteImageTextLiveContent, updateImageTextLiveContent } from '@/api/imageText'
export default {
  components: { quillEditor, quillRedefine },
  data() {
    return {
      imageId: '',
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      addStatus: false, // 新增
      editStatus: false, // 编辑
      lookStatus: false, // 查看
      startTime: '', // 查询发布时间
      endTime: '', // 查询结束时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 100,
      pageNum: 1, // 当前页数
      activeName: 'first',
      form: {
        miniAppType: 'TOURISM'
      },
      informationList: [],
      issueStartTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() > this.value2
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      issueEndTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() < this.value1
          }
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created() {
    this.getList(this.$route.params.id)
    this.token = getToken()
    this.editorOption = quillRedefine(
      {
        // 图片上传的设置
        uploadConfig: {
          header: (xhr, formData) => {
            xhr.setRequestHeader('token', this.token)
          },
          action: this.urlbanner + '/fileManage/v1/insert/upload', // 必填参数 图片上传地址
          // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
          // 你必须把返回的数据中所包含的图片地址 return 回去
          res: (respnse) => {
            return this.$common.imageUrl + respnse.data.url
          },
          name: 'file' // 图片上传参数名
        }
      }
    )
  },
  methods: {
    // 查询
    query() {
      this.getList()
    },
    // 列表数据
    getList(e) {
      this.imageId = e
      console.log(this.imageId)
      this.listLoading = true
      const params = {
        page: this.pageNum,
        size: this.pageSize,
        imageTextLiveId: this.imageId
      }
      getInfoById(params).then(res => {
        this.informationList = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 查看
    look(content) {
      this.form = content
      this.lookStatus = true
    },
    // 编辑 - 打开弹框
    edit(content) {
      this.form = content
      this.editStatus = true
    },
    // 编辑 - 发送请求
    editAscertain() {
      const data = {
        imageTextLiveId: this.imageId,
        content: this.form.content,
        id: this.form.id
      }
      updateImageTextLiveContent(data).then(res => {
        this.$message.success(res.message)
      })
      this.editStatus = false
    },
    // 图片上传
    // 上传成功后执行
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    // 删除图片后执行
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    },
    // 新增 - 发送请求
    addAscertain() {
      const data = {
        imageTextLiveId: this.imageId,
        content: this.form.content
      }
      insertImageTextLiveContent(data).then(res => {
        this.$message.success(res.message)
        this.getList(this.imageId)
      })
      this.addStatus = false
    },
    // 新增 - 弹框
    add() {
      this.form = {}
      this.addStatus = true
    },
    // 删除商品
    remove(idList) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: idList
          }
          deleteImageTextLiveContent(params).then(res => {
            this.getList(this.imageId)
          })
          this.$message.success('删除成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  margin-top: 15px;
}
.queryBtn {
  margin-left: 15px;
}
.queryInput {
  width: 200px;
  margin-left: 15px;
}
.addBtn {
  float: right;
  margin-bottom: 15px;
  margin-right: 50px;
}
.block{
  float: left;
}
.txt >>> img{
  width: 100%;
  margin-top: 10px;
}
</style>
