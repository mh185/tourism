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
      :data="classList"
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
        prop="type"
        label="分类名称"
      />
      <el-table-column
        prop="sort"
        label="排序"
      />
      <el-table-column
        prop="publisher"
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
    <el-dialog title="新增分类" :visible.sync="addStatus" width="50%">
      <el-form v-if="addStatus" ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="分类名称：" label-width="120px" prop="type">
          <el-input
            v-model="form.type"
            clearable
            placeholder="请输入分类名称"
          />
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
    <el-dialog title="编辑分类" :visible.sync="editStatus" width="50%">
      <el-form v-if="editStatus" ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="分类名称：" label-width="120px" prop="type">
          <el-input
            v-model="form.type"
            clearable
          />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px" prop="sort">
          <el-input
            v-model="form.sort"
            clearable
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
import { pageQueryClass, insert, deleteId, update } from '@/api/contactNumber/classify'
export default {
  data() {
    return {
      startTime: '', // 查询发布时间
      endTime: '', // 查询结束时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      addStatus: false, // 新增
      editStatus: false, // 编辑
      classList: [],
      rules: {
        type: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ]
      },
      form: {},
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
    // 编辑 - 发送请求
    editAscertain(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          update(this.form).then(res => {
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
    // 编辑 - 弹框
    edit(content) {
      this.form = content
      this.editStatus = true
    },
    // 查询
    query() {
      this.getList()
    },
    // 获取列表
    getList() {
      const params = {
        page: this.pageNum,
        size: this.pageSize
      }
      const data = {
        keyWord: this.input,
        startTime: this.startTime,
        endTime: this.endTime
      }
      pageQueryClass(params, data).then(res => {
        this.classList = res.data.rows
        this.total = res.data.total
      })
    },
    // 新增 - 发送请求
    addAscertain(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          insert(this.form).then(res => {
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
    // 新增 - 打开弹框
    add() {
      this.form = {}
      this.addStatus = true
    },
    refresh() {
      this.startTime = '',
      this.endTime = '',
      this.input = '',
      this.getList()
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
.status{
  float: left;
}
</style>
