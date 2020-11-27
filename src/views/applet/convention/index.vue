<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="大会资讯" name="first">
        <el-date-picker
          v-model="publishTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
        <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
        <el-button class="queryBtn" icon="el-icon-refresh" @click="refreshConvention">重置</el-button>
        <el-button class="addBtn" type="primary">添加大会资讯</el-button>
        <!-- 表格 -->
        <el-table
          :data="conventionList"
          border
          stripe
          style="width: 100%"
          :header-cell-style="{background:'#dcdfe6'}"
          class="table"
          height="480px"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="jurisdiction" label="标题" width="150"></el-table-column>
          <el-table-column prop="jurisdiction" label="简介"></el-table-column>
          <el-table-column prop="createTime" label="排序"></el-table-column>
          <el-table-column prop="status" label="发布人" width="150"></el-table-column>
          <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
          <el-table-column prop="status" label="操作" width="250">
            <el-button type="primary" size="mini">查看</el-button>
            <el-button type="success" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeConvention()">删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="电子会务手册" name="second">
        <el-date-picker
          v-model="publishTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
        <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
        <el-button class="queryBtn" icon="el-icon-refresh" @click="refreshConvention">重置</el-button>
        <el-button class="addBtn" type="primary">添加会务手册</el-button>
        <!-- 表格 -->
        <el-table
          :data="handbookList"
          border
          stripe
          style="width: 100%"
          :header-cell-style="{background:'#dcdfe6'}"
          class="table"
          height="480px"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="jurisdiction" label="标题" width="200"></el-table-column>
          <el-table-column prop="jurisdiction" label="文件" width="200"></el-table-column>
          <el-table-column prop="status" label="发布人" width="200"></el-table-column>
          <el-table-column prop="status" label="发布时间" width="200"></el-table-column>
          <el-table-column prop="status" label="操作">
            <el-button type="success" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeHandbook()">删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="大会直播" name="third">
        <el-date-picker
          v-model="publishTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
        <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
        <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
        <el-button class="queryBtn" icon="el-icon-refresh" @click="refreshConvention">重置</el-button>
        <el-button class="addBtn" type="primary">添加大会直播</el-button>
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
          <el-table-column prop="jurisdiction" label="直播名称" width="200"></el-table-column>
          <el-table-column prop="jurisdiction" label="链接" width="200"></el-table-column>
          <el-table-column prop="status" label="排序" width="200"></el-table-column>
          <el-table-column prop="status" label="创建人" width="200"></el-table-column>
          <el-table-column prop="status" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="status" label="操作">
            <el-button type="primary" size="mini">查看</el-button>
            <el-button type="success" size="mini">编辑</el-button>
            <el-button type="danger" size="mini" @click="removeLiveStreaming()">删除</el-button>
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
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      publishTime: "", //查询发布时间
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      activeName: "first",
      //大会列表
      conventionList: [
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
      //会务手册列表
      handbookList: [
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
      //大会直播列表
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
    //删除大会资讯
    removeConvention() {
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
    //删除手册
    removeHandbook() {
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
    //删除直播
    removeLiveStreaming() {
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
    //重置按钮 ->大会
    refreshConvention() {
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
</style>