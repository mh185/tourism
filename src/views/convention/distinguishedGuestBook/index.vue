<template>
  <el-card>
    <div class="block">
      <el-date-picker
        v-model="startTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布开始时间"
      />
      <el-date-picker
        v-model="endTime"
        type="datetime"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="发布结束时间"
      />
    </div>
    <el-button class="queryBtn" type="primary" icon="el-icon-search" @click="query">查询</el-button>
    <el-button class="queryBtn" icon="el-icon-refresh" @click="refresh">重置</el-button>
    <el-button
      class="addBtn"
      type="primary"
      @click="add"
    >新增特邀嘉宾手册</el-button>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="informationList"
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#dcdfe6' }"
      class="table"
      height="480px"
    >
      <el-table-column type="index" label="序号" />
      <el-table-column prop="coverUrl" label="图片">
        <template slot-scope="scope">
          <el-image
            style="width: 50px; height: 50px"
            :src="urlbanner + scope.row.fileUrl"
            :preview-src-list="[urlbanner + scope.row.fileUrl]"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="sort"
        label="排序"
      />
      <!-- <el-table-column
        prop="status"
        label="发布人"
      ></el-table-column> -->
      <el-table-column
        prop="createTime"
        label="发布时间"
      />
      <el-table-column prop="status" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="edit(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="remove(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <el-pagination
      class="page"
      :current-page="pageNum"
      :page-sizes="[4, 6, 8, 10]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    /> -->
    <!-- 弹窗 ->新增 -->
    <el-dialog title="新增会务手册" :visible.sync="addStatus" width="50%">
      <el-form v-if="addStatus" :model="form">
        <el-form-item label="图片：" label-width="120px">
          <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
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
    <!-- 弹窗 ->编辑 -->
    <el-dialog title="编辑会务手册" :visible.sync="editStatus" width="50%">
      <el-form v-if="editStatus" :model="form">
        <el-form-item label="图片：" label-width="120px">
          <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
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
        <el-button @click="editStatus = false">取 消</el-button>
        <el-button type="primary" @click="editAscertain">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Upload from '@/components/Upload/image-upload'
import { getMeetingManual, update, deleteId, insert } from '@/api/distinguishedGuestBook'
export default {
  components: { Upload },
  data() {
    return {
      urlbanner: '/api',
      coverFile: [],
      addStatus: false, // 新增
      editStatus: false, // 编辑
      startTime: '',
      endTime: '',
      total: 100, // 总条数默认给100
      pageSize: 1,
      pageNum: 1, // 当前页数
      activeName: 'first',
      form: {},
      informationList: []
    }
  },
  created() {
    this.getList()
  },
  methods: {
    coverFileChange(file, flieList) {
      if (flieList.length) {
        const id = flieList[0].response && flieList[0].response.id
        this.form.coverId = id
      } else {
        this.form.coverId = ''
      }
    },
    query() {
      this.getList()
    },
    // 编辑 - 发送请求
    editAscertain() {
      const data = {
        fileId: this.form.coverId,
        sort: this.form.sort,
        id: this.form.id
      }
      update(data).then(res => {
        this.$message.success(res.message)
        this.getList()
      })
      this.editStatus = false
    },
    // 编辑 - 弹框
    edit(List) {
      this.form = List
      this.coverFile = [{ url: this.urlbanner + List.fileUrl }]
      this.editStatus = true
    },
    // 获取列表
    getList() {
      this.listLoading = true
      getMeetingManual().then(res => {
        this.informationList = res.data
        this.listLoading = false
      })
    },
    // 图片上传
    // 上传成功后执行
    dropzoneR(file) {
      console.log(file)
      this.$message({ message: 'Upload success', type: 'success' })
    },
    // 删除图片后执行
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
    },
    // 新增 - 发送请求
    addAscertain() {
      const data = {
        fileId: this.form.coverId,
        sort: this.form.sort
      }
      insert(data).then(res => {
        this.getList()
      })
      this.addStatus = false
    },
    // 新增 - 弹框
    add() {
      this.form = {}
      this.coverFile = []
      this.addStatus = true
    },
    // 删除商品
    remove(idBook) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const params = {
            id: idBook
          }
          deleteId(params).then(res => {
            this.getList()
          })
          this.$message.success('删除成功')
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 商品重置按钮
    refresh() {
      this.strarTime = ''
      this.endTime = ''
      this.getList()
    },
    // 分页
    handleCurrentChange(pageNum) {
      console.log(`当前页: ${pageNum}`)
      this.pageNum = pageNum
      this.getList()
    },
    handleSizeChange(pageSize) {
      console.log(`每页 ${pageSize} 条`)
      this.pageSize = pageSize
      this.pageNum = 1
      this.getList()
    },
    handleClick(tab, event) {
      console.log(tab, event)
    }
  }
}
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
  margin-bottom: 15px;
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
.addBtn {
  float: right;
  margin-right: 50px;
}
.block {
  float: left;
}
</style>
