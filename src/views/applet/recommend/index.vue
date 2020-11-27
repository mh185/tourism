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
      v-model="keyWord"
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
    >新增热门推荐</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="List"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column
        prop="scenicSpotName"
        label="关联景区"
      />
      <el-table-column
        prop="sort"
        label="排序"
      />
      <el-table-column
        prop="publisher"
        label="发布人"
      />
      <el-table-column
        prop="publishTime"
        label="发布时间"
      />
      <el-table-column prop="status" label="操作">
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
    <!-- 弹窗 ->新增热门 -->
    <el-dialog title="新增热门推荐" :visible.sync="addStatus" width="50%">
      <el-form ref="ruleForm" :model="form" :rules="rules">
        <el-form-item label="关联景区：" label-width="120px" prop="optionsValue">
          <el-select v-model="form.optionsValue" placeholder="请选择景区">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.scenicSpotName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px" prop="sort">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button type="primary" @click="addAscertain('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑热门 -->
    <el-dialog title="编辑热门推荐" :visible.sync="editStatus" width="50%">
      <el-form ref="ruleForm" :model="form">
        <el-form-item label="关联景区：" label-width="120px">
          <el-select v-model="form.scenicSpotName" placeholder="请选择景区">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.scenicSpotName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editResetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="rditSubmitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { pageQuery, queryHotScenicSpotList, insert, deleteId, updateVO } from '@/api/recommend'
export default {
  data() {
    return {
      addStatus: false, // 新增热门
      editStatus: false, // 编辑热门
      startTime: '', // 查询发布时间
      endTime: '', // 查询结束时间
      keyWord: '',
      total: 100, // 总条数默认给100
      pageSize: 4,
      pageNum: 1, // 当前页数
      activeName: 'first',
      form: {},
      List: [],
      options: [],
      value: '',
      rules: {
          optionsValue: [
            { required: true, message: '请选择关联景区', trigger: 'blur' },
          ],
          sort: [
            { required: true, message: '请输入排序', trigger: 'change' }
          ],
        },
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
  },
  methods: {
    // 编辑取消表单
    editResetForm(form) {
      this.$refs[form].resetFields()
      this.editStatus = false
    },
    // 编辑 - 发送请求
    rditSubmitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          const type = 'aaa'
          const data = {
            scenicSpotId: typeof this.form.scenicSpotName == typeof type ? this.form.scenicSpotId : this.form.scenicSpotName,
            sort: this.form.sort,
            id: this.form.id
          }
          updateVO(data).then(res => {
            if (res.code == 200) {
              this.$message({ message: '添加成功!', type: 'success' })
              this.getList()
            }
          })
          this.editStatus = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 编辑 - 弹框
    edit(content) {
      queryHotScenicSpotList().then(res => {
        this.options = res.data
      })
      this.form = content
      this.editStatus = true
    },
    // 查询
    query() {
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      const quer = {
        page: this.pageNum,
        size: this.pageSize
      }
      const data = {
        startTime: this.startTime,
        endTime: this.endTime,
        keyWord: this.keyWord
      }
      pageQuery(quer, data).then(res => {
        this.List = res.data.rows
        this.total = res.data.total
        this.listLoading = false
      })
    },
    // 新增 - 发送请求
    addAscertain(form) {
      this.$refs[form].validate((valid) => {
      if (valid) {
      const data = {
        scenicSpotId: this.form.optionsValue,
        sort: this.form.sort
      }
      insert(data).then(res => {
        if (res.code == 200) {
          this.$message({ message: '添加成功!', type: 'success' })
          this.getList()
        }
      })
      this.addStatus = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 新增 - 弹框
    add() {
      this.form = {}
      queryHotScenicSpotList().then(res => {
        this.options = res.data
      })
      this.addStatus = true
    },
    // 删除
    remove(idList) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.listLoading = true
          const params = {
            id: idList
          }
          deleteId(params).then(res => {
            this.$message.success(res.message)
            this.pageNum = 1
            this.getList()
            this.listLoading = false
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
.block{
  float: left;
}
</style>
