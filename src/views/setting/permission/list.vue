<template>
  <div class="app-container">
    <div class="bg-f border-bottom function">
      <div class="list">
        <span class="list_item active">权限管理</span>
      </div>
      <div class="list">
        <span class="list_item" @click="openSave()">添加权限</span>
      </div>
    </div>
    <div class="pl-10 pr-10 bg-f">
      <el-table v-loading="listLoading" :data="list" stripe>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="权限名" min-width="200">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.name" class="edit-input" />
            </template>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="180" />
        <el-table-column label="操作" fixed="right" align="right" min-width="245">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-button
                :loading="row.loading"
                type="success"
                size="mini"
                @click="confirmEdit(row)"
              >Ok</el-button>
              <el-button
                size="mini"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >取消</el-button>
            </template>
            <el-button v-else type="text" @click="editItem(row)">编辑</el-button>
            <!-- <el-button v-if="row.edit" :loading="row.loading" type="success" @click="confirmEdit(row)">Ok</el-button> -->
            <!-- <el-button v-else  type="text"  @click="row.edit=!row.edit">编辑</el-button> -->
            <el-button type="text" @click="toMenu(row)">查看</el-button>
            <el-button type="text" @click="deleteItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
    <save-dialog :current-item="currentItem" :visible.sync="visible" @success="success" />
  </div>
</template>

<script>
import SaveDialog from './save-dialog'

export default {
  name: 'SettingPermission',
  components: { SaveDialog },
  data() {
    return {
      listLoading: true,
      visible: false,
      currentItem: {},
      list: [],
      queryForm: {},
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
              url: '/power/v1/getById',
              port: 'security',
              method: 'post',
              params: { id: row.id }
            }).then(res => {
              done()
              instance.confirmButtonLoading = false
            })
          } else {
            done()
          }
        }
      })
        .then(action => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.getList()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    editItem(row) {
      this.$set(row, 'edit', true)
      this.$set(row, 'loading', false)
      this.$set(row, 'originalName', row.name)
      this.$set(row, 'originalDepartmentIndex', row.departmentIndex)
    },
    cancelEdit(row) {
      row.name = row.originalName
      row.edit = false
      this.$message({
        message: '已恢复原值',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.loading = true
      this.axios({
        url: '/power/v1/update',
        port: 'security',
        method: 'post',
        data: { name: row.name, id: row.id }
      }).then(res => {
        row.edit = false
        row.loading = false
        row.originalName = row.name
        this.$message({ type: 'success', message: '修改成功!' })
      })
    },
    // 查看权限列表
    toMenu(row) {
      this.$router.push({ path: `/setting/permission/${row.id}/menu` })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    getList() {
      this.listLoading = true
      this.axios({
        url: '/power/v1/pageQuery',
        port: 'security',
        method: 'post',
        params: this.listQuery,
        data: this.queryForm
      }).then(res => {
        this.total = res.data.total
        this.list = res.data.rows
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.function {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 60px;
  align-items: center;
  font-size: 12px;
}
.function .list:first-of-type {
  color: #adadad;
}
.function .list:nth-of-type(n+2) {
  color: #555;
}
.function .list_item {
  padding: 0 15px;
  cursor: pointer;
}
.function .list_item.active {
  color: #5a5a5a;
}

.edit-input {
  max-width: 200px;
}
</style>
