<template>
  <el-card>
    <!-- 状态选择器 -->
    <el-select clearable v-model="status" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-date-picker class="time" v-model="publishTime" type="datetime" placeholder="使用日期"></el-date-picker>
    <el-date-picker class="time" v-model="auditTime" type="datetime" placeholder="核销时间"></el-date-picker>
    <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
    <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <!-- 表格 -->
    <el-table
      :data="orderList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="订单编号" width="150"></el-table-column>
      <el-table-column prop="jurisdiction" label="门票名称" width="180"></el-table-column>
      <el-table-column prop="jurisdiction" label="使用日期"></el-table-column>
      <el-table-column prop="createTime" label="单价"></el-table-column>
      <el-table-column prop="status" label="数量" width="150"></el-table-column>
      <el-table-column prop="status" label="总价" width="150"></el-table-column>
      <el-table-column prop="status" label="状态" width="150"></el-table-column>
      <el-table-column prop="status" label="核销时间" width="150"></el-table-column>
      <el-table-column prop="status" label="操作">
        <el-button type="primary" size="mini" @click="lookOver =true">查看</el-button>
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
export default {
  data() {
    return {
      publishTime: "", //查询使用时间
      auditTime: "", //查询核销时间
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
          value: "待支付",
          label: "待支付",
        },
        {
          value: "已支付",
          label: "已支付",
        },
        {
          value: "已过期",
          label: "已过期",
        },
        {
          value: "待评价",
          label: "待评价",
        },
        {
          value: "退款",
          label: "退款",
        },
        {
          value: "已评价",
          label: "已评价",
        },
        {
          value: "已取消",
          label: "已取消",
        },
      ],
      orderList: [
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
  methods: {
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