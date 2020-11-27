<template>
  <el-card>
    <el-date-picker v-model="publishTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
    <el-input v-model="input" class="queryInput" placeholder="搜索关键词" clearable />
    <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary" @click="add">新增游记攻略</el-button>
    <!-- 表格 -->
    <el-table :data="commentModerationList" border stripe style="width: 100%" :header-cell-style="{background:'#dcdfe6'}" class="table" height="480px">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="jurisdiction" label="攻略名称" width="200" />
      <el-table-column prop="jurisdiction" label="旅游路线" width="200" />
      <el-table-column prop="status" label="排序" width="200" />
      <el-table-column prop="status" label="发布人" width="200" />
      <el-table-column prop="status" label="发布时间" width="200" />
      <el-table-column prop="status" label="操作">
        <el-button type="primary" size="mini">查看</el-button>
        <el-button type="success" size="mini" @click="edit">编辑</el-button>
        <el-button type="danger" size="mini" @click="remove()">删除</el-button>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination :page-size="pageSize" layout="prev, pager, next" :total="total" :current-page="pageNum" hide-on-single-page @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    <!-- 弹窗 ->新增游记攻略 -->
    <el-dialog title="新增游记攻略" :visible.sync="addStatus" width="50%" />
    <!-- 弹窗 ->编辑游记攻略 -->
    <el-dialog title="新增游记攻略" :visible.sync="editStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="攻略名称：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="旅游路线：" label-width="120px">
          <el-input v-model="form.fullName" style="width:200px" clearable placeholder="起点" />
          <span style="margin:0 10px">到</span>
          <el-input v-model="form.fullName" style="width:200px" clearable placeholder="终点" />
        </el-form-item>
        <el-form-item label="出行天数：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="交通工具：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入交通工具" />
        </el-form-item>
        <el-form-item label="出发时间：" label-width="120px">
          <el-date-picker v-model="departTime" type="date" placeholder="请选择出发时间" />
        </el-form-item>
        <el-form-item label="出行景区：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请选择景区" />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入数字，数字越大，顺序越后" />
        </el-form-item>
        <el-form-item label="出行景区配图：" label-width="120px">
          <div class="editor-container">
            <dropzone id="myVueDropzoneEdit" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
        </el-form-item>
        <el-form-item label="封面图片：" label-width="120px">
          <div class="editor-container">
            <dropzone id="myVueDropzoneTwoEdit" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
        </el-form-item>
        <el-form-item label="展示图片：" label-width="120px">
          <div class="editor-container">
            <dropzone id="myVueDropzoneThreeEdit" url="https://httpbin.org/post" @dropzone-removedFile="dropzoneR" @dropzone-success="dropzoneS" />
          </div>
        </el-form-item>
        <el-form-item label="详情介绍：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStatus = false">取 消</el-button>
        <el-button type="primary" @click="editAscertain">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Dropzone from '@/components/Upload'
export default {
  name: 'DropzoneDemo',
  components: { Dropzone },
  data() {
    return {
      departTime: '', // 出发时间
      addStatus: false, // 新增弹框
      editStatus: false, // 编辑弹框
      publishTime: '', // 查询发布时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 1,
      pageNum: 1, // 当前页数
      activeName: 'first',
      form: {
        name: '',
        fullName: ''
      },
      commentModerationList: [
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
      ]
    }
  },
  methods: {
    // /travels/v1/pageQuery

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
    // 编辑 =>弹出框
    edit() {
      this.editStatus = true
    },
    // 编辑 =>发送请求
    editAscertain() {
      this.editAscertain = false
    },
    // 新增游记攻略 =>弹出框
    add() {
      this.addStatus = true
    },
    // 新增游记攻略 =>发送请求
    addAscertain() {
      this.addStatus = false
    },
    // 删除商品
    remove() {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
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
      this.pageNum = pageNum // 点击第几页
      console.log(pageNum)
      // this.getUserList();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize // 每页下拉显示数据
      // console.log(pageSize)
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
