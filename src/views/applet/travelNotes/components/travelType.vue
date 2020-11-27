<template>
  <div>
    <el-select v-model="queryForm.status" class="status" clearable placeholder="请选择">
      <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <el-date-picker v-model="queryForm.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
    <el-input v-model="queryForm.keyword" class="queryInput" placeholder="搜索关键词" clearable />
    <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="reset()">重置</el-button>
    <el-button class="addBtn" type="primary" @click="visible = true">新增攻略类型</el-button>
    <el-table v-loading="listLoading" :data="list" border stripe style="width: 100%" :header-cell-style="{background:'#dcdfe6'}" class="table" height="480px">
      <el-table-column type="index" label="序号"/>
      <el-table-column prop="name" label="分类名称"/>
      <el-table-column prop="sort" label="排序"/>
      <el-table-column prop="createName" label="发布人"/>
      <el-table-column prop="createTime" label="发布时间"/>
      <el-table-column prop="isEnable" width="200" label="状态">
        <template slot-scope="{row}">
          <el-switch v-model="row.isEnable" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="停用" @change="stateChange(row)" />
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :background="false" :page.sync="listQuery.page" layout="prev, pager, next" :limit.sync="listQuery.size" @pagination="getList" />
    <save-dialog :visible.sync="visible" @success="getList()" />

  </div>
</template>

<script>
import SaveDialog from '../save-dialog'

export default {
  components: { SaveDialog },

  data() {
    return {
      visible: false,
      statusList: [],
      listLoading: true,
      list: [],
      queryForm: {},
      queryFormRules: {
        name: [{ required: true, message: '请输入关键字', trigger: 'blur' }]
      },
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    stateChange(row) {
      this.axios({
        url: 'travelsType/v1/update',
        method: 'post',
        data: row
      }).then((res) => {
        this.$message({ type: 'success', message: '操作成功!' })
      })
    },
    deleteItem(row) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '此操作将删除-'),
          h('i', { style: 'color: red' }, row.name),
          h('span', null, ', 是否继续?')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            this.axios({
              url: 'travelsType/v1/delete',
              method: 'post',
              params: { id: row.id }
            })
              .then((res) => {
                done()
                instance.confirmButtonLoading = false
              })
              .catch(() => {
                instance.confirmButtonText = '确定'
                instance.confirmButtonLoading = false
              })
          } else {
            done()
          }
        }
      })
        .then((action) => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.getList()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
      this.getList()
    },
    query(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.queryForm.page = 1
          this.getList()
        } else {
          return false
        }
      })
    },
    getList() {
      this.listLoading = true
      this.axios({
        url: 'travelsType/v1/pageQuery',
        method: 'post',
        params: this.listQuery,
        data: this.queryForm
      }).then((res) => {
        const { total, rows } = res.data
        this.list = rows
        this.total = total
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
}
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
</style>
