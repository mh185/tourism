<template>
  <div class="box">
    <div class="head">
      <div class="head-left">
        <h3>柳州畅游旅行社有限公司</h3>
        <p class="time">入驻时间: {{time}}</p>
      </div>
      <div class="head-right">
        <pan-thumb :image="image" />
        <el-button
          type="primary"
          size="mini"
          style="position: absolute;bottom: -30px;margin-left: 10px;"
          @click="imagecropperShow=true"
        >上传Logo</el-button>
      </div>
    </div>
    <div class="content">
      <h5>入驻信息</h5>
      <el-row>
       <el-col :span="4"><div class="grid-content bg-purple">商家名称：</div></el-col>
       <el-col :span="7"><div class="grid-content bg-purple-light">白莲洞风景区</div></el-col>
       <el-col :span="4"><div class="grid-content bg-purple">法人姓名：</div></el-col>
       <el-col :span="8"><div class="grid-content bg-purple-light">张大大</div></el-col>
      </el-row>
      <el-row>
       <el-col :span="4"><div class="grid-content bg-purple">法人身份证：</div></el-col>
       <el-col :span="7"><div class="grid-content bg-purple-light">
         <div class="demo-image__preview">
          <el-image 
            style="width: 20px; height: 20px"
            :src="url" 
            :preview-src-list="srcList">
          </el-image>
         </div>
         </div>
       </el-col>
       <el-col :span="4"><div class="grid-content bg-purple">营业执照：</div></el-col>
       <el-col :span="8"><div class="grid-content bg-purple-light">
         <div class="demo-image__preview">
          <el-image 
            style="width: 20px; height: 20px"
            :src="url" 
            :preview-src-list="srcList">
          </el-image>
         </div>
         </div>
        </el-col>
      </el-row>
      <el-row>
       <el-col :span="4"><div class="grid-content bg-purple">联系电话：</div></el-col>
       <el-col :span="7"><div class="grid-content bg-purple-light">18899990000</div></el-col>
       <el-col :span="4"><div class="grid-content bg-purple">商家类型：</div></el-col>
       <el-col :span="8"><div class="grid-content bg-purple-light">旅行社</div></el-col>
      </el-row>
      <h5 class="subtitle">基本信息</h5>
      <el-button class="editBtnText" size="mini" type="primary" @click="editInformation">编辑</el-button>
      <el-row>
       <el-col :span="4"><div class="grid-content bg-purple">咨询电话：</div></el-col>
       <el-col :span="7"><div class="grid-content bg-purple-light">18877766667</div></el-col>
       <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
       <el-col :span="8"><div class="grid-content bg-purple-light"></div></el-col>
      </el-row>
      <h5 class="subtitle">banner图</h5>
      <el-button class="editBtnImg" size="mini" type="primary" @click="addBanner">新增</el-button>
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
        <el-table-column prop="jurisdiction" label="banner名称" width="150"></el-table-column>
        <el-table-column prop="jurisdiction" label="位置"></el-table-column>
        <el-table-column label="图片">
          <el-image style="width: 50px; height: 50px" :src="url" :preview-src-list="srcList"></el-image>
        </el-table-column>
        <el-table-column prop="status" label="跳转链接" width="150"></el-table-column>
        <el-table-column prop="status" label="排序" width="150"></el-table-column>
        <el-table-column prop="status" label="发布人" width="150"></el-table-column>
        <el-table-column prop="status" label="发布时间" width="150"></el-table-column>
        <el-table-column prop="status" label="操作" width="150">
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
      <!-- 上传logo弹窗 -->
      <image-cropper
        v-show="imagecropperShow"
        :key="imagecropperKey"
        :width="300"
        :height="300"
        url="https://httpbin.org/post"
        lang-type="zh"
        @close="close"
        @crop-upload-success="cropSuccess"
      />
      <!-- 弹窗 ->新增banner -->
      <el-dialog title="新增banner" :visible.sync="addBannerDialog" width="50%">
        <el-form :model="form">
          <el-form-item label="banner名称" label-width="120px">
            <el-input v-model="form.fullName" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="排序" label-width="120px">
            <el-input v-model="form.fullName" clearable placeholder="请输入数字，数字越大，顺序越后"></el-input>
          </el-form-item>
          <el-form-item label="跳转链接" label-width="120px">
            <el-input v-model="form.fullName" clearable placeholder="不输入跳转链接，点击图片后不跳转"></el-input>
          </el-form-item>
          <el-form-item label="图片" label-width="120px">
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
          <el-button @click="addBannerDialog = false">取 消</el-button>
          <el-button type="primary" @click="addBannerNotarize">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 弹窗 ->编辑 -->
      <el-dialog title="编辑基本信息" :visible.sync="editInformationDialog" width="50%">
        <el-form :model="form">
          <el-form-item label="咨询电话" label-width="120px">
            <el-input v-model="form.name" clearable></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editInformationDialog = false">取 消</el-button>
          <el-button type="primary" @click="editInformationNotarize">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Dropzone from "@/components/Upload";
import ImageCropper from "@/components/ImageCropper";
import PanThumb from "@/components/PanThumb";
export default {
  name: "DropzoneDemo",
  name: "AvatarUploadDemo",
  components: { Dropzone, ImageCropper, PanThumb },
  data() {
    return {
      //新增banner
      addBannerDialog: false,
      //Logo弹框
      imagecropperShow: false,
      editInformationDialog: false, //编辑弹框
      imagecropperKey: 0,
      // logo
      image:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      total: 100, //总条数默认给100
      pageSize: 1,
      pageNum: 1, //当前页数
      time: "2020/9/22",
      url:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      srcList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      ],
      form: {
        name: "",
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
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
    //编辑信息 -发送请求
    editInformationNotarize() {
      this.editInformationDialog = false;
    },
    //编辑信息 -弹框
    editInformation() {
      this.editInformationDialog = true;
    },
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
    //新增banner
    addBanner() {
      this.addBannerDialog = true;
    },
    //新增banner 发送请求
    addBannerNotarize() {
      this.addBannerDialog = false;
    },
    cropSuccess(resData) {
      this.imagecropperShow = false;
      this.imagecropperKey = this.imagecropperKey + 1;
      this.image = resData.files.avatar;
    },
    close() {
      this.imagecropperShow = false;
    },
    //删除banner
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
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
  display: inline;
}
.box {
  width: 100%;
  .head {
    width: 100%;
    height: 120px;
    position: relative;
    .head-left {
      width: 20%;
      height: 120px;
      padding-top: 10px;
      padding-left: 20px;
      .time {
        font-size: 12px;
      }
    }
    .head-right {
      width: 15%;
      height: 120px;
      position: absolute;
      top: 20px;
      right: 100px;
      .handImg {
        margin-top: 10px;
        border-radius: 20%;
        .imgLogo {
          border-radius: 50%;
        }
      }
    }
  }
  .content {
    width: 100%;
    padding-top: 10px;
    padding-left: 20px;
    // background-color: red;
    h5 {
      margin-left: 20px;
    }
    .editBtnText {
      float: right;
      margin-top: -40px;
      margin-right: 10px;
    }
    .editBtnImg {
      float: right;
      margin-top: -40px;
      margin-right: 10px;
    }
    .img {
      width: 100%;
      ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        li {
          margin: 15px;
        }
      }
    }
    .subtitle {
      margin-top: 50px;
    }
  }
}
.el-row {
    &:last-child {
      margin-bottom: 0;
    }
    .el-col{
      border: 1px solid #99a9bf;
    }
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
    text-align: center;
    padding-top: 10px;
    font-weight: bold;
  }
  .bg-purple-light {
    padding-top: 10px;
    padding-left: 10px;
  }
  .grid-content {
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>