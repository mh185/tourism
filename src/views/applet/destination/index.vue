<template>
  <el-card>
    <el-date-picker
      v-model="startTime"
      type="datetime"
      :picker-options="issueStartTime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择开始时间"
    />
    -
    <el-date-picker
      v-model="endTime"
      type="datetime"
      :picker-options="issueEndTime"
      value-format="yyyy-MM-dd HH:mm:ss"
      placeholder="选择结束时间"
    />
    <el-input
      v-model="keyWord"
      class="queryInput"
      placeholder="搜索关键词"
      clearable
    />
    <el-button
      class="queryBtn"
      type="primary"
      icon="el-icon-search"
      @click="onClick"
      >查询</el-button
    >
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh"
      >重置</el-button
    >
    <el-button class="addBtn" type="primary" @click="add">添加目的地</el-button>
    <!-- 表格 -->
    <el-table
      :data="commentModerationList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
      v-loading="listLoading"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="scenicSpotName" label="关联景区商家" />
      <el-table-column prop="areaName" label="所属区域" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="publisher" label="发布人" />
      <el-table-column prop="publishTime" label="发布时间" />
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="success" size="mini">查看</el-button> -->
          <el-button
            type="danger"
            size="mini"
            @click="remove(scope.$index, commentModerationList, scope)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :page-size="pageSize"
      layout="prev, pager, next"
      :total="total"
      :current-page="pageNum"
      hide-on-single-page
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    <!-- 弹窗 -> 新增目的地 -->
    <el-dialog title="新增目的地" :visible.sync="addStatus" width="50%">
      <el-form :model="form">
        <el-form-item label="关联景区：" label-width="120px">
          <el-select
            v-model="form.optionsValue"
            placeholder="请选择景区"
            @change="onOptions"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.scenicSpotName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属区域：" label-width="120px">
          <el-input
            v-model="form.areaName"
            clearable
            placeholder="选择景区后自动填充"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="排序：" label-width="120px">
          <el-input
            v-model="form.sort"
            clearable
            placeholder="请输入数字，数字越大，顺序越后"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addStatus = false">取 消</el-button>
        <el-button type="primary" @click="addAscertain">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import {
  queryDestination,
  insertDestination,
  delDestination,
  queryScenicSpotList,
} from "@/api/destination/index";
export default {
  data() {
    return {
      addStatus: false, // 新增弹框
      publishTime: "", // 查询发布时间
      keyWord: "",
      total: 100, // 总条数默认给100
      pageSize: 10,
      pageNum: 1, // 当前页数
      startTime: "",
      endTime: "",
      form: {},
      commentModerationList: [],
      optionsValue: "",
      options: [],
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
  mounted() {
    this.destinationDate();
  },
  created(){
    this.getScenicSpot();
  },
  methods: {
    destinationDate() {
      const quer = {
        page: this.pageNum,
        size: this.pageSize,
      };
      const mit = {};
      if (this.startTime != "" && this.endTime != "") {
        (mit.startTime = this.startTime), (mit.endTime = this.endTime);
      }
      if (this.keyWord != "") {
        mit.keyWord = this.keyWord;
      }
      const data = mit;
      queryDestination(quer, data).then((res) => {
        if ((res.code = 200)) {
          this.commentModerationList = res.data.rows;
          this.total = res.data.total;
        }
      });
    },
    onClick() {
      console.log(this.startTime, this.endTime);
      this.destinationDate();
    },
    // 新增 =>发送请求
    addAscertain() {
      this.addStatus = false;
      console.log(this.form);
      const mit = {
        scenicSpotId: this.form.optionsValue,
        sort: this.form.sort,
      };
      const param = mit;
      insertDestination(param).then((res) => {
        if (res.code == 200) {
          this.$message({ message: "添加成功!", type: "success" });
          this.destinationDate();
          this.getScenicSpot();
        }
      });
    },
    // 新增 =>弹框
    add() {
      this.form = {}
      this.addStatus = true;
    },
    getScenicSpot() {
      this.listLoading = true
      queryScenicSpotList().then((res) => {
        if ((res.code = 200)) {
          this.options = res.data;
          this.listLoading = false
        } else {
          this.$message(res.message);
        }
      });
    },
    // 删除商品
    remove(index, rows, e) {
      console.log(e);
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const qaram = {
            id: e.row.id,
          };
          delDestination(qaram).then((res) => {
            if ((res.code = 200)) {
              rows.splice(index, 1);
              this.$message.success("删除成功");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 商品重置按钮
    refresh() {
      (this.keyWord = ""),
        (this.startTime = ""),
        (this.endTime = ""),
        this.destinationDate();
    },
    onOptions(e) {
      const mit = this.options.filter((item) => item.id === e);
      console.log(mit);
      this.form.areaName = mit[0].areaName;
    },
    // 分页
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum; // 点击第几页
      console.log(pageNum);
      this.destinationDate();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize; // 每页下拉显示数据
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
