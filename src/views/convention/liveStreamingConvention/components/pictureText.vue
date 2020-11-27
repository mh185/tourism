<template>
  <el-card>
    <div class="block">
      <el-date-picker
        v-model="startTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布开始时间"
      />
      <el-date-picker
        v-model="endTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布结束时间"
      />
    </div>
    <el-input v-model="keyWord" class="queryInput" placeholder="搜索关键词" clearable />
    <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="query">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary" @click="add">新增图片</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="commodityList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="nickNamePc" label="发布人" />
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column prop="status" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookCommodity(scope.row)">查看</el-button>
          <el-button type="success" size="mini" @click="editCommodity(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="removeCommodity(scope.row.id)">删除</el-button>
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
    <!-- 弹窗 -> 新增大会直播 -->
    <el-dialog title="新增图片直播：" :visible.sync="addStatus" width="50%">
      <el-form v-if="addStatus" :model="form">
        <el-form-item label="名称：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="内容：" label-width="120px">
          <el-input v-model="form.info" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="上传图片：" label-width="120px">
          <upload v-model="bannerFileList" :change="bannerFileChange" multiple vaule-format="array" :limit="20" />
          <span style="font-size:12px">请上传正方形得图片</span>
        </el-form-item>
        <!-- <el-form-item label="内容：" label-width="120px">
          <quill-editor v-model="form.content" :options="editorOption" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">重 置</el-button>
        <el-button type="primary" @click="addAscertain">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 -> 编辑大会直播 -->
    <el-dialog title="编辑图片直播：" :visible.sync="editStatus" width="50%">
      <el-form v-if="editStatus" :model="form">
        <el-form-item label="名称：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="内容：" label-width="120px">
          <el-input v-model="form.info" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="上传图片：" label-width="120px">
          <upload v-model="bannerFileList" :change="bannerFileChange" multiple vaule-format="array" :limit="20" />
          <span style="font-size:12px">请上传正方形得图片</span>
        </el-form-item>
        <!-- <el-form-item label="内容：" label-width="120px">
          <quill-editor v-model="form.content" :options="editorOption" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStatus = false">重 置</el-button>
        <el-button type="primary" @click="editAscertain">提 交</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 -> 查看大会直播 -->
    <el-dialog title="查看图片直播：" :visible.sync="lookStatus" width="50%">
      <el-form v-if="lookStatus" :model="form">
        <el-form-item label="名称：" label-width="120px">
          {{ form.name }}
        </el-form-item>
        <el-form-item label="简介：" label-width="120px">
          {{ form.info }}
        </el-form-item>
        <el-form-item label="图片：" label-width="120px">
          <el-image
            v-for="(item) in bannerFileList"
            :key="item.id"
            style="width: 100px; margin-left: 10px; height: 100px"
            :src="item.url"
            :preview-src-list="[item.url]"
          />
        </el-form-item>
        <!-- <el-form-item label="内容：" label-width="120px">
          <div class="ql-editor txt" v-html="form.content" />
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookStatus = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Upload from '@/components/Upload/image-upload'
import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { getToken } from '@/utils/auth'
import { pageQuery, insert, upfiles, deleteId, update } from '@/api/pictureText'
export default {
  components: { Upload, quillEditor, quillRedefine },
  data() {
    return {
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      bannerFileList: [],
      banners: [],
      addStatus: false, // 新增
      editStatus: false, // 编辑
      lookStatus: false, // 查看
      startTime: '',
      endTime: '',
      keyWord: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      commodityList: [],
      form: {},
      idName: ''
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
    Jump(id) {
      console.log(id)
      this.$router.push({ path: `graphicManagement/${id}` })
    },
    bannerFileChange(file, flieList) {
      console.log(file, flieList)
      if (flieList.length) {
        this.form.banners = flieList.map(v => {
          return v.fileManageId ? v.fileManageId : v.response && v.response.id
        })
      } else {
        this.form.banners = []
      }
    },
    // 查看
    lookCommodity(content) {
      this.lookStatus = true
      this.form = content
      this.bannerFileList = content.pictures.map(v => {
        return {
          name: v.imageTextLiveId,
          url: this.urlbanner + v.url,
          fileManageId: v.fileManageId
        }
      })
    },
    // 编辑 - 发送请求
    editAscertain() {
      const data = {
        pictureList: this.form.banners,
        id: this.form.id,
        name: this.form.name,
        info: this.form.info,
        content: this.form.content
      }
      update(data).then(res => {
        this.$message.success(res.message)
        this.getList()
        this.bannerFileList = []
      })
      this.editStatus = false
    },
    // 编辑 - 弹框
    editCommodity(content) {
      this.form = content
      this.bannerFileList = content.pictures.map(v => {
        return {
          name: v.imageTextLiveId,
          url: this.urlbanner + v.url,
          fileManageId: v.fileManageId
        }
      })
      this.form.banners = content.pictures.map(v => {
        return v.fileManageId
      })
      this.editStatus = true
    },
    // 删除直播
    removeCommodity(idList) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: idList
          }
          deleteId(params).then(res => {
            this.$message.success(res.message)
            this.pageNum = 1
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
    // 获取列表
    getList() {
      this.listLoading = true
      const params = {
        page: this.pageNum,
        size: this.pageSize,
        startTime: this.startTime,
        endTime: this.endTime,
        keyWord: this.keyWord
      }
      pageQuery(params).then(res => {
        this.commodityList = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 新增 - 发送请求
    addAscertain() {
      const data = {
        pictureList: this.form.banners,
        name: this.form.name,
        info: this.form.info,
        content: this.form.content
      }
      insert(data).then(res => {
        if (res.code == 200) {
          this.$message({ type: 'success', message: res.message })
        } else {
          this.$message({ type: 'success', message: res.message })
        }
        this.getList()
        this.form = {}
        this.form.banners = {}
      })
      this.addStatus = false
    },
    add() {
      this.form = {}
      this.bannerFileList = []
      this.addStatus = true
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
    // 重置
    refresh() {
      this.startTime = '',
      this.endTime = '',
      this.keyWord = '',
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
    }
  }
}
</script>

<style>
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
.block {
  float: left;
}
.txt >>> img{
  width: 100%;
  margin-top: 10px;
}
</style>
