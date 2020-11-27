<template>
  <el-card>
    <!-- 搜索 -->
    <el-row class="searchRow">
      <el-col>
        <el-input clearable v-model="query" placeholder="请输入内容" class="inputSerch">
          <el-button slot="append" icon="el-icon-search" @click="searchUser()"></el-button>
        </el-input>
        <el-button @click="addStatus = true" type="primary" class="searchBtn">添加商品</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      :data="ordinaryList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="550px"
    >
      <el-table-column prop="name" label="商品标题" width="180"></el-table-column>
      <el-table-column prop="price" label="商品价格" width="180"></el-table-column>
      <el-table-column prop="bigType" label="商品大类型" width="180"></el-table-column>
      <el-table-column prop="smallType" label="商品小类型" width="180"></el-table-column>
      <el-table-column prop="pinkage" label="是否包邮" width="150"></el-table-column>
      <el-table-column prop="postage" label="邮费(不包邮)" width="150"></el-table-column>
      <el-table-column prop="refund" label="是否允许退款" width="150"></el-table-column>
      <el-table-column prop="labelCommitment" label="承诺标签" width="150"></el-table-column>
      <el-table-column prop="picture" label="商品图片" width="150"></el-table-column>
      <el-table-column prop="intro" label="商品简介" width="150"></el-table-column>
      <el-table-column prop="specification" label="商品规格" width="150"></el-table-column>
      <el-table-column prop="particulars" label="商品详情" width="150"></el-table-column>
      <el-table-column prop="issuer" label="发布人" width="150"></el-table-column>
      <el-table-column prop="releaseTime" label="发布时间" width="150"></el-table-column>
      <el-table-column prop="auditStatus" label="审核状态" width="150">
        <template slot-scope="scope">
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status">待审核</el-tag>
          <el-tag type="danger" size="mini" v-if="scope.row.pay_status">已拒绝</el-tag>
          <el-tag type="success" size="mini" v-else>已通过</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作" width="300">
        <el-button type="danger" size="mini" @click="removeGoods()">删除</el-button>
        <el-button type="primary" size="mini">查看</el-button>
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
    <el-dialog title="新增商品" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="商品标题" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="120px">
          <el-input v-model="form.price" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品大类型" label-width="120px">
          <el-select v-model="form.bigType" placeholder="请选择" style="width:600px;">
            <el-option
              v-for="item in goodsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品小类型" label-width="120px">
          <el-input v-model="form.smallType" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否包邮" label-width="120px">
          <el-input v-model="form.pinkage" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮费(不包邮)" label-width="120px">
          <el-input v-model="form.postage" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否允许退款" label-width="120px">
          <el-input v-model="form.refund" clearable></el-input>
        </el-form-item>
        <el-form-item label="承诺标签" label-width="120px">
          <div class="components-container">
            <el-drag-select
              v-model="form.labelCommitment"
              style="width:600px;"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in labelCommitmentSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-drag-select>
          </div>
        </el-form-item>
        <el-form-item label="商品简介" label-width="120px">
          <el-input v-model="form.intro" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品规格" label-width="120px">
          <el-input v-model="form.specification" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品详情" label-width="120px">
          <el-input v-model="form.particulars" clearable type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="发布人" label-width="120px">
          <el-input v-model="form.issuer" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品图片" label-width="120px">
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
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button type="primary" @click="addGoods">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑商品 -->
    <el-dialog title="新增商品" :visible.sync="editStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="商品标题" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品价格" label-width="120px">
          <el-input v-model="form.price" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品大类型" label-width="120px">
          <el-select v-model="form.bigType" placeholder="请选择">
            <el-option
              v-for="item in goodsList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品小类型" label-width="120px">
          <el-input v-model="form.smallType" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否包邮" label-width="120px">
          <el-input v-model="form.pinkage" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮费(不包邮)" label-width="120px">
          <el-input v-model="form.postage" clearable></el-input>
        </el-form-item>
        <el-form-item label="是否允许退款" label-width="120px">
          <el-input v-model="form.refund" clearable></el-input>
        </el-form-item>
        <el-form-item label="承诺标签" label-width="120px">
          <div class="components-container">
            <el-drag-select
              v-model="form.labelCommitment"
              style="width:600px;"
              multiple
              placeholder="请选择"
            >
              <el-option
                v-for="item in labelCommitmentSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-drag-select>
          </div>
        </el-form-item>
        <el-form-item label="商品简介" label-width="120px">
          <el-input v-model="form.intro" clearable type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" label-width="120px">
          <el-input v-model="form.specification" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品详情" label-width="120px">
          <el-input v-model="form.particulars" clearable></el-input>
        </el-form-item>
        <el-form-item label="发布人" label-width="120px">
          <el-input v-model="form.issuer" clearable></el-input>
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
import ElDragSelect from "@/components/DragSelect";
export default {
  name: "DragSelectDemo",
  name: "DropzoneDemo",
  components: { ElDragSelect, Dropzone },
  // name: "DropzoneDemo",
  // components: { Dropzone },
  data() {
    return {
      query: "", //查询
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      addStatus: false, //增加商品的弹窗
      editStatus: false, //编辑商品的弹框
      //承诺标签
      labelCommitmentSelect: [
        {
          value: "退款保障",
          label: "退款保障",
        },
        {
          value: "假一赔十",
          label: "假一赔十",
        },
        {
          value: "包邮",
          label: "包邮",
        },
      ],
      goodsList: [
        //商品大类型
        {
          value: "食物",
          label: "食物",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      //表格数据
      ordinaryList: [
        {
          name: "辣条",
          price: "29",
          bigType: "食物",
          smallType: "",
          pinkage: "包邮",
          postage: "",
          refund: "",
          labelCommitment: "",
          picture: "",
          intro: "",
          specification: "",
          particulars: "",
          issuer: "",
          releaseTime: "2012-9-15",
          auditStatus: "",
        },
        {
          name: "小吃",
          price: "",
          bigType: "",
          smallType: "",
          pinkage: "",
          postage: "",
          refund: "",
          labelCommitment: "",
          picture: "",
          intro: "",
          specification: "",
          particulars: "",
          issuer: "",
          releaseTime: "",
          auditStatus: "",
        },
        {
          name: "雪糕",
          price: "",
          bigType: "",
          smallType: "",
          pinkage: "",
          postage: "",
          refund: "",
          labelCommitment: "",
          picture: "",
          intro: "",
          specification: "",
          particulars: "",
          issuer: "",
          releaseTime: "",
          auditStatus: "",
        },
      ],
      //添加商品数据
      form: {
        //标题
        name: "",
        //价格
        price: "20",
        //大类型
        bigType: "",
        // 小类型
        smallType: "",
        //是否包邮
        pinkage: "",
        //邮费
        postage: "",
        //是否允许退款
        refund: "",
        //承诺标签
        labelCommitment: ["退款保障", "假一赔十"],
        //图片
        picture: "",
        //简介
        intro: "",
        //规格
        specification: "",
        //详情
        particulars: "",
        //发布人
        issuer: "mm",
      },
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
      this.addStatus = false;
      console.log("添加");
      this.form = "";
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
      console.log("编辑");
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