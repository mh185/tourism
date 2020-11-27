<template>
  <div>
    <el-main>
      <div class="handle-box"><el-button type="primary" @click="visible = true">添加权限</el-button></div>
      <el-table v-loading="listLoading" class="table" :data="list" border stripe style="width: 100%" :header-cell-style="{background:'#dcdfe6'}">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="权限名" />
        <el-table-column label="操作" width="160" fixed="right">
          <template slot-scope="{row}">
            <el-button type="text" @click="toPermissionMenu(row)">权限菜单</el-button>
            <el-button type="text" @click="deleteItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :background="false" :page.sync="listQuery.page" layout="prev, pager, next" :limit.sync="listQuery.size" @pagination="getList" />
    </el-main>
    <permission-dialog :visible.sync="visible" @bind-item="bindItem" />
  </div>
</template>

<script>
import PermissionDialog from './permission-dialog'

export default {
  name: 'SettingRolePermission',
  components: { PermissionDialog },
  data() {
    return {
      listLoading: true,
      visible: false,
      pageTitle: '角色权限',
      roleDetail: {},
      list: [],
      queryForm: {},
      listQuery: {
        page: 1,
        size: 10
      },
      form: {
        name: '' // 名称
      },
      total: 0
    }
  },
  created() {
    this.routeId = this.$route.params.id
    if (this.routeId) {
      this.getRoleDetail()
      this.getList()
    }
  },
  methods: {
    toPermissionMenu(row) {
      this.$router.push({ path: `/setting/permission/${row.id}/menu` })
    },
    bindItem(row) {
      this.axios({
        url: 'role/v1/addRolePower',
        port: 'security',
        method: 'post',
        params: { roleId: this.routeId, powerId: row.id }
      })
        .then((res) => {
          this.$message({ type: 'success', message: '添加成功!' })
          this.visible = false
          this.getList()
        })
        .catch((error) => {
          this.$message({ type: 'error', message: error.response.data.message })
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
              url: 'role/v1/deleteRolePower',
              port: 'security',
              method: 'post',
              params: { roleId: this.routeId, powerId: row.id }
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
    setTagsViewTitle(title) {
      const route = Object.assign({}, this.$route, {
        title: title
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    getRoleDetail() {
      this.axios({
        url: 'role/v1/findById',
        port: 'security',
        method: 'post',
        params: { id: this.routeId }
      }).then((res) => {
        const { data } = res
        this.pageTitle = `${data.name}的权限`
        this.setTagsViewTitle(this.pageTitle)
        this.roleDetail = res.data
      })
    },
    getList() {
      this.listLoading = true
      this.axios({
        url: 'role/v1/pageQueryPower',
        port: 'security',
        method: 'post',
        params: { roleId: this.routeId, ...this.listQuery },
        data: this.queryForm
      }).then((res) => {
        const { total, rows } = res.data
        this.total = total
        this.list = rows
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
.handle-box {
  text-align: right;
}
</style>
