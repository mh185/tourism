<template>
  <el-dialog :visible.sync="show" :modal="false" :close-on-click-modal="false" class="dialog">
        <div slot="title">{{ dialogTitle }}</div>
        <el-form ref="form" class="form" :rules="rules" :model="form" label-suffix="：" label-width="120px">
          <el-form-item label="标题">
            <el-input-number v-model="form.title" :step="1" clearable placeholder="请输入数字，数字越大，顺序越后" />
          </el-form-item>
          <el-form-item label="排序">
            <el-input-number v-model="form.fullName" :step="1" clearable placeholder="请输入数字，数字越大，顺序越后" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button @click="show = false">取消</el-button>
          <el-button type="primary" @click="save('form')">确定</el-button>
        </div>
        </el-dialog>
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
      businessList: [],
      routerList: [],
      formTmp: {},
      form: {},
      rules: {}
    }
  },
  computed: {
    dialogTitle() {
      const currentItem = this.currentItem
      let title = ''
      if (this.handleType === 1) {
        title = '添加精选路线'
      } else if (this.handleType === 2) {
        title = `精选路线 — ${currentItem.username} — 查看`
      }
      return title
    },
    handleType() {
      // 1为新增 2为编辑
      const currentItem = this.currentItem
      return typeof currentItem === 'object' &&
        Object.keys(currentItem).length > 0
        ? 2
        : 1
    },
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
        this.init()
      } else {
        this.reset('form')
      }
    }
  },
  created() {
    if (this.show) {
      this.init()
    }
  },
  methods: {
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    init() {
      const handleType = this.handleType
      if (handleType === 1) {
        this.form = {}
        for (const key in this.formTmp) {
          this.$set(this.form, key, this.formTmp[key])
        }
      } else if (handleType === 2) {
        this.getDetail()
      }
      this.getBusinessList()
      this.getRouterList()
    },
    save(formName) {
      const type = this.handleType
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (type === 1) {
            this.add()
          }
        }
      })
    },
    add() {
      this.axios({
        url: 'selectedRoutes/v1/insert',
        method: 'post',
        data: this.form
      }).then((res) => {
        this.$emit('success', this.form)
        this.$emit('update:visible', false)
        this.$message({ type: 'success', message: '保存成功!' })
      })
    },
    getBusinessList(formName) {
      this.loading = true
      const data = { id: `${this.currentItem.id}` }
      this.axios({
        url: 'travelAgents/v1/pageQuery',
        method: 'post',
        params: data
      }).then((res) => {
        this.businessList = res.data
      })
    },
    getRouterList() {
      this.routerList = res.data
      this.loading = true
      const data = { id: `${this.currentItem.id}` }
      this.axios({
        url: 'travelAgents/v1/pageQuery',
        method: 'post',
        params: data
      }).then((res) => {
        this.routerList = res.data
      })
    },
    getDetail(formName) {
      this.loading = true
      const data = { id: `${this.currentItem.id}` }
      this.axios({
        url: 'selectedRoutes/v1/selectOne',
        method: 'post',
        params: data
      }).then((res) => {
        this.detail = res.data
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .form {
    max-width: 400px;
    margin: auto;
  }
</style>
