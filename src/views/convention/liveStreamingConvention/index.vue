<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!-- <el-tab-pane label="大会直播" name="commodity">
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
        <el-input v-model="input" class="queryInput" placeholder="搜索关键词" clearable />
        <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="query">查询</el-button>
        <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button class="addBtn" type="primary" @click="addCommodity">新增大会直播</el-button> -->
      <!-- 表格 -->
      <!-- <el-table
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
          <el-table-column prop="title" label="直播名称" />
          <el-table-column prop="meetingUrl" label="直播流地址" :show-overflow-tooltip="true" />
          <el-table-column prop="sort" label="排序" />
          <el-table-column prop="nickNamePc" label="发布人" />
          <el-table-column prop="createTime" label="发布时间" />
          <el-table-column prop="status" label="操作" width="400">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="lookCommodity(scope.row)">查看</el-button>
              <el-button type="success" size="mini" @click="editCommodity(scope.row)">编辑</el-button>
              <el-button type="danger" size="mini" @click="removeCommodity(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table> -->
      <!-- 分页 -->
      <!-- <el-pagination
          class="page"
          :current-page="pageNum"
          :page-sizes="[4, 6, 8, 10]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
      <!-- 弹窗 -> 新增大会直播 -->
      <!-- <el-dialog title="新增大会直播" :visible.sync="addCommodityStatus" width="50%">
          <el-form v-if="addCommodityStatus" ref="ruleForm" :model="form" :rules="rules">
            <el-form-item label="直播名称：" label-width="120px" prop="title">
              <el-input v-model="form.title" clearable placeholder="请输入直播名称" />
            </el-form-item>
            <el-form-item label="会议时间：" label-width="120px">
              <template>
                <el-time-picker
                  v-model="form.startTime"
                  value-format="HH:mm:ss"
                  placeholder="开始时间"
                />
                <el-time-picker
                  v-model="form.endTime"
                  value-format="HH:mm:ss"
                  placeholder="结束时间"
                />
              </template>
            </el-form-item>
            <el-form-item label="会议地点：" label-width="120px" prop="meetingPlace">
              <el-input v-model="form.meetingPlace" clearable placeholder="请输入会议地点" />
            </el-form-item>
            <el-form-item label="直播流地址：" label-width="120px" prop="meetingUrl">
              <el-input v-model="form.meetingUrl" clearable placeholder="请输入直播流地址" />
            </el-form-item>
            <el-form-item label="评论地址：" label-width="120px" prop="commentUrl">
              <el-input v-model="form.commentUrl" clearable placeholder="请输入评论地址" />
            </el-form-item>
            <el-form-item label="会议简介：" label-width="120px" prop="profiles">
              <el-input v-model="form.profiles" clearable placeholder="请输入会议简介" type="textarea" />
            </el-form-item>
            <el-form-item label="封面图片：" label-width="120px">
              <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="cancelAdd('ruleForm')">重 置</el-button>
            <el-button type="primary" @click="addCommodityAscertain('ruleForm')">提 交</el-button>
          </div>
        </el-dialog> -->
      <!-- 弹窗 -> 编辑大会直播 -->
      <!-- <el-dialog title="编辑大会直播" :visible.sync="editCommodityStatus" width="50%">
          <el-form v-if="editCommodityStatus" ref="ruleForm" :model="form" :rules="rules">
            <el-form-item label="直播名称：" label-width="120px" prop="title">
              <el-input v-model="form.title" clearable placeholder="请输入直播名称" />
            </el-form-item>
            <el-form-item label="会议时间：" label-width="120px">
              <template>
                <el-time-picker
                  v-model="form.startTime"
                  value-format="HH:mm:ss"
                  placeholder="开始时间"
                />
                <el-time-picker
                  v-model="form.endTime"
                  value-format="HH:mm:ss"
                  placeholder="结束时间"
                />
              </template>
            </el-form-item>
            <el-form-item label="会议地点：" label-width="120px" prop="meetingPlace">
              <el-input v-model="form.meetingPlace" clearable placeholder="请输入会议地点" />
            </el-form-item>
            <el-form-item label="直播流地址：" label-width="120px" prop="meetingUrl">
              <el-input v-model="form.meetingUrl" clearable placeholder="请输入直播流地址" />
            </el-form-item>
            <el-form-item label="评论地址：" label-width="120px" prop="commentUrl">
              <el-input v-model="form.commentUrl" clearable placeholder="请输入评论地址" />
            </el-form-item>
            <el-form-item label="会议简介：" label-width="120px" prop="profiles">
              <el-input v-model="form.profiles" clearable placeholder="请输入会议简介" type="textarea" />
            </el-form-item>
            <el-form-item label="封面图片：" label-width="120px">
              <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="editCommodityStatus = false">重 置</el-button>
            <el-button type="primary" @click="editCommodityAscertain('ruleForm')">提 交</el-button>
          </div>
        </el-dialog> -->
      <!-- 弹窗 -> 查看大会直播 -->
      <!-- <el-dialog title="查看大会直播" :visible.sync="lookCommodityStatus" width="50%">
          <el-form v-if="lookCommodityStatus" :model="form">
            <el-form-item label="直播名称：" label-width="120px">
              {{ form.title }}
            </el-form-item>
            <el-form-item label="会议时间：" label-width="120px">
              <div>会议开始时间：{{ form.startTime }}</div>
              <div>会议结束时间：{{ form.endTime }}</div>
            </el-form-item>
            <el-form-item label="会议地点：" label-width="120px">
              {{ form.meetingPlace }}
            </el-form-item>
            <el-form-item label="直播流地址：" label-width="120px">
              {{ form.meetingUrl }}
            </el-form-item>
            <el-form-item label="评论地址：" label-width="120px">
              {{ form.commentUrl }}
            </el-form-item>
            <el-form-item label="会议简介：" label-width="120px">
              {{ form.profiles }}
            </el-form-item>
            <el-form-item label="封面图片：" label-width="120px">
              <el-image
                style="width: 150px; height: 150px"
                :src="urlbanner + this.form.coverUrl"
                :preview-src-list="[urlbanner + this.form.coverUrl]"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="lookCommodityStatus = false">关 闭</el-button>
          </div>
        </el-dialog>
      </el-tab-pane> -->
      <!-- <el-tab-pane label="精彩回放" name="classify">
        <playBack />
      </el-tab-pane> -->
      <!-- <el-tab-pane label="图文直播" name="travelType" lazy>
        <imageText />
      </el-tab-pane> -->
      <el-tab-pane label="图片直播" name="pictureText" lazy>
        <pictureText />
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import Dropzone from '@/components/Upload'
import Upload from '@/components/Upload/image-upload'
import { pageQuery, deleteId, insert, update, upfiles, findById } from '@/api/liveStreamingConvention'
import ImageText from './components/imageText'
// import PlayBack from './components/playback'
import PictureText from './components/pictureText'
export default {
  name: 'DropzoneDemo',
  components: { Dropzone, ImageText, Upload, PictureText },
  data() {
    return {
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      ],
      urlbanner: '/api',
      addClassifyStatus: false, // 新增分类
      addCommodityStatus: false, // 新增大会直播
      lookCommodityStatus: false, // 查看大会直播
      editCommodityStatus: false, // 编辑大会直播
      coverFile: [],
      starttime: new Date(),
      endtime: new Date(),
      startTime: '',
      endTime: '',
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      activeName: 'pictureText',
      form: {},
      classifyList: [
        {
          rolesName: '小房间',
          explain: '',
          jurisdiction: '20',
          createTime: '3',
          status: true,
          img: ''
        },
        {
          rolesName: '大房间',
          explain: '',
          jurisdiction: '80',
          createTime: '5',
          status: false
        },
        {
          rolesName: '大房间',
          explain: '',
          jurisdiction: '80',
          createTime: '5',
          status: false
        }
      ],
      commodityList: [],
      rules: {
        title: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        meetingPlace: [
          { required: true, message: '请输入会议地点', trigger: 'blur' }
        ],
        meetingUrl: [
          { required: true, message: '请输入直播流地址', trigger: 'blur' }
        ],
        commentUrl: [
          { required: true, message: '请输入评论地址', trigger: 'blur' }
        ],
        profiles: [
          { required: true, message: '请输入会议简介', trigger: 'blur' }
        ]
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
    // 大会直播查询
    query() {
      this.getList()
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
        type: 'LIVE'
      }
      pageQuery(params).then(res => {
        this.commodityList = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 编辑大会直播 - 发送请求
    editCommodityAscertain(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            id: this.form.id,
            endTime: this.form.endTime,
            meetingPlace: this.form.meetingPlace,
            meetingUrl: this.form.meetingUrl,
            profiles: this.form.profiles,
            startTime: this.form.startTime,
            title: this.form.title,
            commentUrl: this.form.commentUrl,
            coverId: this.form.coverId,
            type: 'LIVE'
          }
          update(data).then(res => {
            this.getList()
            this.$message.success(res.message)
          })
          this.editCommodityStatus = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑大会直播 - 弹框
    editCommodity(content) {
      this.form = content
      this.coverFile = [{ name: content.coverUrl, url: this.urlbanner + content.coverUrl }]
      this.editCommodityStatus = true
    },
    // 查看大会直播
    lookCommodity(content) {
      this.form = content
      this.lookCommodityStatus = true
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
    // 新增分类 -弹框
    addClassify() {
      this.addClassifyStatus = true
    },
    // 新增分类 -发送请求
    addClassifyAscertain() {
      this.addClassifyStatus = false
    },
    // 新增大会直播 -弹框
    addCommodity() {
      this.form = {}
      this.coverFile = []
      this.addCommodityStatus = true
    },
    // 新增大会直播 -发送请求
    addCommodityAscertain(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            endTime: this.form.endTime,
            meetingPlace: this.form.meetingPlace,
            meetingUrl: this.form.meetingUrl,
            profiles: this.form.profiles,
            startTime: this.form.startTime,
            title: this.form.title,
            commentUrl: this.form.commentUrl,
            coverId: this.form.coverId,
            type: 'LIVE'
          }
          insert(data).then(res => {
            this.getList()
          })
          this.addCommodityStatus = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增取消表单
    cancelAdd(form) {
      this.$refs[form].resetFields()
      this.addCommodityStatus = false
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
    // 直播重置按钮
    refresh() {
      this.startTime = '',
      this.endTime = '',
      this.input = '',
      this.getList()
    },
    // 标签页切换执行方法
    handleClick(tab, event) {
      console.log(tab, event)
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
.block {
  float: left;
}
</style>
