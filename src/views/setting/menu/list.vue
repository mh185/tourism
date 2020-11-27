<template>
  <div class="app-container">
    <div class="bg-f border-bottom function">
      <div class="list">
        <el-button class="list_item" type="text" @click="synchronizationMenu()">同步本地菜单</el-button>
      </div>
      <div class="list">
        <span class="list_item" @click="openDialog()">新增菜单</span>
      </div>
    </div>
    <div class="pl-10 pr-10 bg-f">
      <el-table v-loading="listLoading" :data="list" stripe row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column prop="name" label="菜单名称" />
        <el-table-column prop="menuIndex" label="排序" />
        <el-table-column label="操作" fixed="right" width="230">
          <template slot-scope="{row}">
            <el-button v-if="row.level < 1" type="text" @click="openDialog(row,row.id)">新增</el-button>
            <el-button type="text" @click="openDialog(row)">编辑</el-button>
            <el-button type="text" @click="deleteItem(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <save-dialog :item-id="itemId" :current-item="currentItem" :visible.sync="visible" @success="success" />
  </div>
</template>

<script>
import SaveDialog from './save-dialog'
import { asyncRoutes } from '@/router'
import { deepClone } from '@/utils'
import { getMenuList } from '@/api/setting'

export default {
  components: {
    SaveDialog
  },
  data() {
    return {
      itemId: '',
      currentItem: {},
      visible: false,
      listLoading: true,
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
    synchronizationMenu() {
      const routes = deepClone(asyncRoutes)
      const menuArr = this.recursionRoutes(routes)
      console.log(menuArr)
      this.axios({
        url: '/menu/v1/insert/list',
        method: 'post',
        data: menuArr
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '同步成功!需要F5刷新页面后才会生效'
        })
        this.listQuery.page = 1
        this.getList()
      })
    },
    recursionRoutes(routes, level = 0) {
      routes.map((route) => {
        const keys = ['name', 'path', 'children', 'type']
        route.path = route.name
        route.name = route.meta && route.meta.title
        route.menuIcon = route.meta && route.meta.icon
        route.type = 0
        route.level = level
        if (route.children && route.children.length > 0) {
          this.recursionRoutes(route.children, level + 1)
        } else {
          route.children = []
        }
        for (const key in route) {
          // 删除无用数据
          if (keys.some((item) => item === key) === false) {
            delete route[key]
          }
        }
      })
      return routes
    },
    openDialog(row, itemId) {
      if (row) {
        if (itemId) {
          this.itemId = itemId
        } else {
          this.itemId = ''
        }
        this.currentItem = row
      } else {
        this.itemId = ''
        this.currentItem = {}
      }
      this.visible = true
    },
    // 删除
    deleteItem(row) {
      const { id, parentId } = row
      const data = { id: id }
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '此操作将删除-'),
          h('i', { style: 'color: teal' }, row.name),
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
              url: '/menu/v1/getById',
              port: 'security',
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
          this.$message({ type: 'success', message: '删除成功!' })
          this.getList()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    recursionArray(arr, level = 0) {
      arr.map((v) => {
        v.level = level
        if (v.children && v.children.length > 0) {
          this.recursionArray(v.children, level + 1)
        } else {
          v.children = []
        }
      })
      return arr
    },
    getList() {
      this.listLoading = true
      getMenuList(this.listQuery, this.queryForm).then((res) => {
        if (res.code == 200) {
          this.list = this.recursionArray(res.data.rows)
          this.total = res.data.total
        }
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
.function .list:nth-of-type(n + 2) {
  color: #555;
}
.function .list_item {
  padding: 0 15px;
  cursor: pointer;
}
.function .list_item.active {
  color: #5a5a5a;
}
</style>
