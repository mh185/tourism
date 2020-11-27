<template>
  <div>
    <el-dialog :visible.sync="show" :close-on-click-modal="false" class="dialog">
      <div slot="title">{{ dialogTitle }}</div>
      <el-form ref="form" class="custom_form" :model="form" label-width="140px">
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="菜单描述" prop="describes">
          <el-input v-model="form.describes" />
        </el-form-item>
        <el-form-item label="页面地址" prop="path">
          <el-input v-model="form.path" placeholder="为页面name字段，且具有唯一性" />
        </el-form-item>
        <el-form-item v-if="handleType === 1" label="Api地址" prop="menuUrl">
          <el-input v-model="form.menuUrl" placeholder="为后台请求接口地址" />
        </el-form-item>
        <el-form-item label="排序" prop="menuIndex">
          <el-input-number v-model="form.menuIndex" :controls="false" step-strictly />
        </el-form-item>
        <el-form-item label="图标" prop="menuIcon">
          <div v-if="form.menuIcon" class="icon_item" @click="innerVisible = true">
            <svg-icon v-if="iconObj.type == 'svg'" :icon-class="form.menuIcon" class-name="disabled" />
            <i v-else :class="form.menuIcon" />
            <span>{{ form.menuIcon }}</span>
          </div>
          <el-button v-else @click="innerVisible = true">选择图标</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="show = false">取消</el-button>
        <el-button type="primary" @click="save('form')">确定</el-button>
      </div>
    </el-dialog>
    <icon-dialog :visible.sync="innerVisible" @clickItem="clickItem" />
  </div>
</template>

<script>
import IconDialog from './icons'

export default {
  components: { IconDialog },
  props: {
    // 如果currentItem有值且itemId无值证明则为编辑,如果itemId有值则为新增子级,均无值则为新增顶级
    itemId: {
      type: [String, Number],
      default: ''
    },
    currentItem: {
      type: Object,
      default() {
        return {}
      }
    },
    visible: {
      type: Boolean
    }
  },
  data() {
    return {
      innerVisible: false,
      iconObj: {},
      formTmp: {
        menuIndex: '', // 排序
        type: '', // 0为菜单 1为功能 - 2为按钮
        name: '', // 菜单名称
        describes: '', // 菜单描述
        path: '', // 对应router的name
        menuIcon: '', // 菜单图标
        menuUrl: '' // api请求地址
      },
      form: {},
      title: ''
    }
  },
  computed: {
    dialogTitle() {
      const handleType = this.handleType
      const { name } = this.currentItem
      let title = '添加'
      if (handleType === 1) {
        title = '添加顶级菜单'
      } else if (handleType === 2) {
        title = `${name} — 添加子菜单`
      } else if (handleType === 3) {
        title = `${name} — 编辑`
      }
      return `${title}`
    },
    handleType() { // 1为新增子级 2为编辑 3为新增顶级
      const currentItem = this.currentItem
      const itemId = this.itemId
      if (typeof currentItem === 'object' && Object.keys(currentItem).length > 0) {
        if (itemId) { // 新增子级
          return 2
        } else { // 编辑
          return 3
        }
      } else { // 新增顶级
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
    clickItem(item) {
      this.iconObj = item
      this.form.menuIcon = item.value
      this.innerVisible = false
    },
    init() {
      this.form = {}
      // console.log("初始化", this.form, this.currentItem);
      const handleType = this.handleType
      if (handleType === 1) {
        // this.form.type = 0
        this.form.menuIndex = 0
      } else if (handleType === 2) { // 添加子级
        // this.form.type = this.currentItem.type + 1
        this.form.menuIndex = 0
        this.form.parentId = this.itemId
      } else if (handleType === 3) { // 编辑
        for (const key in this.formTmp) {
          this.$set(this.form, key, this.currentItem[key])
        }
        this.form.id = this.currentItem.id
      }
    },
    save() {
      const handleType = this.handleType
      if (handleType === 3) {
        this.edit()
      } else {
        this.add()
      }
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    add(form) {
      this.axios({
        url: '/menu/v1/insert',
        port: 'security',
        method: 'post',
        data: this.form
      }).then(res => {
        this.$emit('success', this.form, this.currentItem)
        this.$emit('update:visible', false)
      })
    },
    edit(form) {
      this.axios({
        url: '/menu/v1/update',
        port: 'security',
        method: 'post',
        data: this.form
      }).then(res => {
        this.$emit('success', this.form, this.currentItem)
        this.$emit('update:visible', false)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.select-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.icon_item {
  height: 85px;
  text-align: center;
  width: 100px;
  font-size: 30px;
  float: left;
  color: #24292e;
  cursor: pointer;
  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }
}
.custom_form >>> .el-input__inner{
  text-align: left;
}

</style>
