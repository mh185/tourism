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
      @clear="clear"
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
      @click="addBanner"
    >添加banner</el-button>
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
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column
        prop="title"
        label="banner名称"
        width="150"
      />
      <el-table-column label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="urlbanner + scope.row.url"
            :preview-src-list="[urlbanner + scope.row.url]"
          />
        </template>
      </el-table-column>
      <el-table-column label="是否跳转">
        <template slot-scope="scope">
          <span v-if="scope.row.isJump == '0'">不跳转</span>
          <span v-if="scope.row.isJump == '1'">跳转内部链接</span>
          <span v-if="scope.row.isJump == '2'">跳转外部链接</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="jumpUrl"
        label="跳转链接"
        width="150"
      />
      <el-table-column prop="isToType" label="跳转类型" />
      <el-table-column prop="isContent" label="关联内容" />
      <el-table-column prop="sort" label="排序" width="150" />
      <el-table-column
        prop="nickNamePc"
        label="发布人"
        width="150"
      />
      <el-table-column
        prop="createTime"
        label="发布时间"
        width="160"
      />
      <el-table-column prop="status" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
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
    <!-- 弹窗 ->新增banner -->
    <el-dialog title="新增banner" :visible.sync="addBannerStatus" width="50%">
      <el-form v-if="addBannerStatus" :model="form">
        <el-form-item label="banner名称：" label-width="120px" prop="title">
          <el-input
            v-model="form.title"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
        </el-form-item>
        <el-form-item label="是否跳转：" label-width="120px">
          <el-radio-group v-model="form.isJump" @change="change">
            <el-radio :label="0">不跳转</el-radio>
            <el-radio :label="1">跳转内部内容</el-radio>
            <el-radio :label="2">跳转外部内容</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.isJump=='1'" label="跳转类型：" label-width="120px">
          <el-select v-model="form.name" clearable placeholder="请选择">
            <el-option
              v-for="item in toSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.isJump=='1'" label="关联内容：" label-width="120px">
          <el-select v-model="toType" clearable placeholder="请选择">
            <el-option
              v-for="item in toSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.isJump=='2'" label="跳转链接：" label-width="120px">
          <el-input
            v-model="form.jumpUrl"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="图片：" label-width="120px">
          <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addBannerAscertain">提 交</el-button>
        <el-button @click="refreshAdd">重 置</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑 -->
    <el-dialog title="编辑banner" :visible.sync="editBannerStatus" width="50%">
      <el-form v-if="editBannerStatus" :model="form">
        <el-form-item label="banner名称：" label-width="120px">
          <el-input
            v-model="form.title"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <!-- <el-form-item label="位置：" label-width="120px">
          <el-select v-model="form.bannerTagEnum" clearable placeholder="请选择">
            <el-option
              v-for="item in typeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="排序：" label-width="120px">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
        </el-form-item>
        <!-- <el-form-item label="跳转链接：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入"></el-input>
        </el-form-item> -->
        <el-form-item label="是否跳转：" label-width="120px">
          <el-radio-group v-model="form.isJump" @change="change">
            <el-radio :label="0">不跳转</el-radio>
            <el-radio :label="1">跳转内部内容</el-radio>
            <el-radio :label="2">跳转外部内容</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.isJump=='1'" label="跳转类型：" label-width="120px">
          <el-select v-model="form.name" clearable placeholder="请选择">
            <el-option
              v-for="item in toSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.isJump=='1'" label="关联内容：" label-width="120px">
          <el-select v-model="toType" clearable placeholder="请选择">
            <el-option
              v-for="item in toSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.isJump=='2'" label="跳转链接：" label-width="120px">
          <el-input
            v-model="form.jumpUrl"
            clearable
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="图片：" label-width="120px">
          <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editBannerAscertain">提 交</el-button>
        <el-button @click="refreshEdit">重 置</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Dropzone from '@/components/Upload'
import Upload from '@/components/Upload/image-upload'
import { pageQuery, deleteId, insert, update, upfiles } from '@/api/bannerApplet'
import user from '@/store/modules/user'
export default {
  name: 'DropzoneDemo',
  components: { Dropzone, Upload },
  data() {
    return {
      urlbanner: '/api',
      commodity: '', // 类型
      startTime: '', // 发布时间
      endTime: '', // 结束时间
      toType: '', // 是否跳转
      fileManageId: '',
      addBannerStatus: false, // 新增banner弹框
      editBannerStatus: false, // 编辑banner弹框
      publishTime: '', // 查询发布时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      value1: '',
      coverFile: [], // 回显图片
      dialogImageUrl: '',
      dialogVisible: false,
      dialogImageUrl: '',
      form: {},
      typeSelect: [
        {
          value: 'HOME',
          label: '首页'
        },
        {
          value: 'SHOP',
          label: '商城'
        },
        {
          value: 'SHOP_RECOMMEND',
          label: '商城推荐'
        },
        {
          value: 'AFFAIRS',
          label: '政务服务'
        }
      ],
      toSelect: [
        {
          value: '观摩点',
          label: '观摩点'
        },
        {
          value: '大会资讯',
          label: '大会资讯'
        },
        {
          value: '在线直播',
          label: '在线直播'
        },
        {
          value: '图文直播',
          label: '图文直播'
        },
        {
          value: '精彩回放',
          label: '精彩回放'
        }
      ],
      form: {
        name: '',
        fullName: ''
      },
      commentModerationList: [], // 列表
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
  },
  methods: {
    coverFileChange(file, flieList) {
      if (flieList.length) {
        const id = flieList[0].response && flieList[0].response.id
        this.fileManageId = id
      } else {
        this.fileManageId = ''
      }
    },
    // 清空查询
    clear() {
      this.getList()
    },
    // 新增得单选项
    change() {
      console.log('点击')
    },
    // 查询
    query() {
      this.getList()
    },
    // 编辑 - 发送请求
    editBannerAscertain() {
      const data = {
        id: this.form.id,
        title: this.form.title,
        sort: this.form.sort,
        isJump: this.form.isJump,
        jumpUrl: this.form.jumpUrl,
        fileManageId: this.fileManageId,
        bannerTagEnum: 'AFFAIRS'
      }
      update(data).then(res => {
        this.getList()
        this.$message.success('修改成功')
      })
      this.form = {}
      this.editBannerStatus = false
    },
    // 编辑 - 弹框
    edit(user) {
      this.coverFile = [{ url: this.urlbanner + user.url }]
      this.editBannerStatus = true
      this.fileManageId = user.fileManageId
      this.form = user
      console.log(user)
    },
    // 重置编辑
    refreshEdit() {
      this.form = {}
      this.editBannerStatus = false
    },
    // 获取列表
    getList() {
      this.listLoading = true
      const params = {
        page: this.pageNum,
        size: this.pageSize,
        keyWord: this.input,
        startTime: this.startTime,
        endTime: this.endTime,
        tag: 'AFFAIRS'
      }
      pageQuery(params).then(res => {
        // console.log(res);
        this.commentModerationList = res.data.rows
        this.total = res.data.total
        this.listLoading = false
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
    // 上传图片
    httpRequest(content) {
      const { file } = content
      const formData = new FormData()
      formData.append('file', file)
      upfiles(formData)
        .then((res) => {
          this.fileManagerId = res.data.id
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
    // 新增banner弹框
    addBanner() {
      this.form = {}
      this.coverFile = []
      this.addBannerStatus = true
    },
    // 新增banner =>发送请求
    addBannerAscertain() {
      const data = {
        id: this.form.id,
        title: this.form.title,
        sort: this.form.sort,
        isJump: this.form.isJump,
        jumpUrl: this.form.jumpUrl,
        fileManageId: this.fileManageId,
        bannerTagEnum: 'AFFAIRS'
      }
      insert(data).then(res => {
        this.$message.success(res.message)
        this.getList()
      })
      this.addBannerStatus = false
      this.form = {}
    },
    // 新增 - 重置按钮
    refreshAdd() {
      this.form = {}
      this.addBannerStatus = false
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
          deleteId(params).then(res => {
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
    // 商品重置按钮
    refresh() {
      (this.input = ''),
      (this.startTime = ''),
      (this.endTime = ''),
      (this.getList())
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
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
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
.block{
  float: left;
}
</style>
