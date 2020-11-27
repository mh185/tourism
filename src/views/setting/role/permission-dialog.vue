<template>
  <div>
    <el-dialog :visible.sync="show" :modal="false" :close-on-click-modal="false" class="dialog">
      <div slot="title">绑定权限</div>
      <el-table v-loading="listLoading" :data="list" stripe>
        <el-table-column type="index" label="序号" />
        <el-table-column prop="name" label="权限名" min-width="200" />
        <el-table-column label="操作" fixed="right" align="right" min-width="245">
          <template slot-scope="{row}">
            <el-button type="text" @click="bindItem(row)">绑定</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
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
        size: 10
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
    }
  },
  watch: {
    show(nv, ov) {
      if (nv) {
        this.getList()
      }
    }
  },
  created() {
    if (this.show) {
      this.getList()
    }
  },
  methods: {
    bindItem(row) {
      this.$emit('bind-item', row)
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
</style>
