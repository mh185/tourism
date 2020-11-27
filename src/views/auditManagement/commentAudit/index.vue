<template>
  <el-card>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="商品评论" name="store">
        <!-- 状态选择器 -->
        <el-select clearable v-model="status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker class="time" v-model="publishTime" type="datetime" placeholder="发布时间"></el-date-picker>
        <el-date-picker class="time" v-model="auditTime" type="datetime" placeholder="审核时间"></el-date-picker>
        <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
        <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
        <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
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
          <el-table-column prop="jurisdiction" label="商品标题" width="180"></el-table-column>
          <el-table-column prop="jurisdiction" label="商品价格"></el-table-column>
          <el-table-column prop="createTime" label="发布人"></el-table-column>
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
            <el-button type="primary" size="mini" @click="examineShop = true">查看</el-button>
            <el-button type="warning" size="mini">通过</el-button>
            <el-button type="danger" size="mini">拒绝</el-button>
          </el-table-column>
        </el-table>
        <!-- 弹窗 ->查看商品评价 -->
        <el-dialog title="查看商品评论" :visible.sync="examineShop" width="50%">
          <el-form :model="form">
            <el-form-item label="商品标题" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品简介" label-width="120px">
              <el-input v-model="form.name" clearable type="textarea" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" label-width="120px">
              <el-image style="width: 100px; height: 100px" :src="url"></el-image>
            </el-form-item>
            <el-form-item label="发布人" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="评价内容" label-width="120px">
              <el-input v-model="form.name" clearable type="textarea" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="发布时间" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="状态" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="examineShop = false">关 闭</el-button>
          </div>
        </el-dialog>
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
      <el-tab-pane label="资讯评论" name="information">
        <!-- 状态选择器 -->
        <el-select clearable v-model="status" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker class="time" v-model="publishTime" type="datetime" placeholder="发布时间"></el-date-picker>
        <el-date-picker class="time" v-model="auditTime" type="datetime" placeholder="审核时间"></el-date-picker>
        <el-input class="queryInput" placeholder="搜索关键词" v-model="input" clearable></el-input>
        <el-button class="queryBtn" type="primary" icon="el-icon-search">查询</el-button>
        <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
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
          <el-table-column prop="jurisdiction" label="标题" width="180"></el-table-column>
          <el-table-column prop="status" label="发布人" width="150"></el-table-column>
          <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
          <el-table-column prop="status" label="位置" width="150"></el-table-column>
          <el-table-column prop="status" label="状态" width="150">
            <template slot-scope="scope">
              <el-tag type="danger" size="mini" v-if="scope.row.pay_status">待审核</el-tag>
              <el-tag type="danger" size="mini" v-if="scope.row.pay_status">已拒绝</el-tag>
              <el-tag type="success" size="mini" v-else>已通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核时间" width="150"></el-table-column>
          <el-table-column prop="status" label="操作" width="300">
            <el-button type="primary" size="mini" @click="examineInformation = true">查看</el-button>
            <el-button type="warning" size="mini">通过</el-button>
            <el-button type="danger" size="mini">拒绝</el-button>
          </el-table-column>
        </el-table>
        <!-- 弹窗 ->查看资讯评价 -->
        <el-dialog title="查看资讯评论" :visible.sync="examineInformation" width="50%">
          <el-form :model="form">
            <el-form-item label="标题" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="简介" label-width="120px">
              <el-input v-model="form.name" clearable type="textarea" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="封面图" label-width="120px">
              <el-image style="width: 100px; height: 100px" :src="url"></el-image>
            </el-form-item>
            <el-form-item label="发布人" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="评价内容" label-width="120px">
              <el-input v-model="form.name" clearable type="textarea" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="发布时间" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="位置" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="状态" label-width="120px">
              <el-input v-model="form.name" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="examineInformation = false">关 闭</el-button>
          </div>
        </el-dialog>
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
      examineShop: false, //查看商品弹出框
      examineInformation: false, //查看资讯评价弹出框
      publishTime: "", //查询发布时间
      auditTime: "", //查询审核时间
      input: "",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      activeName: "store",
      //状态选择器
      status: "",
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      form: {
        name: "哈哈",
        fullName: "",
      },
      options: [
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
    //商品重置按钮
    refresh() {
      (this.status = ""),
        (this.input = ""),
        (this.publishTime = ""),
        (this.auditTime = "");
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
.time {
  margin-left: 15px;
}
</style>