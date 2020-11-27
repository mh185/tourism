<template>
  <el-card>
    <el-date-picker v-model="startTime" 
    :picker-options="issueStartTime"
     type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间" />
    -
    <el-date-picker v-model="endTime"
    :picker-options="issueEndTime"
     type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" />
    <el-input v-model="keyWord" class="queryInput" placeholder="搜索关键词" clearable />
    <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="query">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary" @click="add">新增美食特产</el-button>
    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="commentModerationList" border stripe style="width: 100%" :header-cell-style="{ background: '#dcdfe6' }" class="table" height="480px">
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="标题" />
      <el-table-column label="人均价格">
        <template slot-scope="scope">
          ￥{{ scope.row.price }}
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="nickNamePc" label="发布人" />
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="see(scope.row)">查看</el-button>
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
    <!-- 弹窗 ->新增美食 -->
    <el-dialog title="新增美食" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="标题：" label-width="120px">
          <el-input v-if="state=='add'||state=='edit'" v-model="form.name" clearable placeholder="请输入" />
          <div v-if="state=='see'">{{form.name}}</div>
        </el-form-item>
        <el-form-item label="位置：" label-width="120px">
          <el-select v-if="state=='add'||state=='edit'" v-model="form.regionAreasId" placeholder="请选择">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          <div v-if="state=='see'">{{form.regionAreasName}}</div>
        </el-form-item>
        <el-form-item label="人均价格：" label-width="120px">
          <el-input v-if="state=='add'||state=='edit'" v-model="form.price" clearable placeholder="请输入价格"><template slot="append">元</template></el-input>
          <div v-if="state=='see'">{{form.price}}<template slot="append">元</template></div>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input v-if="state=='add'||state=='edit'" v-model="form.sort" clearable placeholder="请输入数字，数字越大，顺序越后" />
          <div v-if="state=='see'">{{form.sort}}</div>
        </el-form-item>
        <el-form-item label="封面图片：" label-width="120px">
          <el-image v-if="state=='see'||state=='edit'" style="width: 150px; height: 150px" :src="'/api'+form.coverUrl" />
          <div v-if="state=='add'||state=='edit'" class="editor-container">
            <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (form.coverFileId = res.id)">
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="详情顶部图片：" label-width="120px">
          <el-image v-if="state=='see'||state=='edit'" style="width: 150px; height: 150px" :src="'/api'+form.backGroundUrl" />
          <div v-if="state=='add'||state=='edit'" class="editor-container">
            <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (form.backgroundFileId = res.id)">
              <i class="el-icon-upload" />
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="详情介绍：" label-width="120px">
          <!-- <tinymce v-if="state=='add'||state=='edit'" v-model="form.content" :height="300" /> -->
          <quill-editor v-if="state=='add'||state=='edit'" v-model="form.content" />
          <div v-if="state=='see'" v-html="form.content"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button v-if="state=='add'||state=='edit'" type="primary" @click="addAscertain">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import { quillEditor } from 'vue-quill-editor'
// import vueUeditorWrap from 'vue-ueditor-wrap'
import {
  getManagerList,
  deleteCate,
  pageQueryByCityCode,
  insertCate,
  updateCate
} from '@/api/specialty/index'
import { upfiles } from '@/utils/temporary/temporary'
import Dropzone from '@/components/Upload'
export default {
  name: 'TinymceDemo',
  name: 'DropzoneDemo',
  components: { Dropzone, Tinymce, quillEditor },
  data() {
    return {
      state: '',
      startTime: '',
      endTime: '',
      keyWord: '',
      location: '', // 位置下拉选择
      addStatus: false, // 新增弹框
      publishTime: '', // 查询发布时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      activeName: 'first',
      contentTxt: '',
      form: {
        name: '',
        fullName: ''
      },
      options: [
        {
          value: '城中区',
          label: '城中区'
        },
        {
          value: '柳南区',
          label: '柳南区'
        },
        {
          value: '柳北区',
          label: '柳北区'
        }
      ],
      commentModerationList: [],
      issueStartTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() > this.value2;
          } else {
            return time.getTime() > Date.now();
          }
        },
      },
      issueEndTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() < this.value1;
          }
          return time.getTime() < Date.now();
        },
      },
    }
  },
  created() {
    this.getList()
    this.getCityCode()
  },
  methods: {
    //查询
    query(){
      this.getList()
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
    // 新增 - 弹框
    add() {
      this.form = {}
      this.state = 'add'
      this.addStatus = true
    },
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
    // 删除商品
    remove(cateId) {
      this.$confirm('删除该特产?', '提示', {
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
    // 新增 - 发送请求
    addAscertain() {
      const param = this.form
      if (this.state == 'add') {
        insertCate(param).then((res) => {
          if (res.code == 200) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
            this.getList()
            this.addStatus = false
          }
        })
      } else if (this.state == 'edit') {
        updateCate(param).then(res => {
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
    // 商品重置按钮
    refresh() {
      this.keyWord = "",
      this.startTime = "",
      this.endTime = "",
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
</style>
