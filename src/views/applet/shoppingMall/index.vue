<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="热销商品" name="commodity">
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
        <el-button class="addBtn" type="primary" @click="addCommodity">添加热销商品</el-button>
        <!-- 表格 -->
        <el-table
          :data="commodityList"
          border
          stripe
          style="width: 100%"
          :header-cell-style="{background:'#dcdfe6'}"
          class="table"
          height="480px"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="jurisdiction" label="提供商家" width="200"></el-table-column>
          <el-table-column prop="jurisdiction" label="关联商品" width="200"></el-table-column>
          <el-table-column prop="status" label="排序" width="200"></el-table-column>
          <el-table-column prop="status" label="发布人" width="200"></el-table-column>
          <el-table-column prop="status" label="发布时间" width="200"></el-table-column>
          <el-table-column prop="status" label="操作">
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
        <!-- 弹窗 -> 新增热销商品 -->
        <el-dialog title="新增热销商品" :visible.sync="addCommodityStatus" width="50%">
          <el-form :model="form">
            <el-form-item label="提供商家：" label-width="120px">
              <el-input v-model="form.name" clearable placeholder="请选择景区"></el-input>
            </el-form-item>
            <el-form-item label="关联商品：" label-width="120px">
              <el-input v-model="form.fullName" clearable placeholder="选择景区后自动填充" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="排序：" label-width="120px">
              <el-input v-model="form.fullName" clearable placeholder="请输入数字，数字越大，顺序越后"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addCommodityStatus = false">取 消</el-button>
            <el-button type="primary" @click="addCommodityAscertain">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="商城商品分类" name="classify">
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
        <el-button class="addBtn" type="primary" @click="addClassify">添加分类</el-button>
        <!-- 表格 -->
        <el-table
          :data="classifyList"
          border
          stripe
          style="width: 100%"
          :header-cell-style="{background:'#dcdfe6'}"
          class="table"
          height="480px"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="jurisdiction" label="分类名称" width="200"></el-table-column>
          <el-table-column label="图片" width="200">
            <el-image style="width: 50px; height: 50px" :src="url" :preview-src-list="srcList"></el-image>
          </el-table-column>
          <el-table-column prop="status" label="排序" width="200"></el-table-column>
          <el-table-column prop="status" label="发布人" width="200"></el-table-column>
          <el-table-column prop="status" label="发布时间" width="200"></el-table-column>
          <el-table-column prop="status" label="操作">
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
        <!-- 弹窗 -> 新增分类 -->
        <el-dialog title="新增分类" :visible.sync="addClassifyStatus" width="50%">
          <el-form :model="form">
            <el-form-item label="分类名称：" label-width="120px">
              <el-input v-model="form.name" clearable placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="图片：" label-width="120px">
              <div class="editor-container">
                <dropzone
                  id="myVueDropzone"
                  url="https://httpbin.org/post"
                  @dropzone-removedFile="dropzoneR"
                  @dropzone-success="dropzoneS"
                />
              </div>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="addClassifyStatus = false">取 消</el-button>
            <el-button type="primary" @click="addClassifyAscertain">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import Dropzone from "@/components/Upload";
export default {
  name: "DropzoneDemo",
  components: { Dropzone },
  data() {
    return {
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      ],
      addClassifyStatus: false, //新增分类
      addCommodityStatus: false, //新增热销商品
      publishTime: "", //查询发布时间
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      activeName: "commodity",
      form: {
        name: "",
        fullName: "",
      },
      classifyList: [
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
      commodityList: [
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
    //新增分类 -弹框
    addClassify() {
      this.addClassifyStatus = true;
    },
    //新增分类 -发送请求
    addClassifyAscertain() {
      this.addClassifyStatus = false;
    },
    //新增热销商品 -弹框
    addCommodity() {
      this.addCommodityStatus = true;
    },
    //新增热销商品 -发送请求
    addCommodityAscertain() {
      this.addCommodityStatus = false;
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
    //标签页切换执行方法
    handleClick(tab, event) {
      console.log(tab, event);
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