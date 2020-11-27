<template>
  <el-card>
    <el-date-picker class="time" v-model="addTime" type="datetime" placeholder="核销时间"></el-date-picker>
    <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
    <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary" @click="addPersonnel">新增核销人员</el-button>
    <!-- 表格 -->
    <el-table
      :data="cancelList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="550px"
    >
      <el-table-column type="index" label="序号" width="150"></el-table-column>
      <el-table-column prop="name" label="核销人员姓名" width="180"></el-table-column>
      <el-table-column prop="number" label="手机号" width="180"></el-table-column>
      <el-table-column prop="number" label="创建人" width="180"></el-table-column>
      <el-table-column prop="number" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="removeCancel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      layout="prev, pager, next"
      :total="total"
      :current-page="pageNum"
      hide-on-single-page
    ></el-pagination>
    <!-- 弹窗 ->新增人员 -->
    <el-dialog title="新增核销人员" :visible.sync="addPersonnelStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="核销人员姓名：" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号：" label-width="120px">
          <el-input v-model="form.number" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPersonnelStatus = false">取 消</el-button>
        <el-button type="primary" @click="addPersonnelNotarize">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      addTime: "", //查询核销时间
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      addPersonnelStatus: false, //新增人员弹框
      form: {
        name: "",
        number: "123456",
      },
      //人员表格数据
      cancelList: [
        {
          name: "张三",
          number: "123456",
        },
        {
          name: "李四",
          number: "123456",
        },
        {
          name: "王二",
          number: "123456",
        },
        {
          name: "麻子",
          number: "123456",
        },
      ],
    };
  },
  methods: {
    //重置
    refresh() {
      (this.addTime = ""), (this.input = "");
    },
    //分页
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum; //点击第几页
      console.log(pageNum);
      // this.getUserList();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize; //每页下拉显示数据
      // console.log(pageSize)
    },
    //新增人员 =>弹框
    addPersonnel() {
      this.addPersonnelStatus = true;
    },
    //新增人员
    addPersonnelNotarize() {
      this.addPersonnelStatus = false;
      this.$message.success("添加成功");
    },
    //删除人员
    removeCancel() {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.addBtn {
  float: right;
  margin-right: 15px;
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
</style>