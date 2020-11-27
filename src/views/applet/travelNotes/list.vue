<template>
  <div class="content">
    <el-main>
      <el-tabs v-model="activeName">
        <el-tab-pane label="游记攻略" name="travelNotes">
          <travel-notes />
        </el-tab-pane>
        <el-tab-pane label="攻略类型" name="travelType">
          <travel-type />
        </el-tab-pane>
      </el-tabs>
    </el-main>
  </div>
</template>

<script>
import TravelNotes from './components/travelNotes'
import TravelType from './components/travelType'

export default {
  name: 'SettingRole',
  components: { TravelNotes, TravelType },

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
