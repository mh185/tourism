<template>
  <el-card>
    <div class="block">
      <el-date-picker
        v-model="startTime"
        type="datetime"
        :picker-options="issueStartTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布开始时间"
      />
      <el-date-picker
        v-model="endTime"
        type="datetime"
        :picker-options="issueEndTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布结束时间"
      />
    </div>
    <el-input
      v-model="input"
      class="queryInput"
      placeholder="搜索关键词"
      clearable
    />
    <el-button
      class="queryBtn"
      type="primary"
      icon="el-icon-search"
      @click="query"
    >查询</el-button>
    <el-button
      class="queryBtn"
      icon="el-icon-refresh"
      @click="refresh"
    >重置</el-button>
    <el-button
      class="addBtn"
      type="primary"
      @click="add"
    >新增大会资讯</el-button>
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
        prop="title"
        label="标题"
      />
      <el-table-column
        prop="describes"
        label="简介"
        :show-overflow-tooltip="true"
      />
      <el-table-column prop="sort" label="排序" />
      <el-table-column
        prop="nickNamePc"
        label="发布人"
      />
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
    <!-- 分页 -->
    <el-pagination
      class="page"
      :current-page="pageNum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 弹窗 ->新增 -->
    <el-dialog title="新增大会资讯" :visible.sync="addStatus" width="50%">
      <el-form v-if="addStatus" ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="标题：" label-width="120px" prop="title">
          <el-input
            v-model="form.title"
            clearable
            placeholder="请输入标题"
          />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px" prop="sort">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
        </el-form-item>
        <el-form-item label="来源：" label-width="120px">
          <el-input
            v-model="form.source"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="记者：" label-width="120px">
          <el-input
            v-model="form.reporter"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="编辑：" label-width="120px">
          <el-input
            v-model="form.editor"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="审核：" label-width="120px">
          <el-input
            v-model="form.reviewer"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="简介：" label-width="120px" prop="describes">
          <el-input
            v-model="form.describes"
            clearable
            placeholder="请输入"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="封面图片：" label-width="120px">
          <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
        </el-form-item>
        <el-form-item label="正文：" label-width="120px" prop="content">
          <!-- <tinymce v-if="addStatus" v-model="form.content" :height="300" /> -->
          <quill-editor v-model="form.content" :options="editorOption" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addAscertain('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑 -->
    <el-dialog title="编辑大会资讯" :visible.sync="editStatus" width="50%">
      <el-form v-if="editStatus" :model="form">
        <el-form-item label="标题：" label-width="120px">
          <el-input
            v-model="form.title"
            clearable
            placeholder="请选择景区"
          />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
        </el-form-item>
        <el-form-item label="来源：" label-width="120px">
          <el-input
            v-model="form.source"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="记者：" label-width="120px">
          <el-input
            v-model="form.reporter"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="编辑：" label-width="120px">
          <el-input
            v-model="form.editor"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="审核：" label-width="120px">
          <el-input
            v-model="form.reviewer"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="简介：" label-width="120px">
          <el-input
            v-model="form.describes"
            clearable
            placeholder="请输入"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="封面图片：" label-width="120px">
          <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
        </el-form-item>
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
    <el-dialog title="查看大会资讯" :visible.sync="lookStatus" width="50%">
      <el-form v-if="lookStatus" :model="form">
        <el-form-item label="标题：" label-width="120px">
          {{ form.title }}
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          {{ form.sort }}
        </el-form-item>
        <el-form-item label="来源：" label-width="120px">
          {{form.source}}
        </el-form-item>
        <el-form-item label="记者：" label-width="120px">
          {{form.reporter}}
        </el-form-item>
        <el-form-item label="编辑：" label-width="120px">
          {{form.editor}}
        </el-form-item>
        <el-form-item label="审核：" label-width="120px">
          {{form.reviewer}}
        </el-form-item>
        <el-form-item label="简介：" label-width="120px">
          {{ form.describes }}
        </el-form-item>
        <el-form-item label="封面图片：" label-width="120px">
          <el-image
            style="width: 100px; height: 100px"
            :src="this.urlbanner + this.coverUrl"
            :preview-src-list="[this.urlbanner + this.coverUrl]"
          />
        </el-form-item>
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
import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { getToken } from '@/utils/auth'
import Upload from '@/components/Upload/image-upload'
// import { getToken } from '@/utils/auth';
import Dropzone from '@/components/Upload' // 上传图片
import { pageQuery, selectOne, update, insert, deleteId, upfiles } from '@/api/informationConvention'
import user from '@/store/modules/user'
export default {
  name: 'DropzoneDemo',
  components: { Dropzone, quillEditor, quillRedefine, Upload },
  data() {
    return {
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      coverUrl: '',
      startTime: '',
      endTime: '',
      coverFile: [],
      dialogImageUrl: '',
      dialogVisible: false,
      editStatus: false, // 编辑
      lookStatus: false, // 查看
      addStatus: false, // 新增
      publishTime: '', // 查询发布时间
      input: '', // 查询输入框
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      activeName: 'first',
      form: {},
      informationList: [], // 列表数据
      myHander: {},
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入排序', trigger: 'change' }],
        describes: [{ required: true, message: '请输入简介', trigger: 'change' }],
        content: [{ required: true, message: '请输入内容', trigger: 'change' }]
      },
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
    coverFileChange(file, flieList) {
      if (flieList.length) {
        const id = flieList[0].response && flieList[0].response.id
        this.form.coverId = id
      } else {
        this.form.coverId = ''
      }
    },
    // 图片上传
    httpRequest(content) {
      const { file } = content
      const formData = new FormData()
      formData.append('file', file)
      upfiles(formData)
        .then((res) => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1000
          })
          content.onSuccess(res.data)
        })
        .catch((err) => {
          content.onError(err)
        })
    },
    // 查询
    query() {
      this.getList()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 查看
    look(user) {
      const params = {
        id: user.id
      }
      this.lookStatus = true
      selectOne(params).then(res => {
        this.form = res.data
        this.coverUrl = res.data.coverUrl
      })
    },
    // 获取列表
    getList() {
      this.listLoading = true
      const params = {
        page: this.pageNum,
        size: this.pageSize,
        keyWord: this.input,
        startTime: this.startTime,
        endTime: this.endTime
      }
      pageQuery(params).then(res => {
        this.informationList = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 编辑 -发送请求
    editAscertain() {
      update(this.form).then(res => {
        if (res.code == 200) {
          this.$message({ message: res.message, type: 'success' })
        }
      })
      this.form = {}
      this.editStatus = false
    },
    // 编辑 -弹框
    edit(user) {
      const params = {
        id: user.id
      }
      selectOne(params).then(res => {
        this.form = res.data
        this.coverFile = [{ url: this.urlbanner + res.data.coverUrl }]
      })
      this.editStatus = true
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
    addAscertain(form) {
      if(this.coverFile == ''){
      this.$message({ message: '请选择封面图片', type: 'warning' })
      } else {
      this.$refs[form].validate((valid) => {
        if (valid) {
          insert(this.form).then(res => {
            if (res.code == 200) {
              this.$message({ message: res.message, type: 'success' })
              this.getList()
            }
          })
          this.form = {}
          this.addStatus = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
      }
    },
    resetForm(form) {
      this.$refs[form].resetFields()
      this.addStatus = false
    },
    // 新增 - 弹框
    add() {
      this.form = {}
      this.coverFile = []
      this.addStatus = true
    },
    // 删除商品
    remove(id) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: id
          }
          deleteId(params).then(res => {
            this.getList()
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
    // 商品重置按钮
    refresh() {
      (this.input = ''), (this.publishTime = '')
    },
    // 分页
    handleCurrentChange(pageNum) {
      console.log(`当前页: ${pageNum}`)
      this.pageNum = pageNum
      this.getList()
    },
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`)
      this.pageSize = pageSize
      this.pageNum = 1
      this.getList()
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
  margin-right: 50px;
}
.Time{
  float: left;
}
.block{
  float: left;
}
.txt >>> img{
  width: 100%;
  margin-top: 10px;
}
</style>
