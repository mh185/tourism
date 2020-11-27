<template>
  <div>
    <el-main>
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
        v-model="title"
        class="queryInput"
        placeholder="搜索关键词"
        clearable
      />
      <el-button
        class="queryBtn"
        type="primary"
        icon="el-icon-search"
        @click="query()"
      >查询</el-button>
      <el-button
        class="queryBtn"
        icon="el-icon-refresh"
        @click="reset()"
      >重置</el-button>
      <el-button
        class="addBtn"
        type="primary"
        @click="add()"
      >添加精选路线</el-button>
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#dcdfe6' }"
        class="table"
        height="480px"
      >
        <el-table-column type="index" label="序号" width="50" />
        <!-- <el-table-column prop="travelAgentsName" label="提供商家" /> -->
        <el-table-column prop="title" label="关联路线" />
        <el-table-column prop="sort" label="排序" />
        <!-- <el-table-column prop="status" label="发布人" /> -->
        <el-table-column prop="createTime" label="发布时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              @click="getDetail(row, 3)"
            >查看</el-button>
            <el-button
              type="text"
              @click="getDetail(row, 2)"
            >编辑</el-button>
            <el-button type="text" @click="remove(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="total"
        :background="false"
        :page.sync="listQuery.page"
        layout="prev, pager, next"
        :limit.sync="listQuery.size"
        @pagination="getList"
      />
    </el-main>
    <save-dialog
      :current-item="currentItem"
      :visible.sync="visible"
      @success="getList()"
    />
    <!-- 弹窗 ->新增 -->
    <el-dialog title="新增精选路线" :visible.sync="addStatus" width="50%">
      <el-form v-if="addStatus" :model="form">
        <el-form-item label="标题：" label-width="120px">
          <el-input v-model="form.title" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input v-model="form.sort" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否置顶：" label-width="120px">
          <el-select v-model="form.isRecommend" placeholder="请选择是否置顶">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.isSpread"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否展示：" label-width="120px">
          <el-select v-model="form.isSpread" placeholder="请选择是否展示">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.isSpread"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="旅行社系统标识：" label-width="120px">
          <el-select v-model="form.name" placeholder="请选择旅行社系统标识">
            <el-option
              v-for="item in optionsTwo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路线系统标识：" label-width="120px">
          <el-select v-model="form.pathName" placeholder="请选择路线系统标识">
            <el-option
              v-for="item in optionsThree"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图" label-width="120px">
          <upload
            v-model="coverFileList"
            :change="coverFileChange"
            vaule-format="string"
            :limit="1"
          />
        </el-form-item>
        <el-form-item label="展示图" label-width="120px">
          <upload
            v-model="bannerFileList"
            :change="bannerFileChange"
            vaule-format="array"
            multiple
          />
        </el-form-item>
        <el-form-item label="内容：" label-width="120px">
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
    <el-dialog title="编辑精选路线" :visible.sync="editStatus" width="50%">
      <el-form v-if="editStatus" :model="form">
        <el-form-item label="标题：" label-width="120px">
          <el-input v-model="form.title" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input v-model="form.sort" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否置顶：" label-width="120px">
          <el-select v-model="form.isRecommend" placeholder="请选择是否置顶">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.isSpread"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否展示：" label-width="120px">
          <el-select v-model="form.isSpread" placeholder="请选择是否展示">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.isSpread"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="旅行社系统标识：" label-width="120px">
          <el-select
            v-model="form.travelAgentsName"
            placeholder="请选择旅行社系统标识"
          >
            <el-option
              v-for="item in optionsTwo"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="路线系统标识：" label-width="120px">
          <el-select
            v-model="form.routesTypeName"
            placeholder="请选择路线系统标识"
          >
            <el-option
              v-for="item in optionsThree"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="封面图：" label-width="120px">
          <upload
            v-model="coverFileList"
            :change="coverFileChange"
            vaule-format="string"
            :limit="1"
          />
        </el-form-item>
        <el-form-item label="展示图" label-width="120px">
          <upload
            v-model="bannerFileList"
            :change="bannerFileChange"
            vaule-format="array"
            multiple
          />
        </el-form-item>
        <el-form-item label="内容：" label-width="120px">
          <quill-editor v-model="form.content" :options="editorOption" />
          <!-- <tinymce v-if="editStatus" v-model="form.content" :height="300" /> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editClear()">取 消</el-button>
        <el-button type="primary" @click="editAscertain">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->查看 -->
    <el-dialog title="查看精选路线" :visible.sync="lookStatus" width="50%">
      <el-form :model="form" label-width="150px">
        <el-form-item label="路线：">{{ form.title }}</el-form-item>
        <el-form-item label="提供商家：">{{
          form.travelAgentsName
        }}</el-form-item>
        <el-form-item label="路线系统标识：">{{
          form.routesTypeName
        }}</el-form-item>
        <el-form-item label="图片：">
          <el-image
            style="width: 50px; height: 50px"
            :src="urlbanner + this.form.fileUrl"
            :preview-src-list="[urlbanner + this.form.fileUrl]"
          />
        </el-form-item>
        <el-form-item label="banner图片：">
          <el-image
            v-for="(item, index) in bannerFileList"
            :key="index"
            style="width: 100px; margin-left: 10px; height: 100px"
            :src="item.url"
            :preview-src-list="[item.url]"
          />
        </el-form-item>
        <el-form-item label="旅行社图片：" label-width="120px">
          <el-image
            style="width: 50px; height: 50px"
            :src="urlbanner + this.form.travelAgentsLogo"
            :preview-src-list="[urlbanner + this.form.travelAgentsLogo]"
          />
        </el-form-item>
        <el-form-item
          label="内容："
          label-width="120px"
        ><div class="ql-editor txt" v-html="form.content" /></el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookStatusClera()">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Upload from '@/components/Upload/image-upload'
import SaveDialog from './save-dialog'
import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { getToken } from '@/utils/auth'
import {
  upfiles,
  insert,
  pageQuery,
  pageQueryTwo,
  deleteId,
  update
} from '@/api/course'
export default {
  name: 'AppletCourseList',
  components: { SaveDialog, Upload, quillEditor, quillRedefine },
  data() {
    return {
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      title: '',
      banners: [],
      coverFileList: [],
      bannerFileList: [],
      coverFileManageId: '',
      addStatus: false, // 新增精选路线
      visible: false,
      editStatus: false, // 编辑弹框
      lookStatus: false, // 查看
      currentItem: {},
      listLoading: true,
      list: [],
      startTime: '',
      endTime: '',
      input: '',
      form: {},
      queryForm: {},
      pageNum: 1,
      pageSize: 100,
      queryFormRules: {
        name: [{ required: true, message: '请输入关键字', trigger: 'blur' }]
      },
      optionsTwo: [],
      optionsThree: [],
      options: [
        {
          isSpread: '是',
          value: 1
        },
        {
          isSpread: '否',
          value: 0
        }
      ],
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
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
    const params = {
      page: this.pageNum,
      size: this.pageSize
    }
    const data = {
      vo: {}
    }
    pageQuery(params, data).then((res) => {
      this.optionsTwo = res.data.rows
    })
    pageQueryTwo(params, data).then((res) => {
      this.optionsThree = res.data.rows
      this.pathName = res.data.rows.name
    })
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
        this.coverFileManageId = id
      } else {
        this.coverFileManageId = ''
      }
    },
    bannerFileChange(file, flieList) {
      if (flieList.length) {
        this.banners = flieList.map((v) => {
          return {
            fileManageId: v.fileManageId
              ? v.fileManageId
              : v.response && v.response.id,
            fileTypeEnum: v.fileTypeEnum
              ? v.fileTypeEnum
              : v.response && v.response.fileSuffix
          }
        })
      } else {
        this.banners = []
      }
    },
    getDetail(row, type) {
      const id = row.id
      row.loading = true
      this.axios({
        url: '/selectedRoutes/v1/findById',
        method: 'post',
        params: { id }
      })
        .then((res) => {
          if (type === 2) {
            this.editStatus = true
          } else if (type === 3) {
            this.lookStatus = true
          }
          this.form = res.data
          this.$set(this.form, 'content', res.data.content)
          this.coverFileList = [
            { name: res.data.fileUrl, url: this.urlbanner + res.data.fileUrl }
          ]
          this.bannerFileList = res.data.banners.map((v) => {
            return {
              name: v.fileManageUrl,
              url: this.urlbanner + v.fileManageUrl,
              fileManageId: v.fileManageId,
              fileTypeEnum: v.fileTypeEnum
            }
          })
          this.banners = res.data.banners.map((v) => {
            return {
              fileManageId: v.fileManageId,
              fileTypeEnum: v.fileTypeEnum
            }
          })
          row.loading = false
        })
        .catch((err) => {
          row.loading = false
        })
    },
    lookStatusClera() {
      this.form = {}
      this.coverFileList = ''
      this.bannerFileList = ''
      this.lookStatus = false
    },
    // 编辑 - 发送请求
    editAscertain() {
      const type = 'aaa'
      const data = {
        id: this.form.id,
        title: this.form.title,
        isSpread: this.form.isSpread,
        sort: this.form.sort,
        travelAgentsId:
          typeof this.form.travelAgentsName == typeof type
            ? this.form.travelAgentsId
            : this.form.travelAgentsName,
        content: this.form.content,
        isRecommend: this.form.isRecommend,
        routesTypeId:
          typeof this.form.routesTypeName == typeof type
            ? this.form.routesTypeId
            : this.form.routesTypeName,
        bannerList: this.banners,
        coverFileManageId: this.coverFileManageId
      }
      update(data).then((res) => {
        this.$message.success('成功')
        this.getList()
      })
      this.form = {}
      this.editStatus = false
    },
    // 编辑 - 取消
    editClear() {
      this.form = {}
      this.coverFileList = ''
      this.bannerFileList = ''
      this.editStatus = false
    },
    // 删除商品
    remove(cateId) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: cateId
          }
          deleteId(params).then((res) => {
            this.pageNum = 1
            this.$message.success('删除成功')
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
    // 添加 - 发送请求
    addAscertain() {
      const data = {
        title: this.form.title,
        isSpread: this.form.isSpread,
        sort: this.form.sort,
        travelAgentsId: this.form.name,
        content: this.form.content,
        isRecommend: this.form.isRecommend,
        routesTypeId: this.form.pathName,
        bannerList: this.banners,
        coverFileManageId: this.coverFileManageId
      }
      insert(data).then((res) => {
        this.getList()
      })
      this.addStatus = false
    },
    // 添加 - 弹框
    add() {
      this.form = {}
      this.coverFileList = []
      this.bannerFileList = []
      this.addStatus = true
    },
    reset() {
      (this.title = ''),
      (this.startTime = ''),
      (this.endTime = ''),
      this.getList()
    },
    query() {
      this.queryForm.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      const data = {
        title: this.title
      }
      this.axios({
        url: '/selectedRoutes/v1/pageQuery',
        method: 'post',
        params: this.listQuery,
        data: data
      }).then((res) => {
        const { total, rows } = res.data
        rows.map((v) => {
          v.loading = false
        })
        this.list = rows
        this.total = total
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-container {
  padding: 0;
  margin-top: 20px;
  display: inline-block;
}
.header {
  padding: 20px 20px 0;
  .el-input {
    width: 160px;
  }
  .el-button--small {
    margin-left: 20px;
  }
}
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
.table {
  margin-top: 15px;
}
.status {
  width: 150px;
  margin-right: 15px;
}
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
