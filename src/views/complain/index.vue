<template>
  <el-card>
    <el-date-picker
      v-model="publishTime"
      type="datetime"
      placeholder="发布时间"
    ></el-date-picker>
    <el-input
      class="queryInput"
      placeholder="搜索关键词"
      v-model="input"
      clearable
    ></el-input>
    <el-button class="queryBtn" type="primary" icon="el-icon-search"
      >查询</el-button
    >
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh"
      >重置</el-button
    >
    <!-- 表格 -->
    <el-table
      :data="complainList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" width="100"></el-table-column>
      <el-table-column
        prop="jurisdiction"
        label="投诉人手机号码"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="jurisdiction"
        label="点击时间"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        label="投诉内容"
        width="600"
      ></el-table-column>
      <el-table-column prop="status" label="操作">
        <el-button type="primary" size="mini" @click="add"
          >添加投诉内容</el-button
        >
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
    <!-- 弹窗  -->
    <el-dialog title="新增投诉内容" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="投诉内容：" label-width="120px">
          <el-input
            v-model="form.fullName"
            clearable
            placeholder="请输入"
            type="textarea"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button type="primary" @click="addAscertain">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      addStatus: false, //添加弹框
      publishTime: "", //查询入发布时间
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      activeName: "first",
      form: {
        name: "",
        fullName: "",
      },
      options: [
        {
          value: "全部",
          label: "全部",
        },
        {
          value: "正常",
          label: "正常",
        },
        {
          value: "停用",
          label: "停用",
        },
      ],
      complainList: [
        {
          rolesName: "123456789",
          jurisdiction: "2020/9/22",
          createTime: "3",
          status: true,
          img: "",
        },
        {
          rolesName: "大房间",
          explain: "",
          jurisdiction: "80",
          createTime: "5",
          status: false,
        },
        {
          rolesName: "大房间",
          explain: "",
          jurisdiction: "80",
          createTime: "5",
          status: false,
        },
      ],
    };
  },
  methods: {
    //添加 - 发送请求
    addAscertain() {
      this.addStatus = false;
    },
    //添加 - 弹框
    add() {
      this.addStatus = true;
    },
    //商品重置按钮
    refresh() {
      (this.status = ""),
        (this.input = ""),
        (this.publishTime = ""),
        (this.auditTime = "");
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
    handleClick(tab, event) {
      console.log(tab, event);
    },
  },
};
</script>

<style scoped>
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
}
</style>