<template>
  <el-card>
    <el-date-picker
      v-model="startTime"
      type="datetime"
      :picker-options="issueStartTime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择开始时间"
    />
    -
    <el-date-picker
      v-model="endTime"
      type="datetime"
      :picker-options="issueEndTime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择结束时间"
    />
    <el-input
      v-model="keyWord"
      class="queryInput"
      placeholder="搜索关键词"
      clearable
    />
    <el-button
      class="queryBtn"
      type="primary"
      icon="el-icon-search"
      @click="onClick"
    >查询</el-button>
    <el-button
      class="queryBtn"
      icon="el-icon-refresh"
      @click="refresh"
    >重置</el-button>
    <el-button class="addBtn" type="primary" @click="add">添加美食</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="commentModerationList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="标题" />
      <el-table-column prop="regionAreasName" label="位置" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="nickNamePc" label="发布人" />
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="see(scope.row)"
          >查看</el-button>
          <el-button
            type="success"
            size="mini"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            size="mini"
            @click="remove(scope.row.id)"
          >删除</el-button>
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
    <!-- 弹窗 ->新增美食 -->
    <el-dialog title="新增美食" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="标题：" label-width="120px">
          <el-input
            v-if="state == 'add' || state == 'edit'"
            v-model="form.name"
            clearable
            placeholder="请输入"
          />
          <div v-if="state == 'see'">{{ form.name }}</div>
        </el-form-item>
        <el-form-item label="位置：" label-width="120px">
          <el-select
            v-if="state == 'add' || state == 'edit'"
            v-model="form.regionAreasId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
          <div v-if="state == 'see'">{{ form.regionAreasName }}</div>
        </el-form-item>
        <el-form-item
          v-if="state == 'add' || state == 'edit'"
          label="排序："
          label-width="120px"
        >
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
          <div v-if="state == 'see'">{{ form.sort }}</div>
        </el-form-item>
        <el-form-item label="封面图片：" label-width="120px">
          <el-image
            v-if="state == 'see' || state == 'edit'"
            style="width: 150px; height: 150px"
            :src="'/api' + form.coverUrl"
          />
          <div
            v-if="state == 'add' || state == 'edit'"
            class="editor-container"
          >
            <el-upload
              class="upload-demo"
              drag
              action
              multiple
              :http-request="httpRequest"
              :on-success="(res) => (form.coverFileId = res.id)"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="详情顶部图片：" label-width="120px">
          <el-image
            v-if="state == 'see' || state == 'edit'"
            style="width: 150px; height: 150px"
            :src="'/api' + form.backGroundUrl"
          />
          <div
            v-if="state == 'add' || state == 'edit'"
            class="editor-container"
          >
            <el-upload
              class="upload-demo"
              drag
              action
              multiple
              :http-request="httpRequest"
              :on-success="(res) => (form.backgroundFileId = res.id)"
            >
              <i class="el-icon-upload" />
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="详情介绍：" label-width="120px">
          <!-- <tinymce
            v-if="state == 'add' || (state == 'edit' && addStatus)"
            v-model="form.content"
            :height="300"
          /> -->
          <quill-editor v-if="state == 'add' || (state == 'edit' && addStatus)" v-model="form.content" :options="editorOption" />
          <div v-if="state == 'see'" class="txt" v-html="form.content" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button
          v-if="state == 'add' || state == 'edit'"
          type="primary"
          @click="addAscertain"
        >确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import {
  getManagerList,
  deleteCate,
  pageQueryByCityCode,
  insertCate,
  updateCate
} from '@/api/food/index'
import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { getToken } from '@/utils/auth'
import { upfiles } from '@/utils/temporary/temporary'
import Dropzone from '@/components/Upload'
export default {
  name: 'TinymceDemo',
  name: 'DropzoneDemo',
  components: { Dropzone, Tinymce, quillEditor, quillRedefine },
  data() {
    return {
      token: '',
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      keyWord: '',
      startTime: '',
      endTime: '',
      location: '', // 位置下拉选择
      addStatus: false, // 添加弹框
      publishTime: '', // 查询发布时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      activeName: 'first',
      form: {
        name: '',
        fullName: ''
      },
      contentTxt: '',
      options: [],
      commentModerationList: [], // 列表数据
      state: '',
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
    this.getCityCode()
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
    edit(e) {
      this.form = e
      this.state = 'edit'
      this.addStatus = true
    },
    see(e) {
      this.form = e
      this.state = 'see'
      this.addStatus = true
    },
    getCityCode() {
      const param = {
        cityCode: '450200'
      }
      pageQueryByCityCode(param).then((res) => {
        if (res.code == 200) {
          this.options = res.data
        }
      })
    },
    onClick() {
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      const params = {
        page: this.pageNum,
        size: this.pageSize
      }

      if (this.startTime != '' && this.endTime != '') {
        (params.startTime = this.startTime), (params.endTime = this.endTime)
      }
      if (this.keyWord != '') {
        params.keyWord = this.keyWord
      }

      getManagerList(params).then((res) => {
        if (res.code == 200) {
          this.commentModerationList = res.data.rows
          this.total = res.data.total
          this.listLoading = false
        }
      })
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
    // 新增-弹框
    add() {
      this.state = 'add'
      this.form = {}
      this.addStatus = true
    },
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
    // 新增 =>发送请求
    addAscertain() {
      const param = this.form
      if (this.state == 'add') {
        insertCate(param).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.addStatus = false
          }
        })
      } else if (this.state == 'edit') {
        updateCate(param).then((res) => {
          if (res.code == 200) {
            this.getList()
            this.addStatus = false
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      }
    },
    // 删除商品
    remove(cateId) {
      this.$confirm('删除该美食?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: cateId
          }
          deleteCate(params).then((res) => {
            if (res.code === 200) {
              this.$message.success('删除成功')
            }
            this.getList()
          })
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
      (this.keyWord = ''),
      (this.startTime = ''),
      (this.endTime = ''),
      this.getList()
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
.txt >>> img{
  width: 100%;
  margin-top: 10px;
}
</style>
