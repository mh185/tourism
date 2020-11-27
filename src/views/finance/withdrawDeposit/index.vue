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
      <el-button class="addBtn" type="primary" @click="addWithdrawDeposit">新增提现申请</el-button>
      <el-button class="editBtn" @click="editWithdrawDeposit">设置提现申请</el-button>
      <el-table class="table" :data="withdrawDepositList" border style="width: 100%" height="400px">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="name" label="提现流水号" width="150"></el-table-column>
        <el-table-column prop="name" label="提现金额" width="100"></el-table-column>
        <el-table-column prop="name" label="提现银行卡号" width="150"></el-table-column>
        <el-table-column prop="name" label="申请人" width="100"></el-table-column>
        <el-table-column prop="name" label="申请时间" width="150"></el-table-column>
        <el-table-column prop="name" label="状态" width="100"></el-table-column>
        <el-table-column prop="name" label="到账状态" width="100"></el-table-column>
        <el-table-column prop="name" label="审核时间" width="150"></el-table-column>
        <el-table-column prop="address" label="操作">
          <el-button size="mini" type="primary">查看</el-button>
          <el-button size="mini" type="danger" @click="remove">删除</el-button>
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
      <!-- 弹窗 ->新增 -->
      <el-dialog title="新增提现申请" :visible.sync="addDialog" width="50%">
        <el-form :model="form">
          <el-form-item label="当前账户可提现金额：" label-width="160px">
            <span class="money">￥1027.02</span>
          </el-form-item>
          <el-form-item label="银行卡号：" label-width="160px">
            <el-input v-model="form.bank" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label=" 开户人姓名：" label-width="160px">
            <el-input v-model="form.name" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="开户人身份证号：" label-width="160px">
            <el-input v-model="form.name" clearable :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="提现金额：" label-width="160px">
            <el-input v-model="form.name" clearable placeholder="请输入小于或等于可提现金额的数字">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialog = false">取 消</el-button>
          <el-button type="primary" @click="addNotarize">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹窗 ->设置 -->
      <el-dialog title="新增提现申请" :visible.sync="editDialog" width="50%">
        <el-form :model="form">
          <el-form-item label="银行卡号：" label-width="160px">
            <el-input v-model="form.bank" clearable></el-input>
          </el-form-item>
          <el-form-item label=" 开户人姓名：" label-width="160px">
            <el-input v-model="form.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="开户人身份证号：" label-width="160px">
            <el-input v-model="form.name" clearable></el-input>
          </el-form-item>
          <el-form-item label="银行预留手机号：" label-width="160px">
            <el-input v-model="form.name" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialog = false">取 消</el-button>
          <el-button type="primary" @click="editNotarize">确 定</el-button>
        </div>
      </el-dialog>
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
      addDialog: false, //新增弹框
      editDialog: false, //设置弹框
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
      form: {
        name: "",
        bank: "50022619981009",
      },
      withdrawDepositList: [
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
    //设置 =>发送请求
    editNotarize() {
      this.editDialog = false;
    },
    //设置 =>打开弹框
    editWithdrawDeposit() {
      this.editDialog = true;
    },
    //新增 =>发送请求
    addNotarize() {
      this.addDialog = false;
    },
    //新增 =>打开弹框
    addWithdrawDeposit() {
      this.addDialog = true;
    },
    //删除
    remove() {
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
.money {
  color: goldenrod;
}
.editBtn {
  float: right;
  border: 1px solid blue;
}
.addBtn {
  float: right;
  margin-right: 15px;
}
.select {
  margin-left: 15px;
}
.table {
  margin-top: 30px;
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