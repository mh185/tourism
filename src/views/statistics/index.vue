<template>
  <el-card>
    <el-date-picker
      v-model="queryTime"
      align="right"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
    >
    </el-date-picker>
    <el-button class="queryBtn" type="primary" icon="el-icon-search"
      >查询</el-button
    >
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh"
      >重置</el-button
    >
    <div class="content">
      <div class="left">
        <h3>酒店</h3>
        <p>盈利商家数量：<span style="color: goldenrod">1283798321</span></p>
        <p>房间售出数量：<span style="color: blue">1234564134</span></p>
        <p>金额：<span class="buttom">￥123154653164</span></p>
      </div>
      <div class="center">
        <h3>景区</h3>
        <p>盈利商家数量：<span style="color: goldenrod">1283798321</span></p>
        <p>房间售出数量：<span style="color: blue">1234564134</span></p>
        <p>金额：<span class="buttom">￥123154653164</span></p>
      </div>
      <div class="right">
        <h3>商城商家</h3>
        <p>盈利商家数量：<span style="color: goldenrod">1283798321</span></p>
        <p>房间售出数量：<span style="color: blue">1234564134</span></p>
        <p>金额：<span class="buttom">￥123154653164</span></p>
      </div>
    </div>
    <div class="foot">
      <h4 class="text">流水明细</h4>
      <el-table :data="detailList" border style="width: 100%" height="300px">
        <el-table-column
          type="index"
          label="序号"
          width="150px"
        ></el-table-column>
        <el-table-column prop="date" label="金额"></el-table-column>
        <el-table-column prop="name" label="相关商家"></el-table-column>
        <el-table-column prop="name" label="类型"></el-table-column>
        <el-table-column prop="address" label="时间"></el-table-column>
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
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      queryTime: "", //查询日期
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      detailList: [
        {
          date: "+¥102.00",
          name: "卡乐星球",
          address: "下单",
        },
        {
          date: "+¥102.00",
          name: "卡乐星球",
          address: "下单",
        },
        {
          date: "+¥102.00",
          name: "卡乐星球",
          address: "下单",
        },
        {
          date: "+¥102.00",
          name: "卡乐星球",
          address: "下单",
        },
        {
          date: "+¥102.00",
          name: "卡乐星球",
          address: "下单",
        },
      ],
      // 日期查询
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
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
    //重置
    refresh() {
      this.queryTime = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.queryBtn {
  margin-left: 15px;
}
.content {
  width: 100%;
  height: 300px;
  margin-top: 25px;
  display: flex;
  flex-direction: row;
  .left {
    width: 250px;
    height: 250px;
    background-color: skyblue;
    border-radius: 20px;
    margin-top: 25px;
    margin-left: 90px;
    padding: 15px 15px;
    p {
      display: inline-block;
      font-size: 13px;
    }
    h3 {
      text-align: center;
    }
    .buttom {
      font-size: 18px;
      color: goldenrod;
    }
  }
  .center {
    width: 250px;
    height: 250px;
    background-color: skyblue;
    margin-top: 25px;
    border-radius: 20px;
    margin-left: 180px;
    margin-right: 180px;
    padding: 15px 15px;

    p {
      display: inline-block;
      font-size: 13px;
    }
    h3 {
      text-align: center;
    }
    .buttom {
      font-size: 18px;
      color: goldenrod;
    }
  }
  .right {
    width: 250px;
    height: 250px;
    background-color: skyblue;
    margin-top: 25px;
    border-radius: 20px;
    padding: 15px 15px;
    p {
      display: inline-block;
      font-size: 13px;
    }
    h3 {
      text-align: center;
    }
    .buttom {
      font-size: 18px;
      color: goldenrod;
    }
  }
}
.foot {
  width: 100%;
  .text {
    margin-left: 20px;
  }
}
</style>