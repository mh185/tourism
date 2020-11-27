<template>
  <div class="box">
    <div class="head">
      <p class="left">
        当前账户余额：
        <span>￥</span>
        <span class="text">1012131.3</span>
      </p>
      <p class="right">
        提现中金额：
        <span>￥120.00</span>
      </p>
    </div>
    <div class="content">
      <!-- 状态选择器 -->
      <el-select class="select" clearable v-model="status" placeholder="交易类型">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-date-picker class="time" v-model="publishTime" type="datetime" placeholder="交易时间"></el-date-picker>
      <el-input class="queryInput" placeholder="搜索流水号" v-model="input" clearable></el-input>
      <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
      <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
      <el-table class="table" :data="incomeList" border style="width: 100%" height="400px">
        <el-table-column prop="date" label="序号" width="180"></el-table-column>
        <el-table-column prop="name" label="流水号" width="180"></el-table-column>
        <el-table-column prop="name" label="交易金额" width="180"></el-table-column>
        <el-table-column prop="name" label="交易时间" width="180"></el-table-column>
        <el-table-column prop="address" label="交易类型"></el-table-column>
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
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      status: "",
      publishTime: "", //交易时间
      input: "", //搜索流水号
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      options: [
        {
          value: "全部",
          label: "全部",
        },
        {
          value: "订单完成",
          label: "订单完成",
        },
        {
          value: "提现",
          label: "提现",
        },
        {
          value: "提现失败",
          label: "提现失败",
        },
      ],
      incomeList: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  methods: {
    //   重置按钮
    refresh() {
      (this.status = ""), (this.publishTime = ""), (this.input = "");
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
  },
};
</script>

<style lang="scss" scoped>
.select {
  margin-left: 15px;
}
.table {
  margin-top: 15px;
  margin-left: 15px;
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
.box {
  width: 100%;
  .head {
    width: 100%;
    height: 100px;
    line-height: 100px;
    .left {
      font-size: 20px;
      display: inline;
      margin-left: 100px;
      span {
        color: green;
        font-size: 30px;
      }
      .text {
        color: blue;
        border-bottom: 1px solid black;
      }
    }
    .right {
      display: inline;
      margin-left: 400px;
      font-size: 20px;
      span {
        color: green;
        font-size: 30px;
      }
    }
  }
  .content {
    width: 100%;
  }
}
</style>