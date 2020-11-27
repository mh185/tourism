<template>
  <el-card>
    <!-- 表格 -->
    <el-table
      :data="shopList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{background:'#dcdfe6'}"
      class="table"
      height="550px"
    >
      <el-table-column prop="vendorName" label="商家名称" width="180"></el-table-column>
      <el-table-column prop="compellation" label="法人姓名" width="180"></el-table-column>
      <el-table-column prop="identityCard" label="法人身份证正反面" width="180"></el-table-column>
      <el-table-column prop="license" label="营业执照" width="180"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="150"></el-table-column>
      <el-table-column prop="type" label="商家类型" width="150"></el-table-column>
      <el-table-column prop="banner" label="banner图" width="150"></el-table-column>
      <el-table-column label="操作" width="150">
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
          <el-image></el-image>
        </el-form-item>
        <el-form-item label="营业执照" label-width="120px">
          <el-image></el-image>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="商家类型" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
        </el-form-item>
        <el-form-item label="banner图" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
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
        <el-form-item label="banner图" label-width="120px">
          <el-input v-model="form.fullName" clearable></el-input>
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
export default {
  data() {
    return {
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      examineStatus: false, //查看店铺弹框
      editShopStatus: false, //编辑店铺弹框
      form: {
        name: "",
        fullName: "",
      },
      //店铺表格
      shopList: [
        {
          vendorName: "下豆腐",
          compellation: "张三",
          identityCard: "",
          license: "",
          phone: "123456",
          type: "",
          banner: "",
        },
        {
          vendorName: "下豆腐",
          compellation: "张三",
          identityCard: "",
          license: "",
          phone: "123456",
          type: "",
          banner: "",
        },
      ],
    };
  },
  methods: {
    //编辑店铺 => 发送请求
    editShop() {
      this.editShopStatus = false;
    },
    //编辑店铺弹框
    showEditShop() {
      this.editShopStatus = true;
    },
    //查看店铺弹框
    lookOver() {
      this.examineStatus = true;
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
</style>