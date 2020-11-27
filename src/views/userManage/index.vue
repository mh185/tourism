<template>
  <el-card>
    <!-- 状态选择器 -->
    <el-select clearable v-model="status" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-date-picker
      class="time"
      v-model="publishTime"
      type="datetime"
      placeholder="注册时间"
    ></el-date-picker>
    <el-date-picker
      class="time"
      v-model="auditTime"
      type="datetime"
      placeholder="最后登录时间"
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
      :data="commentModerationList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column
        prop="jurisdiction"
        label="用户昵称"
        width="180"
      ></el-table-column>
      <el-table-column prop="jurisdiction" label="性别"></el-table-column>
      <el-table-column prop="createTime" label="电话"></el-table-column>
      <el-table-column
        prop="status"
        label="注册时间"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="status"
        label="最后登录时间"
        width="150"
      ></el-table-column>
      <el-table-column label="状态" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="启用"
            inactive-text="停用"
          ></el-switch>
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
  </el-card>
</template>

<script>
import { pageQueryAddress } from "@/api/userManage";
export default {
  data() {
    return {
      publishTime: "", //查询注册时间
      auditTime: "", //查询最后登录时间
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      activeName: "first",
      //状态选择器
      status: "",
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
      commentModerationList: [
        {
          rolesName: "小房间",
          explain: "",
          jurisdiction: "20",
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
  created() {
    this.getList();
  },
  methods: {
    //查询
    getList() {
      pageQueryAddress({
        page: this.pageNum,
        size: this.pageSize,
      }).then((res) => {
        console.log(res);
      });
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

<style lang="scss" scoped>
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
.time {
  margin-left: 15px;
}
</style>