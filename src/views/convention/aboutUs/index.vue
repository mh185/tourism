<template>
  <el-card>
    <el-button class="addButton" type="primary" @click="add">新增关于我们</el-button>
    <!-- 表格 -->
    <el-table
      :data="aboutList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column
        type="index"
        label="序号"
      />
      <el-table-column
        prop="nickNamePc"
        label="发布人"
      />
      <el-table-column prop="updateTime" label="发布时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="look(scope.row)">查看</el-button>
          <el-button type="success" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗 ->新增 -->
    <el-dialog title="新增关于我们" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="正文：" label-width="120px">
          <!-- <tinymce v-if="addStatus" v-model="form.content" :height="300" /> -->
          <quill-editor v-model="form.content" :options="editorOption" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button type="primary" @click="addAscertain">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑 -->
    <el-dialog title="编辑关于我们" :visible.sync="editStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="正文：" label-width="120px">
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
    <el-dialog title="查看关于我们" :visible.sync="lookStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="正文：" label-width="120px">
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
import { select, deleteId, update, insert } from '@/api/aboutUs'
export default {
  name: 'TinymceDemo',
  components: { Tinymce, quillEditor, quillRedefine },
  data() {
    return {
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      addStatus: false, // 新增弹框
      lookStatus: false, // 查看
      editStatus: false, // 编辑
      form: {
        content: ''
      },
      aboutList: [] // 列表
    }
  },
  created() {
    this.getList()
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
    // 列表
    getList() {
      const params = {
        type: 'CULTURAL_TOURISM'
      }
      select(params).then(res => {
        this.aboutList = [res.data]
      })
    },
    // 删除
    remove(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            type: 'CULTURAL_TOURISM'
          }
          deleteId(params).then(res => {
            this.$message.success('删除成功')
            this.getList()
          })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消删除' })
        })
    },
    // 编辑 - 发送请求
    editAscertain() {
      const parmas = {
        type: 'CULTURAL_TOURISM',
      }
      const data = {
        content: this.form.content
      }
      update(parmas,data).then(res => {
        if (res.code == 200) {
          this.$message.success(res.message)
        }
        this.getList()
      })
      this.editStatus = false
    },
    // 编辑 - 弹框
    edit(content) {
      this.form = content
      this.editStatus = true
    },
    // 查看
    look(content) {
      this.form = content
      this.lookStatus = true
    },
    // 新增 - 弹框
    add() {
      this.form = {}
      this.addStatus = true
    },
    // 新增 - 发送请求
    addAscertain() {
      const params = {
        type: 'CULTURAL_TOURISM',
      }
      let data = {
        content: this.form.content
      }
      insert(params,data).then(res => {
        this.getList()
      })
      this.addStatus = false
    }
  }
}
</script>

<style>
.addButton{
  float: right;
  margin-bottom: 15px;
}
.txt >>> img{
  width: 100%;
  margin-top: 10px;
}
</style>
