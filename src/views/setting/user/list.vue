<template>
  <div>
    <el-main>
      <div class="handle-box">
        <el-button type="primary" @click="toAddItem()">添加用户</el-button>
      </div>
      <el-table v-loading="listLoading" class="table" :data="list" border stripe style="width: 100%" :header-cell-style="{background:'#dcdfe6'}">
        <el-table-column prop="username" label="用户名" width="180" />
        <el-table-column prop="nickName" label="姓名" />
        <el-table-column prop="roles" label="角色" />
        <el-table-column prop="createTime" label="创建时间" />
        <el-table-column prop="status" label="状态" width="150">
          <template slot-scope="{row}">
            <el-switch v-model="row.isEnable" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0" active-text="启用" inactive-text="停用" @change="stateChange(row)" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="320">
          <template slot-scope="{row}">
            <el-button type="text" @click="bindRolePc(row)">绑定角色</el-button>
            <el-button type="success" size="mini" @click="toEditItem(row)">编辑</el-button>
            <el-button type="warning" size="mini" @click="resetPassword(row)">重置密码</el-button>
            <el-button type="text" @click="deleteItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :total="total" :background="false" :page.sync="listQuery.page" layout="prev, pager, next" :limit.sync="listQuery.size" @pagination="getList" />
    </el-main>
    <pc-role-dialog :current-item="currentItem" :visible.sync="pcRoleVisible" @success="getList()" />

  </div>
</template>

<script>
import PcRoleDialog from './pc-role-dialog'

export default {
  name: 'SettingUser',
  components: {
    PcRoleDialog
  },
  data() {
    return {
      pcRoleVisible: false,
      currentItem: {},
      visible: false,
      departmentList: [],
      statusList: [
        { name: '全部', value: '' },
        { name: '启用', value: 1 },
        { name: '停用', value: 0 }
      ],
      isReady: false,
      listLoading: true,
      list: [],
      queryForm: {
        isEnable: '',
        departmentId: '',
        username: '',
        name: '',
        phone: ''
      },
      queryFormRules: {},
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
    bindRolePc(row) {
      this.currentItem = row
      this.pcRoleVisible = true
    },
    stateChange(row) {
      const { id, isEnable } = row
      this.axios({
        url: '/userInfo/v1/isEnable',
        method: 'post',
        params: { id: id, isEnable: isEnable }
      }).then((res) => {
        this.$message({ type: 'success', message: '操作成功!' })
      })
    },
    resetPassword(row) {
      const data = {
        id: row.id
      }
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '此操作将重置用户'),
          h('i', { style: 'color: red' }, row.username),
          h('span', null, '的密码为:123456, 是否继续?')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            this.axios({
              url: '/userInfo/v1/resetPassword',
              method: 'post',
              params: data
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
          this.$message({ type: 'success', message: '重置成功!' })
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    deleteItem(row) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '此操作将删除名称为'),
          h('i', { style: 'color: red' }, row.username),
          h('span', null, '的用户, 是否继续?')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            this.axios({
              url: '/userInfo/v1/getById',
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
          this.listQuery.page = 1
          this.getList()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    toAddItem() {
      this.$router.push({ path: `/setting/user/add` })
    },
    toEditItem(row) {
      this.$router.push({ path: `/setting/user/${row.id}/edit` })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    query(formName) {
      this.listQuery.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.axios({
        url: '/userInfo/v1/pageQuery',
        method: 'post',
        params: this.listQuery,
        data: this.queryForm
      }).then((res) => {
        const { total, rows } = res.data
        rows.map((v) => {
          v.roleName = v.roleList && v.roleList.map((v) => v.name).join(',')
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
.table {
  margin-top: 15px;
}
.status {
  width: 150px;
  margin-right: 15px;
}
.handle-box {
  text-align: right;
}
</style>
