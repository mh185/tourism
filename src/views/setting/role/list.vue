<template>
  <div>
    <el-main>
      <el-select v-model="queryForm.status" class="status" clearable placeholder="请选择">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker v-model="queryForm.date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-input v-model="queryForm.value" class="queryInput" placeholder="搜索关键词" clearable />
      <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
      <el-button class="queryBtn" icon="el-icon-refresh" @click="reset()">重置</el-button>
      <el-button class="addBtn" type="primary" @click="openSave()">添加角色</el-button>
      <el-table v-loading="listLoading" class="table" :data="list" border stripe style="width: 100%" :header-cell-style="{background:'#dcdfe6'}">
        <el-table-column prop="name" label="角色名" width="180" />
        <el-table-column prop="describes" label="简介" width="180" />
        <el-table-column prop="jurisdiction" label="权限" />
        <el-table-column prop="createTime" label="创建时间" align="center" />
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="{row}">
            <el-switch v-model="row.isEnable" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="停用" @change="stateChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" @click="openSave(row)">编辑</el-button>
            <el-button type="text" @click="toPermission(row)">角色权限</el-button>
            <el-button type="text" @click="deleteItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :background="false" :page.sync="listQuery.page" layout="prev, pager, next" :limit.sync="listQuery.size" @pagination="getList" />
    </el-main>
    <save-dialog :current-item="currentItem" :visible.sync="visible" @success="success" />
  </div>
</template>

<script>
import SaveDialog from './save-dialog'
import { getRoleList } from '@/api/setting'

export default {
  name: 'SettingRole',
  components: {
    SaveDialog
  },
  data() {
    return {
      statusList: [],
      visible: false,
      currentItem: {},
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
    success() {
      this.getList()
    },
    openSave(row) {
      if (row) {
        this.currentItem = row
      } else {
        this.currentItem = {}
      }
      this.visible = true
    },
    stateChange(row) {
      this.axios({
        url: '/role/v1/update',
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
              url: 'role/v1/getById',
              port: 'security',
              method: 'post',
              params: { id: row.id }
            }).then((res) => {
              done()
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
    toPermission(row) {
      this.$router.push({ path: `/setting/role/${row.id}/permission` })
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
      getRoleList(this.listQuery, this.queryForm).then((res) => {
        if (res.code == 200) {
          this.total = res.data.total
          this.list = res.data.rows
        }
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
</style>
