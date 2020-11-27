<template>
  <el-card>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input clearable v-model="query" placeholder="请输入内容" class="inputSerch">
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button @click="addCommodityStatus = true" type="primary" class="searchBtn">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="hotelList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="550px"
    >
      <el-table-column prop="rolesName" label="房间名称" width="180"></el-table-column>
      <el-table-column prop="jurisdiction" label="单晚价格"></el-table-column>
      <el-table-column prop="createTime" label="房间数量"></el-table-column>
      <el-table-column prop="status" label="发布人" width="150"></el-table-column>
      <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
      <el-table-column prop="status" label="状态" width="150">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status">待审核</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status">已拒绝</el-tag>
          <el-tag type="success" size="mini" v-else>已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="审核时间" width="150"></el-table-column>
      <el-table-column prop="status" label="操作" width="300">
        <el-button type="danger" size="mini" @click="removeGoods()">删除</el-button>
        <el-button type="primary" size="mini" @click="examineStatus = true">查看</el-button>
        <el-button type="warning" size="mini" @click="editStatus = true">编辑</el-button>
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

    <!-- 弹窗 ->新增商品 -->
    <el-dialog title="新增商品" :visible.sync="addCommodityStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="房间名称" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="单晚价格" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间数量" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间大小" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="床型" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否含早" label-width="120px">
          <el-select v-model="form.good" clearable style="width:600px;">
            <el-option
              v-for="item in goodsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否允许退款" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间简介" label-width="120px">
          <el-input v-model="form.fullName" clearable type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="发布人" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间图片" label-width="120px">
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
        <el-button @click="addCommodityStatus = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑商品 -->
    <el-dialog title="编辑商品" :visible.sync="editStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="房间名称" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="单晚价格" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间数量" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间大小" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="床型" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否含早" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否允许退款" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间简介" label-width="120px">
          <el-input v-model="form.fullName" clearable type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="发布人" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editStatus = false">取 消</el-button>
        <el-button type="primary" @click="editGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->查看商品 -->
    <el-dialog title="查看商品" :visible.sync="examineStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="房间名称" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="单晚价格" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间数量" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间大小" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="床型" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否含早" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否允许退款" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="房间简介" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="发布人" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="examineStatus = false">关 闭</el-button>
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
      query: "", //查询
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      // 表格数据
      hotelList: [
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
      addCommodityStatus: false, //增加商品的弹窗
      editStatus: false, //编辑商品的弹框
      examineStatus: false, //查看商品的弹窗
      //添加商品数据
      form: {
        name: "",
        password: "",
        fullName: "",
        roles: "",
        good: "",
      },
      goodsList: [
        {
          value: "1",
          label: "是",
        },
        {
          value: "2",
          label: "否",
        },
      ],
    };
  },
  methods: {
    //图片上传
    //上传成功后执行
    dropzoneS(file) {
      console.log(file);
      this.$message({ message: "Upload success", type: "success" });
    },
    //删除图片后执行
    dropzoneR(file) {
      console.log(file);
      this.$message({ message: "Delete success", type: "success" });
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
    // 增加商品
    addGoods() {
      this.addCommodityStatus = false;
      console.log("添加成功");
    },
    //删除商品
    removeGoods() {
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
    //编辑商品
    editGoods() {
      this.editStatus = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  margin-bottom: 15px;
}
.inputSerch {
  width: 300px;
}
.searchBtn {
  margin-left: 15px;
}
.table {
  margin-top: 15px;
}
</style>