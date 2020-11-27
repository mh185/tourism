<template>
  <el-card>
    <div class="block">
      <el-date-picker
        v-model="startTime"
        type="datetime"
        :picker-options="issueStartTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布开始时间"
      />
      <el-date-picker
        v-model="endTime"
        type="datetime"
        :picker-options="issueEndTime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布结束时间"
      />
    </div>
    <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
    <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary" @click="addTickets">添加特惠门票</el-button>
    <!-- 表格 -->
    <el-table
      :data="commentModerationList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="jurisdiction" label="提供商家" width="150"></el-table-column>
      <el-table-column prop="jurisdiction" label="关联门票"></el-table-column>
      <el-table-column prop="createTime" label="折后价"></el-table-column>
      <el-table-column prop="status" label="排序" width="150"></el-table-column>
      <el-table-column prop="status" label="发布人" width="150"></el-table-column>
      <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
      <el-table-column prop="status" label="操作" width="150">
        <el-button type="primary" size="mini">查看</el-button>
        <el-button type="danger" size="mini" @click="remove()">删除</el-button>
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
    <!-- 弹窗 ->新增特惠门票 -->
    <el-dialog title="新增特惠门票" :visible.sync="addTicketsStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="提供商家：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请选择门票提供商家"></el-input>
        </el-form-item>
        <el-form-item label="关联门票：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请选择关联门票"></el-input>
        </el-form-item>
        <el-form-item label="原价：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="选择关联门票后自动填充" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="折后价：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入数字，数字越大，顺序越后"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addTicketsStatus = false">取 消</el-button>
        <el-button type="primary" @click="addTicketsAscertain">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      addTicketsStatus: false, //新增弹框
      startTime: "",
      endTime: "",
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      activeName: "first",
      form: {
        name: "",
        fullName: "",
      },
      typeSelect: [
        {
          value: "首页",
          label: "首页",
        },
        {
          value: "政府服务",
          label: "政府服务",
        },
        {
          value: "商城",
          label: "商城",
        },
        {
          value: "商城推荐",
          label: "商城推荐",
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
        }, 
    }
  },
  methods: {
    //新增特惠商品
    addTickets() {
      this.addTicketsStatus = true;
    },
    //新增特惠商品
    addTicketsAscertain() {
      this.addTicketsStatus = false;
      console.log("新增");
    },
    //删除商品
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
    //商品重置按钮
    refresh() {
      (this.input = ""), (this.publishTime = "");
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
.addBtn {
  float: right;
  margin-right: 50px;
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
.block{
  float: left;
}
</style>