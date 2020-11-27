<template>
  <el-dialog :visible.sync="show" :modal="false" :close-on-click-modal="false" class="dialog">
    <div slot="title">添加攻略类型</div>
    <el-form ref="form" class="form" :rules="rules" :model="form" label-suffix="：" label-width="120px">
      <el-form-item label="分类名称">
        <el-input v-model="form.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="是否启用">
        <el-select v-model="form.isEnable" class="status" clearable placeholder="请选择">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.name" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number v-model="form.sort" :step="1" clearable placeholder="请输入数字，数字越大，顺序越后" />
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
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      statusList: [
        { name: '是', value: 1 },
        { name: '否', value: 0 }
      ],
      form: {
        name: '',
        sort: 0
      },
      rules: {}
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
    save(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.add()
        }
      })
    },
    add() {
      this.axios({
        url: 'travelsType/v1/insert',
        method: 'post',
        data: this.form
      }).then((res) => {
        this.$emit('success', this.form)
        this.$emit('update:visible', false)
        this.$message({ type: 'success', message: '保存成功!' })
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
