<template>
  <div>
    <el-dialog :visible.sync="show" :modal="false" :close-on-click-modal="false" class="dialog">
      <div slot="title">{{ dialogTitle }}</div>
      <el-table ref="table" v-loading="listLoading" :data="list" class="table" highlight-current-row>
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column label="操作" width="90" fixed="right">
          <template slot-scope="{row}">
            <el-checkbox v-model="row.isBind" @change="change(row,this)" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    currentItem: {
      type: Object,
      default() {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      listLoading: true,
      list: [],
      queryForm: {},
      listQuery: {
        page: 1,
        size: 7
      },
      total: 0
    }
  },
  computed: {
    show: {
      get(val) {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    dialogTitle() {
      const name = this.currentItem.name
      const title = '绑定PC角色'
      if (name) {
        return `${name} — ${title}`
      }
      return title
    }
  },
  watch: {
    show(nv) {
      if (nv) {
        this.getList()
      } else {
        this.list = []
      }
    }
  },
  created() {
    if (this.show) {
      this.getList()
    }
  },
  methods: {
    async change(row, val) {
      if (row.isBind) {
        this.addUserRole(row.id)
      } else {
        this.deleteUserRole(row.id)
      }
    },
    addUserRole(id) {
      const data = {
        roleId: id,
        userInfoId: this.currentItem.id
      }
      this.axios({
        url: 'userInfo/v1/addUserRole',
        method: 'post',
        params: data
      }).then((res) => {
        this.$emit('success', '')
        this.$emit('update:visible', false)
        this.$message({ type: 'success', message: '绑定成功!' })
      })
    },
    deleteUserRole(id) {
      const data = {
        roleId: id,
        userInfoId: this.currentItem.id
      }
      this.axios({
        url: 'userInfo/v1/deleteUserRole',
        method: 'post',
        params: data
      }).then((res) => {
        this.$message({ type: 'success', message: '解绑成功!' })
      })
    },
    getList() {
      this.listLoading = true
      this.axios({
        url: '/userInfo/v1/selectBindRole',
        method: 'post',
        params: { userInfoId: this.currentItem.id }
      }).then((res) => {
        const data = res.data
        this.list = data
        this.listLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom_form {
  max-width: 400px;
  margin: auto;
}
</style>
