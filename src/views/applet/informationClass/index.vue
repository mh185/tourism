<template>
  <el-card>
    <el-date-picker
      v-model="publishTime"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
    ></el-date-picker>
    <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
    <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary" @click="add">添加资讯</el-button>
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
      <el-table-column prop="jurisdiction" label="标题" width="150"></el-table-column>
      <el-table-column prop="jurisdiction" label="位置"></el-table-column>
      <el-table-column prop="createTime" label="浏览量"></el-table-column>
      <el-table-column prop="status" label="点赞数" width="150"></el-table-column>
      <el-table-column prop="status" label="排序" width="150"></el-table-column>
      <el-table-column prop="status" label="发布人" width="150"></el-table-column>
      <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
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
    <!-- 弹窗 ->新增资讯 -->
    <el-dialog title="新增资讯" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="标题：" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="位置：" label-width="120px">
          <el-select clearable v-model="location" placeholder="请选择所属区域">
            <el-option
              v-for="item in typeSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入数字，数字越大，顺序越后"></el-input>
        </el-form-item>
        <el-form-item label="简介：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="封面图片：" label-width="120px">
          <div class="editor-container">
            <dropzone
              id="myVueDropzone"
              url="https://httpbin.org/post"
              @dropzone-removedFile="dropzoneR"
              @dropzone-success="dropzoneS"
            />
          </div>
        </el-form-item>
        <el-form-item label="正文：" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button type="primary" @click="addAscertain ">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Dropzone from "@/components/Upload";
export default {
  name: "DropzoneDemo",
  components: { Dropzone },
  data() {
    return {
      location: "", //位置
      addStatus: false, //添加资讯弹框
      status: true,
      publishTime: "", //查询发布时间
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
  methods: {
    //图片上传
    //上传成功后执行
    dropzoneR(file) {
      console.log(file);
      this.$message({ message: "Upload success", type: "success" });
    },
    //删除图片后执行
    dropzoneS(file) {
      console.log(file);
      this.$message({ message: "Delete success", type: "success" });
    },
    //添加资讯 =>发送请求
    addAscertain() {
      this.addStatus = false;
    },
    //添加资讯 =>弹框
    add() {
      this.addStatus = true;
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
</style>