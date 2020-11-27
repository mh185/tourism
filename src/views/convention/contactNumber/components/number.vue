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
      @click="query()"
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
    >新增电话</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="numberList"
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
        prop="contactName"
        label="名称"
      />
      <el-table-column
        prop="contactTel"
        label="电话"
      />
      <el-table-column
        prop="typeName"
        label="分类"
      />
      <el-table-column
        prop="sort"
        label="排序"
      />
      <el-table-column
        prop="userName"
        label="发布人"
      />
      <el-table-column prop="publishTime" label="发布时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
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
    <el-dialog title="新增联系电话" :visible.sync="addStatus" width="50%">
      <el-form v-if="addStatus" ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="名称：" label-width="120px" prop="contactName">
          <el-input
            v-model="form.contactName"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="联系电话：" label-width="120px" prop="contactTel">
          <el-input
            v-model="form.contactTel"
            clearable
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item label="分类：" label-width="120px" prop="contactTypeId">
          <el-select v-model="form.typeName" placeholder="请选择分类">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.type"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px" prop="sort">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入排序"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="addAscertain('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑 -->
    <el-dialog title="编辑联系电话" :visible.sync="editStatus" width="50%">
      <el-form v-if="editStatus" ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="名称：" label-width="120px" prop="contactName">
          <el-input
            v-model="form.contactName"
            clearable
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="联系电话：" label-width="120px" prop="contactTel">
          <el-input
            v-model="form.contactTel"
            clearable
            placeholder="请输入联系电话"
          />
        </el-form-item>
        <el-form-item label="分类：" label-width="120px" prop="contactTypeId">
          <el-select v-model="form.typeName" placeholder="请选择分类">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.type"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px" prop="sort">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入排序"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="editAscertain('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { pageQuery, update, insert, deleteId, queryAll } from '@/api/contactNumber/number'
export default {
  data() {
    return {
      editStatus: false, // 编辑弹框
      addStatus: false, // 新增
      startTime: '', // 查询发布时间
      endTime: '', // 查询结束时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      options: [],
      form: {},
      numberList: [],
      rules: {
        contactName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        contactTel: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
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
    // 查询
    query() {
      this.getList()
    },
    // 商品重置按钮
    refresh() {
      this.startTime = '',
      this.endTime = '',
      this.input = '',
      this.getList()
    },
    // 新增 - 弹框
    add() {
      this.form = {}
      queryAll().then(res => {
        this.options = res.data
      })
      this.form = {}
      this.addStatus = true
    },
    // 新增 - 发送请求
    addAscertain(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const data = {
            miniAppType: 'CULTURAL_TOURISM',
            contactName: this.form.contactName,
            contactTel: this.form.contactTel,
            sort: this.form.sort,
            contactTypeId: this.form.typeName
          }
          insert(data).then(res => {
            if (res.code == 200) {
              this.$message.success(res.message)
            }
            this.getList()
          })
          this.addStatus = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增取消表单
    cancelAdd(form) {
      this.$refs[form].resetFields()
      this.addStatus = false
    },
    // 编辑 - 发送请求
    editAscertain(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const type = 'aaa'
          const data = {
            miniAppType: 'CULTURAL_TOURISM',
            contactName: this.form.contactName,
            contactTel: this.form.contactTel,
            sort: this.form.sort,
            contactTypeId: typeof this.form.typeName == typeof type ? '' : this.form.typeName,
            id: this.form.id
          }
          update(data).then(res => {
            this.$message.success(res.message)
            this.getList()
          })
          this.editStatus = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑 - 取消
    cancelEdit(form) {
      this.$refs[form].resetFields()
      this.editStatus = false
    },
    // 编辑弹框
    edit(user) {
      queryAll().then(res => {
        this.options = res.data
      })
      this.form = user
      this.editStatus = true
    },
    // 获取数据
    getList() {
      this.listLoading = true
      const params = {
        page: this.pageNum,
        size: this.pageSize,
        type: 'CULTURAL_TOURISM',
        startTime: this.startTime,
        endTime: this.endTime,
        keyWord: this.input
      }
      pageQuery(params).then(res => {
        this.numberList = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
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
          deleteId(params).then(res => {
            this.pageNum = 1
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
.block{
  float: left;
}
</style>
