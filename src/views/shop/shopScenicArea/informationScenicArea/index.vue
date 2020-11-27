<template>
  <div class="box">
    <div class="head">
      <div class="head-left">
        <h3>{{ tableData.business.businessName }}</h3>
        <p class="time">入驻时间: {{ tableData.business.createTime }}</p>
      </div>
      <div class="head-right">
        <pan-thumb :image="'/api'+tableData.logo.url" :lazy="true" :no-rotate="false" />
        <el-button type="primary" size="mini" style="position: absolute;bottom: -30px;margin-left: 10px;" @click="imagecropperShow=true">上传Logo</el-button>
      </div>
    </div>
    <div class="content">
      <h4>入驻信息</h4>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">商家名称：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">{{ tableData.business.businessName }}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">法人姓名：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.business.corporationName }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">法人身份证：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">
            <div class="demo-image__preview">
              <el-image :lazy="true" style="width: 20px; height: 20px" :src="'/api'+tableData.business.idCard.url" :preview-src-list="['/api'+tableData.business.idCard.url]" />
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">营业执照：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">
            <div class="demo-image__preview">
              <el-image style="width: 20px; height: 20px" :src="'/api'+tableData.business.license.url" :preview-src-list="['/api'+tableData.business.license.url]" />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">联系电话：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">{{ tableData.business.businessPhone }}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">商家类型：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.business.businessType==0?'景区':'普通商家' }}</div>
        </el-col>
      </el-row>
      <h4 class="subtitle">基本信息</h4>
      <el-button class="editBtnText" size="mini" type="primary" @click="editInformation">编辑</el-button>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">咨询电话：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">{{ tableData.phone }}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">星级：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.starLevel }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">景区位置：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">{{ tableData.regionAreas.name }}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">景区地址：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.position }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">开放时间：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">{{ tableData.openTime }} - {{ tableData.closeTime }}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">支持服务：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.supportServer }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">简介：</div>
        </el-col>
        <el-col :span="7">
          <!-- <div class="grid-content bg-purple-light">{{ tableData.summary }}</div> -->
          <div class="grid-content bg-purple-light" v-html="tableData.summary" />
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">最大容量：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.dailyMaxLoadCapacity }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">最佳容量：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">{{ tableData.capacity }}</div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">瞬时最大容量:</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.instantMaxLoadCapacity }}</div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <div class="grid-content bg-purple">封面图：</div>
        </el-col>
        <el-col :span="7">
          <div class="grid-content bg-purple-light">
            <div class="demo-image__preview">
              <el-image style="width: 20px; height: 20px" :src="'/api'+tableData.cover.url" :preview-src-list="['/api'+tableData.cover.url]" />
            </div>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="grid-content bg-purple">提前预约天数：</div>
        </el-col>
        <el-col :span="8">
          <div class="grid-content bg-purple-light">{{ tableData.advanceAppointmentsDays }}</div>
        </el-col>
      </el-row>
      <!-- <h4 class="subtitle">图片信息(14)</h4>
      <el-table
        :header-cell-style="{background:'#dcdfe6'}"
        :data="tableData"
        border
        style="width: 100%"
      >
        <el-table-column prop="phone" label="咨询电话" width="120"></el-table-column>
        <el-table-column prop="starLevel" label="星级" width="80"></el-table-column>
        <el-table-column prop="name" label="景区位置" width="150"></el-table-column>
        <el-table-column prop="position" label="景区地址" width="180"></el-table-column>
        <el-table-column prop="openTime" label="开放时间" width="100"></el-table-column>
        <el-table-column prop="supportServer" label="支持服务" width="100"></el-table-column>
        <el-table-column prop="summary" label="简介" width="180"></el-table-column>
        <el-table-column prop="dailyMaxLoadCapacity" label="最大容量" width="100"></el-table-column>
        <el-table-column prop="capacity" label="最佳容量" width="80"></el-table-column>
        <el-table-column prop="advanceAppointmentsDays" label="提前预约天数"></el-table-column>
      </el-table> -->
      <h5 class="subtitle">图片信息</h5>
      <el-button class="addBtnImg" size="mini" type="primary" @click="addBanner">新增</el-button>
      <!-- <el-button class="editBtnImg" size="mini" type="primary" @click="editBanner">编辑</el-button> -->
      <div class="img">
        <ul v-if="tableData.pictureList.length>0">
          <li v-for="item in tableData.pictureList">
            <el-image style="width: 150px; height: 150px" :src="'/api'+item.url" :preview-src-list="['/api'+item.url]" />
            <div class="delImg">
              <el-link type="danger" @click="delImg(item)"><i class="el-icon-delete" />删除</el-link>
            </div>
          </li>

        </ul>
        <div v-else>
          暂无图片
        </div>
      </div>
      <h5 class="subtitle">视频信息</h5>
      <el-button class="addBtnImg" size="mini" type="primary" @click="addBannerVido">新增</el-button>
      <div class="img">
        <ul v-if="tableData.videoList.length>0">
          <li v-for="item in tableData.videoList">
            <el-image style="width: 150px; height: 150px" :src="'/api'+item.miniCoverUrl" @click="playVido(item)" />
            <!-- <video :src="'/api'+item.url" controls autoplay class="video" ref="dialogVideo" width="100%" @click="playVido(item)"></video> -->
            <div class="delImg">
              <el-link type="danger" @click="delImg(item)"><i class="el-icon-delete" />删除</el-link>
            </div>
          </li>
        </ul>
        <div v-else>
          暂无视频
        </div>
      </div>
    </div>
    <!-- 播放视频 -->
    <el-dialog title="播放视频" :visible.sync="dialogPlay" width="30%" @close="dialogPlay = false">
      <video ref="dialogVideo" :src="'/api'+videoUrl" controls class="video" />
    </el-dialog>
    <!-- 弹窗 ->编辑 -->
    <el-dialog title="编辑基本信息" :visible.sync="editInformationDialog" width="80%" @editOk="editOk()" >
      <temporary :information-date="tableData" :edit="true" />
    </el-dialog>
    <!-- 弹窗 ->新增banner -->
    <el-dialog title="新增图片" :visible.sync="addBannerDialog" width="50%">
      <el-form :model="form">

        <div class="editor-container">

          <el-upload ref="upload" class="upload-demo" list-type="picture-card" action :http-request="httpRequest" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="true" :on-success="onSuccess"><i class="el-icon-plus" />
            <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
            <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBannerDialog = false">取 消</el-button>
        <el-button type="primary" @click="addBannerNotarize">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗 ->新增视频 -->
    <el-dialog title="新增视频" :visible.sync="addBannerVidoDialog" width="50%">
      <el-form :model="form">
        <el-form-item label-width="120px">
          <div class="editor-container">
            <el-upload ref="upload" class="upload-demo" list-type="picture-card" action :http-request="httpRequest" :on-preview="handlePreview" :on-remove="handleRemove" :file-list="fileList" :auto-upload="true" :on-success="onSuccess"><i class="el-icon-plus" />
              <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
              <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addBannerVidoDialog = false">取 消</el-button>
        <el-button type="primary" @click="addBanVido">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传logo弹窗 -->
    <image-cropper v-show="imagecropperShow" :key="imagecropperKey" :width="300" :height="300" url="/fileManage/v1/insert/upload" lang-type="zh" field="file" @close="close" @crop-upload-success="cropSuccess" />
  </div>
</template>

<script>
import { upfiles } from '@/utils/temporary/temporary'
// import Dropzone from '@/components/Upload'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'
import temporary from '@/views/temporary/index'
// import slectPoint from '@/components/slectPoint/index'
import {
  getSpotinfo,
  uploadPictures,
  delPictures,
  uploadVideos,
  changeLogoPicture
} from '@/utils/temporary/temporary'
export default {
  name: 'AvatarUploadDemo',
  components: { ImageCropper, PanThumb, temporary },
  data() {
    return {
      fileList: [],
      // Logo弹框
      imagecropperShow: false,
      imagecropperKey: 0,
      videoUrl: '',
      dialogPlay: false,
      // logo
      image:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      editInformationDialog: false, // 编辑信息弹框
      addBannerDialog: false, // 新增banner的弹框
      addBannerVidoDialog: false, // 编辑banner的弹框
      // 星级
      starLevelValue: '',
      // 位置
      locationValue: '',
      time: '2020/9/22',
      url:
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
      srcList: [
        'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
      ],
      tableData: [

      ],
      form: {
        name: '',
        region: ''
      },
      starLevel: [
        {
          value: 'A',
          label: 'A'
        },
        {
          value: 'AA',
          label: 'AA'
        },
        {
          value: 'AAA',
          label: 'AAA'
        },
        {
          value: 'AAAA',
          label: 'AAAA'
        }
      ],
      location: [
        {
          value: '城中区',
          label: '城中区'
        },
        {
          value: '柳南区',
          label: '柳南区'
        },
        {
          value: '柳北区',
          label: '柳北区'
        },
        {
          value: '鱼峰区',
          label: '鱼峰区'
        }
      ]
    }
  },
  mounted() {
    console.log(this.$route.query.id)
    this.getStore(this.$route.query.id)
  },
  methods: {
    editOk($event,userDefined){
      console.log(userDefined);
    },
    playVido(e) {
      this.videoUrl = e.url
      this.dialogPlay = true
    },
    getStore(e) {
      if (e) {
        const params = {
          businessId: e
        }
        getSpotinfo(params).then((res) => {
          if ((res.code = 200)) {
            console.log(this.tableData)
            this.tableData = res.data
          }
        })
      }
    },
    // 编辑banner -发送请求
    editBannerNotarize() {
      this.addBannerVidoDialog = false
    },
    // 编辑banner
    editBanner() {
      this.addBannerVidoDialog = true
    },
    // logo上传成功后执行
    cropSuccess(resData) {
      const params = {
        fileIds: resData.id,
        scenicSpotId: this.tableData.id
      }
      changeLogoPicture(params).then(res => {
        if (res.code == 200) {
          this.imagecropperShow = false
          this.tableData.logo.url = resData.url
          this.$message({ message: '修改成功！', type: 'success' })
        }
      })
      // this.imagecropperKey = this.imagecropperKey + 1
    },
    close() {
      this.imagecropperShow = false
    },
    delImg(e) {
      console.log(e)
      const params = {
        fileManageId: e.id,
        scenicSpotId: this.tableData.id
      }
      delPictures(params).then((res) => {
        if (res.code == 200) {
          this.getStore(this.$route.query.id)
          this.$message({ message: '删除成功！', type: 'success' })
        }
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
    // 新增banner
    addBanner() {
      this.addBannerDialog = true
    },
    addBannerVido() {
      this.addBannerVidoDialog = true
    },
    // 新增banner 发送请求
    addBannerNotarize() {
      // this.$refs.upload.submit();
      const params = {
        scenicSpotId: this.tableData.id,
        fileIds: this.fileList
      }
      uploadPictures(params).then((res) => {
        if (res.code = 200) {
          this.$message({ message: '成功！', type: 'success' })
          this.fileList = []
          this.getStore(this.$route.query.id)
          this.addBannerDialog = false
        }
      })
    },
    addBanVido() {
      const params = {
        scenicSpotId: this.tableData.id,
        fileIds: this.fileList
      }
      console.log(this.fileList, 'this.fileList')
      uploadVideos(params).then((res) => {
        if (res.code = 200) {
          this.$message({ message: '成功！', type: 'success' })
          this.fileList = []
          this.getStore(this.$route.query.id)
          this.addBannerVidoDialog = false
        }
      })
    },
    onSuccess(response, file, fileList) {
      console.log(response, file, fileList)
      this.fileList.push(response.id)
    },

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    // 编辑信息页面弹窗
    editInformation() {
      this.editInformationDialog = true
    },
    // 编辑发送请求
    editInformationNotarize() {
      this.editInformationDialog = false
      console.log('成功')
    },
    httpRequest(content) {
      const { file } = content
      const formData = new FormData()
      formData.append('file', file)
      upfiles(formData)
        .then((res) => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1000
          })
          content.onSuccess(res.data)
        })
        .catch((err) => {
          content.onError(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
li {
  padding: 0;
  margin: 0;
}
.box {
  width: 100%;
  height: 100%;
  overflow-y:auto;
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
    h4 {
      margin-left: 20px;
    }
    .editBtnText {
      float: right;
      margin-top: -40px;
      margin-right: 10px;
    }
    .addBtnImg {
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
        list-style: none;
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
  .el-col {
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
.delImg {
  text-align: center;
  line-height: 30px;
}
.video{
  // height: 30vh;
}
</style>
