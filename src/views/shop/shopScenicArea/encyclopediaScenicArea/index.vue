<template>
  <el-card>
    <!-- 状态选择器 -->
    <el-select clearable v-model="status" placeholder="请选择">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <el-date-picker class="time" v-model="publishTime" type="datetime" placeholder="发布时间"></el-date-picker>
    <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
    <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button class="addBtn" type="primary" @click="addEncyclopedia">新增百科</el-button>
    <!-- 表格 -->
    <el-table
      :data="encyclopediaList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="550px"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="rolesName" label="百科名称" width="100"></el-table-column>
      <el-table-column prop="jurisdiction" label="封面图" width="100"></el-table-column>
      <el-table-column prop="createTime" label="简介" width="150"></el-table-column>
      <el-table-column prop="status" label="正文" width="150"></el-table-column>
      <el-table-column prop="status" label="发布人" width="150"></el-table-column>
      <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
      <el-table-column prop="status" label="审核状态" width="150">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status">待审核</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status">已拒绝</el-tag>
          <el-tag type="success" size="mini" v-else>已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作">
        <el-button type="danger" size="mini" @click="removeEncyclopedia()">删除</el-button>
        <el-button type="primary" size="mini" @click="examineStatus = true">查看</el-button>
        <el-button type="warning" size="mini" @click="editEncyclopedia">编辑</el-button>
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
    <!-- 弹窗 ->新增百科 -->
    <el-dialog title="新增百科" :visible.sync="addEncyclopediaStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="百科名称" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入数字，数字越大，顺序越后"></el-input>
        </el-form-item>
        <el-form-item label="简介" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="封面图片" label-width="120px">
          <div class="editor-container">
            <dropzone
              id="myVueDropzone"
              url="https://httpbin.org/post"
              @dropzone-removedFile="dropzoneR"
              @dropzone-success="dropzoneS"
            />
          </div>
        </el-form-item>
        <el-form-item label="正文" label-width="120px">
          <el-input v-model="form.fullName" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addEncyclopediaStatus = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->查看商品 -->
    <el-dialog title="查看百科" :visible.sync="examineStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="百科名称" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="封面图" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="简介" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="正文" label-width="120px">
          <el-input v-model="form.fullName" clearable type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="发布人" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="发布时间" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="审核状态" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="examineStatus = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑商品 -->
    <el-dialog title="编辑商品" :visible.sync="editStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="百科名称" label-width="120px">
          <el-input v-model="form.name" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="排序" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入数字，数字越大，顺序越后"></el-input>
        </el-form-item>
        <el-form-item label="简介" label-width="120px">
          <el-input v-model="form.fullName" clearable placeholder="请输入" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="封面图片" label-width="120px">
          <div class="editor-container">
            <dropzone
              id="myVueDropzoneTwo"
              url="https://httpbin.org/post"
              @dropzone-removedFile="dropzoneR"
              @dropzone-success="dropzoneS"
            />
          </div>
        </el-form-item>
        <el-form-item label="正文" label-width="120px">
          <el-input v-model="form.fullName" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStatus = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
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
      status: "", //审核状态
      publishTime: "", //发布时间
      input: "", //搜索关键词
      query: "", //查询
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      addEncyclopediaStatus: false, //新增百科弹窗
      examineStatus: false, //查看百科弹窗
      editStatus: false, //编辑百科弹窗
      form: {
        name: "",
        fullName: "",
      },
      encyclopediaList: [
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
      options: [
        {
          value: "全部",
          label: "全部",
        },
        {
          value: "待审核",
          label: "待审核",
        },
        {
          value: "已通过",
          label: "已通过",
        },
        {
          value: "已拒绝",
          label: "已拒绝",
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
    //重置按钮
    refresh() {
      (this.input = ""), (this.publishTime = ""), (this.status = "");
    },
    //编辑百科 =>打开弹窗
    editEncyclopedia() {
      this.editStatus = true;
    },
    //编辑百科 =>发送请求
    editGoods() {
      this.editStatus = false;
      console.log("编辑");
    },
    //删除百科
    removeEncyclopedia() {
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
    //新增百科 => 弹窗
    addEncyclopedia() {
      this.addEncyclopediaStatus = true;
    },
    //新增百科 => 发送请求
    addGoods() {
      this.addEncyclopediaStatus = false;
      console.log("成功");
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
.addBtn {
  float: right;
  margin-right: 15px;
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
.time {
  margin-left: 15px;
}
</style>