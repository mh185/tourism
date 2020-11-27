<template>
  <div class="app-container">
    <div class="bg-f border-bottom function">
      <div class="list">
        <span class="list_item active">{{ pageTitle }}</span>
      </div>
      <div class="list">
        <span class="list_item">导入</span>
        <span class="list_item">导出</span>
      </div>
    </div>
    <el-table v-loading="listLoading" class="pl-10 pr-10" :data="list" stripe :row-key="(row)=>row.id">
      <el-table-column prop="name" label="菜单名" />
      <el-table-column width="55">
        <template slot-scope="{row}">
          <el-checkbox v-model="row.isCheck" :disabled="row.level === 0" @change="change(row)" />
        </template>
      </el-table-column>
    </el-table>
    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.size" @pagination="getList" /> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      listLoading: true,
      pageTitle: '权限菜单',
      list: [],
      queryForm: {},
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      routeId: ''
    }
  },
  created() {
    this.routeId = this.$route.params.id
    if (this.routeId) {
      this.getPermissionDetail()
      this.getList()
    }
  },
  methods: {
    async change(row) {
      if (row.level === 0) {
        row.isCheck = !row.isCheck
        // if(flag === false){
        //   if(row.children.some( v => v.isCheck === true )){
        //     this.addPowerMenu(row)
        //   }else {
        //     this.$set(row,'isCheck',false)
        //   }
        // }else if(flag === true && row.children.every( v => v.isCheck === false )){
        //   this.removePowerMenu(row)
        // }
      } else {
        //
        if (row.isCheck) {
          const flag = await this.addPowerMenu(row) // 等待请求返回
          const parent = this.recursion(this.list, row.parentId) // 拿到父级数据
          if (flag === false) {
            // 添加失败  将状态置回未选中
            row.isCheck = false
          }
          if (
            parent.isCheck === false &&
            parent.children.some((v) => v.isCheck === true)
          ) {
            // 如果该条数据的父级未被选中且有选择其中一条数据  则将父级添加
            this.addPowerMenu(parent)
          }
        } else {
          const flag = await this.removePowerMenu(row)
          const parent = this.recursion(this.list, row.parentId)
          if (flag === false) {
            // 删除失败  将状态置回选中
            row.isCheck = true
          }
          if (
            parent.isCheck === true &&
            parent.children.every((v) => v.isCheck === false)
          ) {
            // 如果该条数据的父级已被选中且同级数据都未选择  则将父级删除
            this.removePowerMenu(parent)
          }
        }
      }
    },
    addPowerMenu(row) {
      return new Promise((resolve, reject) => {
        this.axios({
          url: '/power/v1/addPowerMenu',
          port: 'security',
          method: 'post',
          params: { powerId: this.routeId, menuId: row.id }
        })
          .then((res) => {
            resolve(true)
            this.getList()
            this.$message({ type: 'success', message: '添加成功!' })
          })
          .catch((err) => {
            resolve(false)
          })
      })
    },
    removePowerMenu(row) {
      return new Promise((resolve, reject) => {
        this.axios({
          url: '/power/v1/deletePowerMenu',
          port: 'security',
          method: 'post',
          params: { powerId: this.routeId, menuId: row.id }
        })
          .then((res) => {
            resolve(true)
            this.getList()
            this.$message({ type: 'success', message: '移除成功!' })
          })
          .catch((err) => {
            resolve(false)
          })
      })
    },
    recursion(arr, id) {
      return arr.find((v) => {
        if (v.id === id) {
          return v
        } else if (v.children && v.children.length > 0) {
          this.recursion(v.children, id)
        }
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
    setTagsViewTitle(title) {
      const route = Object.assign({}, this.$route, {
        title: title
      })
      this.$store.dispatch('tagsView/updateVisitedView', route)
    },
    getPermissionDetail() {
      this.axios({
        url: 'power/v1/findById',
        method: 'post',
        params: { id: this.routeId }
      }).then((res) => {
        const { data } = res
        this.pageTitle = `${data.name}的菜单`
        this.setTagsViewTitle(this.pageTitle)
        this.roleDetail = res.data
      })
    },
    getList() {
      this.listLoading = true
      this.axios({
        url: '/menu/v1/findAll',
        method: 'post',
        params: { powerId: this.routeId, ...this.listQuery }
      }).then((res) => {
        // const { rows, total } = res.data
        // this.total = total
        // this.list = this.recursionArray(rows)
        this.list = this.recursionArray(res.data)
        this.$nextTick(() => {
          this.listLoading = false
        })
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
.function .list:not(first-of-type) {
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
