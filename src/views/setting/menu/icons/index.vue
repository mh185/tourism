<template>
  <el-dialog :close-on-click-modal="false" title="图标选择" class="dialog" width="80%" :visible.sync="show" append-to-body>
    <div class="icons-container">
      <el-tabs type="border-card">
        <el-tab-pane label="Element-UI Icons">
          <div class="grid">
            <div v-for="item of elementIcons" :key="item" @click="handleIcon('icon',`el-icon-${item}`)">
              <el-tooltip placement="top">
                <div slot="content">
                  {{ generateElementIconCode(item) }}
                </div>
                <div class="icon-item">
                  <i :class="'el-icon-' + item" />
                  <span>{{ item }}</span>
                </div>
              </el-tooltip>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script>
import svgIcons from './svg-icons'
import elementIcons from './element-icons'

export default {
  name: 'Icons',
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      svgIcons,
      elementIcons
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
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    generateElementIconCode(symbol) {
      return `<i class="el-icon-${symbol}" />`
    },
    handleIcon(type, text) {
      this.$emit('clickItem', { type: type, value: text })
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog >>> .el-dialog__header{
  border-bottom: 1px solid #E9E9E9;
}
.icons-container {
  margin: 10px 20px 0;
  overflow: hidden;

  .grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .icon-item {
    margin: 20px;
    height: 85px;
    text-align: center;
    width: 100px;
    float: left;
    font-size: 30px;
    color: #24292e;
    cursor: pointer;
  }

  span {
    display: block;
    font-size: 16px;
    margin-top: 10px;
  }

  .disabled {
    pointer-events: none;
  }
}
</style>
