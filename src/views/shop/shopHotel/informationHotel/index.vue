<template>
  <el-card>
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
      <el-table-column prop="name" label="商家名称" width="180"></el-table-column>
      <el-table-column prop="price" label="法人姓名" width="180"></el-table-column>
      <el-table-column prop="bigType" label="法人身份证正反面" width="180"></el-table-column>
      <el-table-column prop="smallType" label="营业执照" width="180"></el-table-column>
      <el-table-column prop="pinkage" label="联系电话" width="150"></el-table-column>
      <el-table-column prop="postage" label="商家类型" width="150"></el-table-column>
      <el-table-column prop="refund" label="星级" width="150"></el-table-column>
      <el-table-column prop="labelCommitment" label="酒店位置" width="150"></el-table-column>
      <el-table-column prop="picture" label="酒店地址" width="150"></el-table-column>
      <el-table-column prop="intro" label="图片" width="150"></el-table-column>
      <el-table-column prop="specification" label="酒店电话" width="150"></el-table-column>
      <el-table-column prop="particulars" label="价格区间" width="150"></el-table-column>
      <el-table-column prop="issuer" label="设备详情" width="150"></el-table-column>
      <el-table-column prop="status" label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookOver(scope.row)">查看</el-button>
          <el-button type="warning" size="mini" @click="showEditShop(scope.row)">编辑</el-button>
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
    <!-- 弹窗 ->查看店铺 -->
    <el-dialog title="查看店铺" :visible.sync="examineStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="商家名称" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="法人姓名" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="法人身份证正反面" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="营业执照" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="商家类型" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="星级" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="酒店位置" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="酒店地址" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="酒店电话" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格区间" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备详情" label-width="120px">
          <el-input v-model="form.fullName" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="examineStatus = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->编辑店铺 -->
    <el-dialog title="查看店铺" :visible.sync="editShopStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="商家名称" label-width="120px">
          <el-input v-model="form.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="法人姓名" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="法人身份证正反面" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="营业执照" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="商家类型" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="星级" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="酒店位置" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="酒店地址" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="酒店电话" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格区间" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="设备详情" label-width="120px">
          <el-input v-model="form.fullName" clearable type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editShopStatus = false">取 消</el-button>
        <el-button @click="editShop">确 认</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import ElDragSelect from "@/components/DragSelect";
export default {
  name: "DragSelectDemo",
  components: { ElDragSelect },
  data() {
    return {
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      examineStatus: false, //查看店铺的弹窗
      editShopStatus: false, //编辑店铺的弹窗
      //查看店铺
      form: {
        name: "",
        password: "",
        fullName: "",
        roles: "",
        good: "",
      },
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
    //编辑用户 -> 发送请求
    editShop() {
      this.editShopStatus = false;
      this.form = "";
    },
    //打开编辑店铺对话框
    showEditShop() {
      this.editShopStatus = true;
    },
    // 打开查看对话框
    lookOver() {
      this.examineStatus = true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>