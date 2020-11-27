<template>
  <div class="content">
    <el-main>
      <el-tabs v-model="activeName">
        <el-tab-pane label="联系电话" name="travelNotes">
          <number />
        </el-tab-pane>
        <el-tab-pane label="分类" name="travelType">
          <classify />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import Number from './components/number'
import Classify from './components/classify'

export default {
  name: 'SettingRole',
  components: { Number, Classify },

  data() {
    return {
      activeName: 'travelNotes'
    }
  },
  created() {
    // this.getList()
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.content {
  background-color: #fff;
}
.pagination-container {
  padding: 0;
  margin-top: 20px;
  display: inline-block;
}
.header {
  padding: 20px 20px 0;
  .el-input {
    width: 160px;
  }
  .el-button--small {
    margin-left: 20px;
  }
}
.table {
  margin-top: 15px;
}
.queryBtn {
  margin-left: 15px;
}
.queryInput {
  width: 200px;
  margin-left: 15px;
}
.addBtn {
  float: right;
  margin-right: 50px;
}
.table {
  margin-top: 15px;
}
.status {
  width: 150px;
  margin-right: 15px;
}
</style>
