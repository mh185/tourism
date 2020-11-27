<template>
  <div>
    <el-dialog :visible.sync="show" :modal="false" :close-on-click-modal="false" class="dialog">
      <div slot="title">{{ dialogTitle }}</div>
      <el-form ref="form" class="custom_form" :rules="rules" :model="form" label-width="80px">
        <div>
          <el-form-item label="角色名" prop="name">
            <el-input v-model="form.name" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="备注" prop="describes">
            <el-input v-model="form.describes" type="textarea" rows="5" />
          </el-form-item>
        </div>
        <div>
          <el-form-item label="排序" prop="roleIndex">
            <el-input-number v-model="form.roleIndex" step-strictly />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="save('form')">确定</el-button>
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
      formTmp: {
        name: '',
        describes: '',
        roleIndex: 0
      },
      form: {},
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    dialogTitle() {
      const currentItem = this.currentItem
      let title = ''
      if (this.handleType === 1) {
        title = '添加角色'
      } else if (this.handleType === 2) {
        title = `${currentItem.name} — 编辑`
      }
      return title
    },
    handleType() { // 1为新增 2为编辑
      const currentItem = this.currentItem
      if (typeof currentItem === 'object' && Object.keys(currentItem).length > 0) {
        return 2
      } else {
        return 1
      }
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
      }
    }
  },
  created() {
    if (this.show) {
      this.init()
    }
  },
  methods: {
    init() {
      const handleType = this.handleType
      this.form = {}
      if (handleType === 1) {
        for (const key in this.formTmp) {
          this.$set(this.form, key, this.formTmp[key])
        }
      } else if (handleType === 2) {
        for (const key in this.formTmp) {
          this.$set(this.form, key, this.currentItem[key])
        }
        this.form.id = this.currentItem.id
      }
    },
    save(formName) {
      const type = this.handleType
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (type === 1) {
            this.add()
          } else if (type === 2) {
            this.edit()
          }
        } else {
          return false
        }
      })
    },
    add() {
      this.axios({
        url: 'role/v1/insert',
        port: 'security',
        method: 'post',
        data: this.form
      }).then(res => {
        this.$emit('success', this.form)
        this.$emit('update:visible', false)
        this.$message({ type: 'success', message: '保存成功!' })
      })
    },
    edit() {
      this.axios({
        url: 'role/v1/update',
        port: 'security',
        method: 'post',
        data: this.form
      }).then(res => {
        this.$emit('success', this.form)
        this.$emit('update:visible', false)
        this.$message({ type: 'success', message: '保存成功!' })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.custom_form {
  max-width: 500px;
  margin: auto;
}
</style>
