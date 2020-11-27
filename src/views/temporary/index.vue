<template>
  <div class="temporary">
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="120px" class="demo-ruleForm">
      <el-form-item label="景区名称" prop="name">
        <el-input v-model="ruleForm.name" />
      </el-form-item>
      <el-form-item label="景区星级" prop="starLevel">
        <el-input v-model="ruleForm.starLevel" />
      </el-form-item>
      <el-form-item label="景区简介">
        <!-- <tinymce v-model="ruleForm.summary" :height="300" /> -->
        <quill-editor v-model="ruleForm.summary" :options="editorOption" />
      </el-form-item>
      <el-form-item label="景区联系电话" prop="phone">
        <el-input v-model="ruleForm.phone" />
      </el-form-item>
      <el-form-item label="景区详细位置" prop="position">
        <el-input v-model="ruleForm.position" />
      </el-form-item>
      <el-form-item label="景区所在区县信息系统标识" prop="regionAreasId">
        <el-select v-model="ruleForm.regionAreasId" placeholder="请选择活动区域">
          <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="支持服务" prop="supportServer">
        <el-input v-model="ruleForm.supportServer" />
      </el-form-item>
      <el-form-item label="预约电话" prop="orderPhone">
        <el-input v-model="ruleForm.orderPhone" />
      </el-form-item>
      <el-form-item label="出行方式">
        <!-- <div id="tripMode">
          <div ref="tripMode" v-html="ruleForm.tripMode " />
        </div> -->
        <!-- <tinymce v-model="ruleForm.tripMode" :height="300" /> -->
        <quill-editor v-model="ruleForm.tripMode" :options="editorOption" />
      </el-form-item>
      <el-form-item label="对接景区客流量分析接口的景区标识" prop="orderScenicSpotId">
        <el-input v-model="ruleForm.orderScenicSpotId" />
      </el-form-item>
      <el-form-item label="手绘地图缩略图id">
        旧手绘地图缩略图：
        <el-image v-if="isedit" style="width: 150px; height: 150px" :src="ruleForm.miniHandDrawing?'/api'+ruleForm.miniHandDrawing.url:''" />
        <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (ruleForm.miniHandDrawingId = res.id)">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item v-if="!isedit" label="营业执照id">

        <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (ruleForm.licenseId = res.id)">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="!isedit" label="logo图片id">
        <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (ruleForm.logoId = res.id)">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="提前预约天数" prop="advanceAppointmentsDays">
        <el-input v-model="ruleForm.advanceAppointmentsDays" />
      </el-form-item>
      <el-form-item label="人均单价" prop="avgPrice">
        <el-input v-model="ruleForm.avgPrice" />
      </el-form-item>
      <el-form-item v-if="!isedit" label="商家名称" prop="businessName">
        <el-input v-model="ruleForm.businessName" />
      </el-form-item>
      <el-form-item v-if="!isedit" label="商家电话" prop="businessPhone">
        <el-input v-model="ruleForm.businessPhone" />
      </el-form-item>
      <el-form-item label="景区最佳容量数" prop="capacity">
        <el-input v-model="ruleForm.capacity" />
      </el-form-item>
      <el-form-item v-if="!isedit" label="法人姓名" prop="corporationName">
        <el-input v-model="ruleForm.corporationName" />
      </el-form-item>
      <el-form-item label="封面图片id">
        旧封面图片：
        <el-image v-if="isedit" style="width: 150px; height: 150px" :src="ruleForm.cover?'/api'+ruleForm.cover.url:''" />
        <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (ruleForm.coverId = res.id)">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="日最大承载量" prop="dailyMaxLoadCapacity">
        <el-input v-model="ruleForm.dailyMaxLoadCapacity" />
      </el-form-item>
      <el-form-item label="景区详细介绍">
        <!-- <el-input v-model="ruleForm.description" type="textarea" /> -->
        <!-- <vueUeditorWrap v-model="ruleForm.description" :config="editorConfig" /> -->
        <!-- <div id="description">
          <div ref="description" v-html="ruleForm.description" />
        </div> -->
        <!-- <tinymce v-model="ruleForm.description" :height="300" /> -->
        <quill-editor v-model="ruleForm.description" :options="editorOption" />
      </el-form-item>
      <el-form-item label="手绘地图id">
        旧手绘地图：
        <el-image v-if="isedit" style="width: 150px; height: 150px" :src="ruleForm.handDrawing?'/api'+ruleForm.handDrawing.url:''" />
        <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (ruleForm.handDrawingId = res.id)">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="!isedit" label="身份证正面id">

        <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (ruleForm.idCardId = res.id)">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="!isedit" label="身份证反面id">

        <el-upload class="upload-demo" drag action multiple :http-request="httpRequest" :on-success="(res) => (ruleForm.idCardReverseId = res.id)">
          <i class="el-icon-upload" />
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>

      <el-form-item label="瞬时最大承载量" prop="instantMaxLoadCapacity">
        <el-input v-model="ruleForm.instantMaxLoadCapacity" />
      </el-form-item>
      <!-- <el-form-item label="是否开放" prop="delivery">
        <el-switch v-model="ruleForm.isOpen"></el-switch>
      </el-form-item> -->
      <el-form-item label="景区经纬度">
        <el-input v-model="ruleForm.lat" placeholder="经度" />
        <el-input v-model="ruleForm.lon" placeholder="纬度" />
        <el-button style="margin-top:10px" type="primary" plain @click="onClick">查找经纬度</el-button>
      </el-form-item>
      <el-form-item label="开放时间" prop="openTime">
        <el-col :span="11">
          <el-form-item>
            <el-time-picker v-model="ruleForm.openTime" placeholder="选择开始时间" style="width: 100%" format="HH:mm" value-format="HH:mm" />
          </el-form-item>
        </el-col>
        <el-col style="padding-left:32px" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="closeTime">
            <el-time-picker v-model="ruleForm.closeTime" placeholder="选择结束时间" style="width: 100%" format="HH:mm" value-format="HH:mm" />
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button v-if="!isedit" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button v-else type="primary" @click="editForm('ruleForm')">立即修改</el-button>
        <el-button v-if="!isedit" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="查找景区经纬度" :visible.sync="dialogVisible" width="750px" :before-close="handleClose">
      <slectPoint @mapclick="pointChange" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!-- <slectPoint :inputDefault="form.address" :oldMarker="oldMarker" @mapclick="pointChange"
                 @addr="addrChange" ref="mapsec"></slectPoint> -->
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { getToken } from '@/utils/auth'
// import vueUeditorWrap from 'vue-ueditor-wrap'
import slectPoint from '@/components/slectPoint/index'
// import Dropzone from '@/components/Upload'
import moment from 'moment'
import {
  getCityCode,
  insertScenic,
  upfiles,
  updateScenic
} from '../../utils/temporary/temporary'
import { array } from 'jszip/lib/support'
export default {
  components: {
    slectPoint,
    quillEditor,
    quillRedefine
  },
  filters: {
    datefilter(e) {
      return moment(e).format('LTS')
    }
  },
  props: {
    informationDate: {
      default: {}
    },
    edit: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      dialogVisible: false,
      cityCode: '450200', // 柳州市code
      cityList: [], // 区县集合
      ruleForm: {},
      msg: false,
      isedit: false,
      descriptionContent: '',
      tripModeContent: '',
      summaryContent: '',
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        starLevel: [
          { required: true, message: '请输入景区星级', trigger: 'blur' }
        ],
        // summary: [
        //   { required: true, message: '请输入景区简介', trigger: 'blur' }
        // ],
        phone: [
          { required: true, message: '请输入景区联系电话', trigger: 'blur' }
        ],
        position: [
          { required: true, message: '请输入景区详细地址', trigger: 'blur' }
        ],
        regionAreasId: [
          { required: true, message: '请输入景区所在区县', trigger: 'blur' }
        ],
        supportServer: [
          { required: true, message: '请输入景区服务', trigger: 'blur' }
        ],
        supportServer: [
          { required: true, message: '请输入景区支持服务', trigger: 'blur' }
        ],
        // tripMode: [
        //   { required: true, message: '请输入景区出行方式', trigger: 'blur' }
        // ],
        orderScenicSpotId: [
          {
            required: true,
            message: '请输入对接景区预约接口的景区id',
            trigger: 'blur'
          }
        ],
        advanceAppointmentsDays: [
          { required: true, message: '请输入提前预约天数', trigger: 'change' }
        ],
        avgPrice: [
          { required: true, message: '请输入人均单价', trigger: 'change' }
        ],
        businessName: [
          { required: true, message: '请输入商家名称', trigger: 'change' }
        ],
        businessPhone: [
          { required: true, message: '请输入商家电话', trigger: 'change' }
        ],
        capacity: [
          {
            required: true,
            message: '请输入景区最佳容量数',
            trigger: 'change'
          }
        ],
        corporationName: [
          { required: true, message: '请输入法人姓名', trigger: 'change' }
        ],
        dailyMaxLoadCapacity: [
          { required: true, message: '请输入日最大承载量', trigger: 'change' }
        ],
        // description: [
        //   { required: true, message: '请输入景区详细介绍', trigger: 'change' }
        // ],
        instantMaxLoadCapacity: [
          {
            required: true,
            message: '请输入瞬时最大承载量',
            trigger: 'change'
          }
        ],
        openTime: [
          { required: true, message: '请输入开放时间', trigger: 'change' }
        ],
        closeTime: [
          { required: true, message: '请输入结束时间', trigger: 'change' }
        ]
      },
      editorConfig: {
        // 编辑器不自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: 300,
        // 初始容器宽度
        initialFrameWidth: '100%',
        // 上传文件接口, 报错属于正常，若需要验证可使用(也是盗大神的)http://35.201.165.105:8000/controller.php
        // 调试完毕打包上线则切换回/static/UEditor/php/controller.php即可，不用做其他处理
        // serverUrl: '/public/UEditor/jsp/controller.jsp',
        fileUploadServlet: '/api/fileManage/v1/insert/upload',
        UEDITOR_HOME_URL: '/UEditor/'
      }
    }
  },
  watch: {
    informationDate: {
      handler(newName, oldName) {
        this.ruleForm = newName
        console.log(this.ruleForm, '11111')
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true
    },
    edit: {
      handler(newName, oldName) {
        this.isedit = newName
      },
      // 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法，如果设置了false，那么效果和上边例子一样
      immediate: true
    }
  },
  mounted() {
    this.getCityeCode() // 查询区县
  },
  created() {
    this.token = getToken()
    this.editorOption = quillRedefine(
      {
        // 图片上传的设置
        uploadConfig: {
          header: (xhr, formData) => {
            xhr.setRequestHeader('token', this.token)
          },
          action: this.urlbanner + '/fileManage/v1/insert/upload', // 必填参数 图片上传地址
          // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
          // 你必须把返回的数据中所包含的图片地址 return 回去
          res: (respnse) => {
            return this.$common.imageUrl + respnse.data.url
          },
          name: 'file' // 图片上传参数名
        }
      }
    )
  },
  methods: {
    onClick() {
      this.dialogVisible = true
    },
    pointChange(e) {
      this.ruleForm.lat = e.lat
      this.ruleForm.lon = e.lng
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    getCityeCode() {
      const pramer = {
        cityCode: this.cityCode
      }
      getCityCode(pramer).then((res) => {
        console.log(res, 'getLands')
        if (res.code = 200) {
          this.cityList = res.data
        }
      })
    },
    submitForm(formName) {
      const _this = this
      console.log('提交', this.ruleForm)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          insertScenic(this.ruleForm).then((res) => {
            console.log(res, 'getLands')
            if ((res.code = 200)) {
              this.$message('成功')
              this.$router.push({ path: 'merchantManage' })
            } else {
              console.log('error submit!!')
              this.$message(res.message)
              return false
            }
          })
        }
      })
    },
    // 修改
    editForm(formName) {
      console.log('测试')
      console.log(this.ruleForm)
      // console.log(mit1)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateScenic(this.ruleForm).then((res) => {
            console.log(res, 'getLands')
            if (res.code = 200) {
              this.$message('成功')
              this.$emit('editOk', this.msg)
              // console.log(this.$emit('editOk'),"嘿嘿嘿嘿嘿嘿嘿嘿");
              this.$router.push({ name: 'merchantManageIndex' })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.$router.push({ path: 'merchantManage' })
    },
    // 上传成功后执行
    dropzoneR(file) {
      console.log(file, 'rrrrrrrrrrr')
      this.$message({ message: 'Upload success', type: 'success' })
    },
    // 删除图片后执行
    dropzoneS(file) {
      console.log(file)
      this.$message({ message: 'Delete success', type: 'success' })
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

<style  scoped>
.temporary {
  width: 60%;
  margin: 0 auto;
  background: #fff;
  padding: 20px;
  margin: 10px auto;
}
</style>
