<template>
  <el-card>
    <!-- 状态选择器 -->
    <el-select clearable v-model="accountStatus.label" placeholder="账号状态">
      <el-option
        v-for="item in accountStatus"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select clearable v-model="showStatus.label" placeholder="显示状态">
      <el-option
        v-for="item in showStatus"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select clearable v-model="businessType.label" placeholder="商家类型">
      <el-option
        v-for="item in businessType"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-date-picker v-model="startTime"
     :picker-options="issueStartTime"
     type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间" />
    -
    <el-date-picker v-model="endTime"
     :picker-options="issueEndTime"
     type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间" />
    <el-input v-model="keyWord" class="queryInput" placeholder="搜索关键词" clearable />
    <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="searchUser()"
      >查询</el-button
    >
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh"
      >重置</el-button
    >
    <el-button class="addBtn" type="primary" @click="add">新增商家</el-button>
    <!-- 表格 -->
    <el-table
      :data="merchantList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
      v-loading="listLoading"
    >
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column
        prop="businessName"
        label="商家名称"
        width="180"
      ></el-table-column>
      <el-table-column prop="businessType" label="商家类型">
        <template slot-scope="scope">
          <span v-if="scope.row.businessType == 0">景区</span>
          <span v-if="scope.row.businessType == 1">普通商家</span>
          <span v-if="scope.row.businessType == 2">酒店</span>
          <span v-if="scope.row.businessType == 3">旅行社</span>
        </template>
      </el-table-column>
      <el-table-column prop="businessPhone" label="联系电话"></el-table-column>
      <el-table-column
        prop="createTime"
        label="入驻时间"
        width="160"
      ></el-table-column>
      <el-table-column label="账号状态" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.accountStatus == 1 ? true : false"
            @change="merchantStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="显示状态" width="150">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.showStatus == 1 ? true : false"
            @change="showStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="loovOver(scope.row)">查看</el-button>
        </template>
        <!-- <el-button type="success" size="mini">重置登录密码</el-button> -->
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 弹窗 ->查看 -->
    <el-dialog title="查看" :visible.sync="lookOverStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="商家名称" label-width="120px">
          <el-input
            v-model="form.businessName"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="联系电话" label-width="120px">
          <el-input
            v-model="form.businessPhone"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="入驻时间" label-width="120px">
          <el-input
            v-model="form.createTime"
            clearable
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lookOverStatus = false">取 消</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { pageQuery, IsEnableAccount, selectOne } from "@/api/merchant";
import { delStop } from "@/utils/temporary/temporary"
export default {
  data() {
    return {
      lookOverStatus: false, //查看弹框
      accountQuery: "",
      total: -1, //总条数默认给100
      pageSize: 4, //每页显示数据
      pageNum: 1, //当前页数
      activeName: "first",
      //状态选择器
      keyWord: "",
      startTime: "",
      endTime: "",
      form: {
        businessName: "",
        businessPhone: "",
      },
      accountStatus: [
        { value: "",label: "全部",},
        { value: 1,label: "正常",},
        { value: 0,label: "停用",},
      ],
      showStatus: [
        { value: "",label: "全部",},
        { value: 1,label: "正常",},
        { value: 0,label: "停用",},
      ],
      businessType: [
        { value: "",label: "全部",},
        { value: 0,label: "景区",},
        { value: 1,label: "普通商家",},
        { value: 2,label: "酒店",},
        { value: 3,label: "旅行社",},
      ],
      merchantList: [], //列表
      issueStartTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() > this.value2;
          } else {
            return time.getTime() > Date.now();
          }
        },
      },
      issueEndTime: {
        disabledDate: (time) => {
          if (this.value2) {
            return time.getTime() < this.value1;
          }
          return time.getTime() < Date.now();
        },
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    add(){
      this.$router.push({ path: 'index' })
    },
    del(e,index,rows){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
              delStop({id:e.id}).then(res=>{
        if (res.code=200) {
          rows.splice(index, 1);
          this.$message({
            type:'success',
            message:'删除成功！'
          })
        }
      })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    //查询
    searchUser(){
    this.getList();
    },
    //查看
    loovOver(e) {
      console.log(e)
      // this.lookOverStatus = true;
      this.$router.push({path:'/shop/shopScenicArea/informationScenicArea',query: {id:e.id}})
    },
    //更改账号状态
    merchantStatus(user) {
      let accountStatus = "";
      if (user.accountStatus === 1) {
        accountStatus = 0;
      } else {
        accountStatus = 1;
      }
      let params = {
        id: user.id,
        isEnable: accountStatus,
      };
      IsEnableAccount(params).then((res) => {
        this.$message({
          type: "success",
          message: res.message,
        });
        this.getList();
      });
    },
    // 商家列表
    getList() {
      this.listLoading = true
      let params = {
        page: this.pageNum,
        size: this.pageSize,
      };
      // if(this.status === "正常"){
      //   this.status = 1
      // }else if(this.status === "停用"){
      //   this.status = 0
      // }else{
      //   this.status = ""
      // }
      let data = {
          keyWord: this.keyWord,
          accountStatus: this.accountStatus.label,
          showStatus: this.showStatus.label,
          businessType: this.businessType.label
      };
      pageQuery(params, data).then((res) => {
        this.merchantList = res.data.rows;
        this.total = res.data.total;
        this.listLoading = false
      });
      this.form = this.merchantList;
    },
    //商品重置按钮
    refresh() {
      this.keyWord = "",
      this.accountStatus.label = "",
      this.showStatus.label = "",
      this.businessType.label = "",
      this.getList()
    },
    //分页
    handleCurrentChange(pageNum) {
      console.log(`当前页: ${pageNum}`);
      this.pageNum = pageNum;
      this.getList();
    },
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`);
      this.pageSize = pageSize;
      this.pageNum = 1;
      this.getList();
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
.time {
  margin-left: 15px;
}
.addBtn {
  float: right;
  margin-right: 15px;
}
</style>