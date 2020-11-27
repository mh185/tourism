<template>
  <el-card>
    <!-- 状态选择器 -->
    <el-select clearable v-model="status" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-date-picker
      class="time"
      v-model="publishTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
    <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary">添加banner</el-button>
    <!-- 表格 -->
    <el-table
      :data="liveStreamingList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="jurisdiction" label="直播名" width="150"></el-table-column>
      <el-table-column label="封面图">
        <el-image style="width: 50px; height: 50px" :src="url" :preview-src-list="srcList"></el-image>
      </el-table-column>
      <el-table-column prop="jurisdiction" label="关联景区"></el-table-column>
      <el-table-column prop="status" label="设备位置" width="150"></el-table-column>
      <el-table-column prop="status" label="设备编号" width="150"></el-table-column>
      <el-table-column prop="status" label="累计观看数" width="150"></el-table-column>
      <el-table-column prop="status" label="排序" width="100"></el-table-column>
      <el-table-column prop="status" label="发布人" width="150"></el-table-column>
      <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
      <el-table-column prop="status" label="发布人" width="150"></el-table-column>
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
export default {
  data() {
    return {
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      ],
      publishTime: "", //查询时间
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      //状态选择器
      status: "",
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
      form: {
        name: "",
        fullName: "",
      },
      liveStreamingList: [
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
      (this.status = ""), (this.input = ""), (this.publishTime = "");
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
  margin-right: 50px;
}
.time {
  margin-left: 15px;
}
</style>