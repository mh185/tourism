/* eslint-disable no-sequences */
<template>
  <el-card>
    <!-- 状态选择器 -->
    <el-select v-model="status" clearable placeholder="请选择状态">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <el-date-picker
      v-model="publishTime"
      class="time"
      type="datetime"
      placeholder="发布时间"
      value-format="yyyy-MM-dd HH:mm:ss"
    />
    <el-date-picker
      v-model="auditTime"
      class="time"
      type="datetime"
      placeholder="审核时间"
      value-format="yyyy-MM-dd HH:mm:ss"
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
      @click="onQuery"
    >查询</el-button>
    <el-button
      class="queryBtn"
      icon="el-icon-refresh"
      @click="refresh"
    >重置</el-button>
    <!-- 表格 -->
    <el-table
      :data="commentModerationList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column
        prop="businessName"
        label="商家名称"
        width="180"
      />
      <el-table-column prop="businessType" label="商家类型" />
      <el-table-column prop="businessPhone" label="联系电话" />
      <el-table-column
        prop="createTime"
        label="申请时间"
        width="150"
      />
      <el-table-column prop="reviewStatus" label="状态" width="150">
        <template slot-scope="scope">
          <el-tag
            type="success"
            size="mini"
          >{{ scope.row.reviewStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="reviewTime"
        label="审核时间"
        width="150"
      />
      <el-table-column label="操作" width="300" prop="reviewStatusCode">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="toExamine = true"
          >查看</el-button>
          <el-button
            v-if="!scope.row.reviewStatusCode"
            type="warning"
            size="mini"
            @click="passVisible = true"
          >通过</el-button>
          <el-button
            v-if="!scope.row.reviewStatusCode"
            type="danger"
            size="mini"
            @click="failVisible = true"
          >拒绝</el-button>

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
    <!-- 弹窗审核 -->
    <el-dialog title=" 商家入驻审核" :visible.sync="toExamine" width="950px">
      <!-- 待审核状态 -->
      <el-row>
        <el-col :span="24">
          <div class="first">
            <div class="left">
              <div class="circle" />
              <p>待审核</p>
            </div>
            <div class="right">
              <el-button
                type="primary"
                @click="passVisible = true"
              >√ 通过</el-button>
              <el-button
                type="danger"
                @click="failVisible = true"
              >× 拒绝</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 已通过状态 -->
      <el-row>
        <el-col :span="24">
          <div class="first">
            <div class="left">
              <div class="passCircle" />
              <p>已通过</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <!-- 已拒绝状态 -->
      <el-row>
        <el-col :span="24">
          <div class="first">
            <div class="left">
              <div class="deleteCircle" />
              <p>已拒绝</p>
            </div>
          </div>
        </el-col>
      </el-row>
      <div class="second">
        <p class="mainTitle">基本信息</p>
        <!-- 审核状态 -->
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple"><span>申请用户：</span></div>
          </el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>用户的手机号</span>
          </div></el-col>
          <el-col
            :span="3"
          ><div class="grid-content bg-purple">
            <span>申请时间：</span>
          </div></el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>2020-01-01 12:34</span>
          </div></el-col>
        </el-row>
        <!-- 通过状态 -->
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple"><span>审核人：</span></div>
          </el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>张三</span>
          </div></el-col>
          <el-col
            :span="3"
          ><div class="grid-content bg-purple">
            <span>审核时间：</span>
          </div></el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>2020-01-01 12:34</span>
          </div></el-col>
        </el-row>
      </div>
      <div class="three">
        <p class="mainTitle">入驻信息</p>
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple"><span>商家名称：</span></div>
          </el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>白莲洞风景区</span>
          </div></el-col>
          <el-col
            :span="3"
          ><div class="grid-content bg-purple">
            <span>法人姓名：</span>
          </div></el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>张大大</span>
          </div></el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple"><span>法人身份证：</span></div>
          </el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span /></div></el-col>
          <el-col
            :span="3"
          ><div class="grid-content bg-purple">
            <span>营业执照：</span>
          </div></el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span /></div></el-col>
        </el-row>
        <el-row>
          <el-col :span="3">
            <div class="grid-content bg-purple"><span>联系电话：</span></div>
          </el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>18899990000</span>
          </div></el-col>
          <el-col
            :span="3"
          ><div class="grid-content bg-purple">
            <span>商家类型：</span>
          </div></el-col>
          <el-col
            :span="9"
          ><div class="grid-content bg-purple-light">
            <span>景区</span>
          </div></el-col>
        </el-row>
      </div>
      <div class="four">
        <p class="mainTitle">审核动态</p>
        <div class="footer">
          <div style="height: 380px" class="step">
            <el-steps direction="vertical" :active="1">
              <el-step />
              <el-step />
              <el-step />
              <el-step />
            </el-steps>
          </div>
          <div class="content">
            <div class="cont-title">
              <p>赵小刚</p>
              <p class="timeOut">2019-03-23 22:31</p>
            </div>
            <div>
              <p class="describe">
                审核已通过，备注信息：备注信息有就显示，没有就不显示
              </p>
            </div>
          </div>
          <div class="content">
            <div class="cont-title">
              <p>赵小刚</p>
              <p class="timeOut">2019-03-23 22:31</p>
            </div>
            <div>
              <p class="describe">提交审核</p>
            </div>
          </div>
          <div class="content">
            <div class="cont-title">
              <p>赵小刚</p>
              <p class="timeOut">2019-03-23 22:31</p>
            </div>
            <div>
              <p class="describe">
                审核已拒绝，拒绝原因：信息有误，请修改填写提交
              </p>
            </div>
          </div>
          <div class="content">
            <div class="cont-title">
              <p>赵小刚</p>
              <p class="timeOut">2019-03-23 22:31</p>
            </div>
            <div>
              <p class="describe">提交审核</p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 点击通过的弹窗 -->
    <el-dialog title="审核通过" :visible.sync="passVisible" width="30%" center>
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="10"
        placeholder="请输入备注信息，选填"
        maxlength="300"
        show-word-limit
        class="txtArea"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="passVisible = false">取 消</el-button>
        <el-button type="primary" @click="passVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 点击拒绝的弹窗 -->
    <el-dialog title="审核拒绝" :visible.sync="failVisible" width="30%" center>
      <el-input
        v-model="textarea"
        type="textarea"
        :rows="10"
        placeholder="请填写否决申请原因，必填"
        maxlength="300"
        show-word-limit
        class="txtArea"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="failVisible = false">取 消</el-button>
        <el-button type="primary" @click="failVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import { queryVerifyInfo } from '@/api/merchantAudit/index'
export default {
  data() {
    return {
      dialogTableVisible: false,
      passVisible: false,
      failVisible: false,
      toExamine: false,
      textarea: '',
      form: {
        name: '123',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '120px',
      publishTime: '', // 查询发布时间
      auditTime: '', // 查询审核时间
      input: '',
      total: 100, // 总条数默认给100
      pageSize: 10,
      pageNum: 1, // 当前页数
      activeName: 'first',
      keyWord: '', // 搜索关键字
      // 状态选择器
      status: '',
      // form: {
      //   name: '',
      //   fullName: ''
      // },
      options: [
        {
          value: '0',
          label: '待审核'
        },
        {
          value: '1',
          label: '已通过'
        },
        {
          value: '2',
          label: '已拒绝'
        }
      ],
      commentModerationList: [
        {
          rolesName: '小房间',
          explain: '',
          jurisdiction: '20',
          createTime: '3',
          status: true,
          img: ''
        },
        {
          rolesName: '大房间',
          explain: '',
          jurisdiction: '80',
          createTime: '5',
          status: false
        },
        {
          rolesName: '大房间',
          explain: '',
          jurisdiction: '80',
          createTime: '5',
          status: false
        }
      ]

    }
  },
  mounted() {
    this.getVerifyInfo()// 获取列表
  },
  methods: {
    onQuery() {
      this.getVerifyInfo()
    },
    getVerifyInfo() {
      console.log(this.publishTime, this.auditTime, '2333')
      const mit = {}
      if (this.status != '') {
        mit.accountStatus = this.status
      }
      if (this.publishTime != '') {
        mit.createTime = this.publishTime
      }
      if (this.auditTime != '') {
        mit.reviewTime = this.auditTime
      }
      if (this.keyWord != '') {
        mit.keyWord = this.keyWord
      }
      const da = {
        businessVerifyVO: mit
      }
      const param = {
        page: this.pageNum,
        size: this.pageSize
      }
      queryVerifyInfo(param, da).then(res => {
        console.log(res, 'sssss')
        if (res.code = 200) {
          this.commentModerationList = res.data.rows
          this.total = res.data.total
        }
      })
    },
    // 商品重置按钮
    refresh() {
      // eslint-disable-next-line no-sequences
      (this.status = ''),
      (this.input = ''),
      (this.publishTime = ''),
      (this.auditTime = '')
    },
    // 分页
    handleCurrentChange(pageNum) {
      this.pageNum = pageNum // 点击第几页
      console.log(pageNum)
      // this.getUserList();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize // 每页下拉显示数据
      // console.log(pageSize)
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  line-height: 36px;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #f5f5f5;
}
.bg-purple {
  background: #f5f5f5;
  text-align: center;
}
.bg-purple-light {
  background: #ffffff;
}
.bg-purple span {
  font-family: "微软雅黑 Bold", "微软雅黑", sans-serif;
  font-weight: 700;
  font-style: normal;
  font-size: 12px;
}
.bg-purple-light span {
  margin-left: 12px;
  font-family: "Microsoft YaHei ", "Microsoft YaHei", sans-serif;
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  color: rgba(51, 51, 51, 0.996078431372549);
}
.grid-content {
  min-height: 36px;
  border: 1px solid #cccccc;
}
.row-bg {
  padding: 10px 0;
  background-color: #ffffff;
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
.first {
  display: flex;
  justify-content: space-between;
  border: 1px solid #cccccc;
  align-items: center;
  padding: 16px;
  .left {
    display: flex;
    align-items: center;
  }
  .circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #0079fe;
    margin-right: 4px;
  }
}
.mainTitle {
  font-style: normal;
  font-size: 13px;
  letter-spacing: normal;
  color: #333333;
  font-family: "微软雅黑 Bold", "微软雅黑", sans-serif;
  font-weight: 700;
}
.footer {
  width: 910px;
  min-height: 560px;
  border: 1px solid #cccccc;
}
.step {
  margin-top: 60px;
  margin-left: 20px;
  margin-right: 20px;
  float: left;
}
.content {
  background: #f7fbfe;
  border: 1px solid #d7e8f4;
  width: 774px;
  height: 100px;
  float: right;
  margin-right: 60px;
  margin-top: 20px;
}
.cont-title {
  margin: 4px 16px 10px 16px;
  display: flex;
  justify-content: space-between;
}
.timeOut {
  font-size: 12px;
  color: #999999;
  text-align: right;
  line-height: 28px;
  font-family: "微软雅黑", sans-serif;
  font-weight: 400;
}
.describe {
  font-family: "微软雅黑 Regular", "微软雅黑", sans-serif;
  font-weight: 400;
  font-style: normal;
  color: #999999;
  text-align: left;
  line-height: 22px;
  font-size: 13px;
  margin-left: 16px;
}
.passCircle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #70b603;
  margin-right: 4px;
}
.deleteCircle {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d9001b;
  margin-right: 4px;
}
</style>
