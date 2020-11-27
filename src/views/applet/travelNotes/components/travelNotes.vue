<template>
  <div>
    <el-date-picker
      v-model="startTime"
      type="datetime"
      :picker-options="issueStartTime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择开始时间"
    />
    -
    <el-date-picker
      v-model="endTime"
      type="datetime"
      :picker-options="issueEndTime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择结束时间"
    />
    <!-- <el-date-picker
      v-model="travelTime"
      type="datetimerange"
      value-format="yyyy-MM-dd HH:mm:ss"
      range-separator="-"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker> -->
    <el-input v-model="keyWord" class="queryInput" placeholder="搜索关键词" clearable />
    <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="query()">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="reset()">重置</el-button>
    <el-button class="addBtn" type="primary" @click="toAddItem()">新增游记攻略</el-button>
    <el-table v-loading="listLoading" :data="list" border stripe style="width: 100%" :header-cell-style="{background:'#dcdfe6'}" class="table" height="480px">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column prop="title" label="攻略名称" />
      <el-table-column prop="routes" label="旅游路线" />
      <el-table-column prop="sort" label="排序" />
      <!-- <el-table-column prop="createName" label="发布人" /> -->
      <el-table-column prop="createTime" label="发布时间" />
      <el-table-column label="操作" fixed="right">
        <template slot-scope="{row}">
          <el-button type="text" @click="toItem(row)">查看</el-button>
          <el-button type="text" @click="toEditItem(row)">编辑</el-button>
          <el-button type="text" @click="deleteItem(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :total="total" :background="false" :page.sync="listQuery.page" layout="prev, pager, next" :limit.sync="listQuery.size" @pagination="getList" />

  </div>
</template>

<script>

export default {
  data() {
    return {
      startTime: '',
      endTime: '',
      keyWord: '',
      travelTime: '',
      listLoading: true,
      list: [],
      queryForm: {},
      queryFormRules: {
        name: [{ required: true, message: '请输入关键字', trigger: 'blur' }]
      },
      listQuery: {
        page: 1,
        size: 4
      },
      total: 0,
      issueStartTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() > this.value2
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      issueEndTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() < this.value1
          }
          return time.getTime() < Date.now()
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    toItem(row) {
      this.$router.push({ path: `/applet/travelNotes/${row.id}` })
    },
    toAddItem() {
      this.$router.push({ path: `/applet/travelNotes/add` })
    },
    toEditItem(row) {
      this.$router.push({ path: `/applet/travelNotes/${row.id}/edit` })
    },
    deleteItem(row) {
      const h = this.$createElement
      this.$msgbox({
        title: '提示',
        message: h('p', null, [
          h('span', null, '此操作将删除-'),
          h('i', { style: 'color: red' }, row.name),
          h('span', null, ', 是否继续?')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '执行中...'
            this.axios({
              url: 'travels/v1/delete',
              method: 'post',
              params: { id: row.id }
            })
              .then((res) => {
                done()
                instance.confirmButtonLoading = false
              })
              .catch(() => {
                instance.confirmButtonText = '确定'
                instance.confirmButtonLoading = false
              })
          } else {
            done()
          }
        }
      })
        .then((action) => {
          this.$message({ type: 'success', message: '删除成功!' })
          this.getList()
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消' })
        })
    },
    reset(formName) {
      this.startTime = '',
      this.endTime = '',
      this.keyWord = '',
      this.getList()
    },
    query() {
      this.queryForm.page = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      const data = {
        title: this.keyWord,
        travelTime: this.travelTime
      }
      this.axios({
        url: 'travels/v1/pageQuery',
        method: 'post',
        params: this.listQuery,
        data: data
      }).then((res) => {
        const { total, rows } = res.data
        this.list = rows
        this.total = total
        this.listLoading = false
      })
    }
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
