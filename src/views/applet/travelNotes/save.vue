<template>
  <div class="app-container">
    <div class="form-content">
      <el-form v-if="pageType === 1 || pageType === 2" ref="form" class="form" :model="form" :rules="rules" label-width="120px" label-suffix="：">
        <el-form-item label="攻略名称">
          <el-input v-model="form.title" clearable placeholder="攻略名称" />
        </el-form-item>
        <!-- <el-form-item label="攻略类型">
          <el-select v-model="form.travelsTypeId" clearable placeholder="请选择">
            <el-option v-for="(item,index) in travelTypeList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="旅游路线">
          <el-input v-model="form.routes" clearable placeholder="旅游路线" />
        </el-form-item>
        <el-form-item label="出行天数">
          <el-input v-model="form.travelDay" clearable placeholder="请输入">
            <template slot="append">天</template>
          </el-input>
        </el-form-item>
        <el-form-item label="交通工具">
          <el-input v-model="form.travelTool" clearable placeholder="请输入交通工具" />
        </el-form-item>
        <el-form-item label="出发时间">
          <el-date-picker v-model="form.travelTime" type="date" value-format="yyyy-MM-dd" placeholder="请选择出发时间" />
        </el-form-item>
        <el-form-item label="出行景区">
          <el-select v-model="form.scenicSpotId" placeholder="请选择景区">
            <el-option v-for="(item,index) in scenicSpotList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sort" clearable placeholder="请输入数字，数字越大，顺序越后" />
        </el-form-item>
        <el-form-item label="是否推荐">
          <el-radio-group v-model="form.isRecommend">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否推荐首页">
          <el-radio-group v-model="form.isHome">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <!-- <el-radio v-model="form.isHome" :label="1">是</el-radio>
          <el-radio v-model="form.isHome" :label="0">否</el-radio> -->
        </el-form-item>
        <!-- <el-form-item label="出行景区配图">
          <upload v-model="form.headUrl" vaule-format="string" :limit="1" />
        </el-form-item> -->
        <el-form-item label="封面图片">
          <upload v-model="coverFile" :change="coverFileChange" vaule-format="string" :limit="1" />
        </el-form-item>
        <el-form-item label="展示图片">
          <upload v-model="bannerFileList" :change="bannerFileChange" multiple vaule-format="array" :limit="5" />
        </el-form-item>
        <el-form-item label="游记简介">
          <quill-editor v-model="form.brief" :options="editorOption" />
          <!-- <tinymce v-model="form.brief" :height="300" /> -->
        </el-form-item>
        <el-form-item label="出行方式">
          <quill-editor v-model="form.travelMode" :options="editorOption" />
          <!-- <tinymce v-model="form.travelMode" :height="300" /> -->
        </el-form-item>
        <el-form-item label="详情介绍">
          <quill-editor v-model="form.travelDetails" :options="editorOption" />
          <!-- <tinymce v-model="form.travelDetails" :height="300" /> -->
        </el-form-item>
        <div class="button-box">
          <el-button @click="toPrePage()">取 消</el-button>
          <el-button type="primary" :loading="postLoading" @click="save('form')">确 定</el-button>
        </div>
      </el-form>

      <el-form v-else-if="pageType === 3" ref="form" class="form" label-width="120px" label-suffix="：">
        <el-form-item label="攻略名称">
          <div>{{ form.title }}</div>
        </el-form-item>
        <!-- <el-form-item label="攻略类型">
          <div>{{form.travelsTypeName}}</div>
        </el-form-item> -->
        <el-form-item label="旅游路线">
          <div>{{ form.routes }}</div>
        </el-form-item>
        <el-form-item label="出行天数">
          <div>{{ form.travelDay }}天</div>
        </el-form-item>
        <el-form-item label="交通工具">
          <div>{{ form.travelTool }}</div>
        </el-form-item>
        <el-form-item label="出发时间">
          <div>{{ form.travelTime }}</div>
        </el-form-item>
        <el-form-item label="出行景区">
          <div>{{ form.scenicSpotName }}</div>
        </el-form-item>
        <el-form-item label="排序">
          <div>{{ form.sort }}</div>
        </el-form-item>
        <el-form-item label="是否推荐">
          <div v-if="form.isRecommend">是</div>
          <div v-else>否</div>
        </el-form-item>
        <el-form-item label="是否推荐首页">
          <div v-if="form.isHome">是</div>
          <div v-else>否</div>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-image
            style="width: 100px; height: 100px"
            :src="urlbanner + form.coverFileManageUrl"
            :preview-src-list="[urlbanner + form.coverFileManageUrl]"
          />
        </el-form-item>
        <el-form-item label="展示图片">
          <el-image
            v-for="(item,index) in bannerFileList"
            :key="index"
            style="width: 100px; margin-left: 10px; height: 100px"
            :src="item.url"
            :preview-src-list="[item.url]"
          />
        </el-form-item>
        <el-form-item label="游记简介">
          <div class="txt" v-html="form.brief" />
        </el-form-item>
        <el-form-item label="出行方式">
          <div class="txt" v-html="form.travelMode" />
        </el-form-item>
        <el-form-item label="详情介绍">
          <div class="txt" v-html="form.travelDetails" />
        </el-form-item>
        <div class="button-box">
          <el-button @click="toPrePage()">取 消</el-button>
        </div>
      </el-form>
    </div>

  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Upload from '@/components/Upload/image-upload'
import { quillEditor } from 'vue-quill-editor'
import { quillRedefine } from 'vue-quill-editor-upload'
import { getToken } from '@/utils/auth'
import { upfiles, insert, update } from '@/api/travelNotes'

export default {
  name: 'TinymceDemo',
  name: 'AppletTravelNotesSave',
  components: { Upload, Tinymce, quillEditor, quillRedefine },
  filters: {
    datefilter(e) {
      return moment(e).format('LTS')
    }
  },
  data() {
    return {
      bannerFileList: [],
      urlbanner: '/api',
      editorOption: {}, // 必须初始化为对象 init  to Object
      scenicSpotList: [],
      travelTypeList: [],
      postLoading: false,
      briefContent: '',
      travelModeContent: '',
      travelDetailsContent: '',
      coverFile: [],
      banners: [],
      form: {
        banners: [],
        title: '',
        routes: '',
        travelDay: '',
        travelTool: '',
        travelTime: '',
        scenicSpotId: '',
        sort: '',
        // travelsTypeId: '',
        coverFileManageId: '',
        coverFileManageUrl: '',
        officialUrl: '',
        brief: '',
        isRecommend: '',
        travelDetails: '',
        travelMode: '',
        isHome: '',
        briefContent: '',
        travelModeContent: '',
        travelDetailsContent: ''
      },
      rules: {},
      routeId: '', // 编辑的时候存在
      detailId: '' // 详情存在
    }
  },
  computed: {
    pageType() {
      if (this.routeId) {
        return 2
      } else if (this.detailId) {
        return 3
      } else {
        return 1
      }
    }
  },
  created() {
    this.routeId = this.$route.params.id
    this.detailId = this.$route.params.detailId
    if (this.pageType === 2) {
      this.getDetail(this.routeId)
      this.getBaners(this.routeId)
    }
    else if (this.pageType === 3) {
      this.getDetail(this.detailId)
      this.getBaners(this.detailId)
    }
    this.getTravelsType()
    this.getScenicSpot()
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
    coverFileChange(file, flieList) {
      if (flieList.length) {
        const id = flieList[0].response && flieList[0].response.id
        this.form.coverFileManageId = id
      } else {
        this.form.coverFileManageId = ''
      }
    },
    bannerFileChange(file, flieList) {
      console.log(file, flieList)
      if (flieList.length) {
        this.banners = flieList.map(v => {
          return {
            fileManageId: v.fileManageId ? v.fileManageId : v.response && v.response.id,
            fileTypeEnum: v.fileTypeEnum ? v.fileTypeEnum : v.response && v.response.fileSuffix
          }
        })
      } else {
        this.banners = []
      }
    },
    save(formName) {
      this.$refs[formName].validate((valid, faileds) => {
        if (valid) {
          this.postLoading = true
          console.log(this.banners)
          if (this.routeId) {
            this.edit()
          } else {
            this.add()
          }
        }
      })
    },
    add() {
      const data = {
        banners: this.banners,
        title: this.form.title,
        routes: this.form.routes,
        travelDay: this.form.travelDay,
        travelTool: this.form.travelTool,
        travelTime: this.form.travelTime,
        scenicSpotId: this.form.scenicSpotId,
        sort: this.form.sort,
        // travelsTypeId: this.form.travelsTypeId,
        coverFileManageId: this.form.coverFileManageId,
        brief: this.form.brief,
        isRecommend: this.form.isRecommend,
        travelDetails: this.form.travelDetails,
        travelMode: this.form.travelMode,
        isHome: this.form.isHome,
        travelsOfficialId: 1
      }
      insert(data).then(res => {
        this.$message({ type: 'success', message: '保存成功!' })
        this.postLoading = false
        this.$router.replace({ path: `/applet/travelNotes/list` })
      }).catch((err) => {
        this.postLoading = false
      })
      // this.axios({
      //   url: 'travels/v1/insert',
      //   method: 'post',
      //   data: this.form
      // })
      //   .then((res) => {
      //     this.toPrePage()
      //     this.$message({ type: 'success', message: '保存成功!' })
      //     this.postLoading = false
      //   })
      //   .catch((err) => {
      //     this.postLoading = false
      //   })
    },
    edit() {
      const data = {
        id: this.form.id,
        banners: this.banners,
        title: this.form.title,
        routes: this.form.routes,
        travelDay: this.form.travelDay,
        travelTool: this.form.travelTool,
        travelTime: this.form.travelTime,
        scenicSpotId: this.form.scenicSpotId,
        sort: this.form.sort,
        // travelsTypeId: this.form.travelsTypeId,
        coverFileManageId: this.form.coverFileManageId,
        brief: this.form.brief,
        isRecommend: this.form.isRecommend,
        travelDetails: this.form.travelDetails,
        travelMode: this.form.travelMode,
        isHome: this.form.isHome,
        travelsOfficialId: 1
      }
      update(data).then(res => {
        if (res.code == 200) {
          this.$router.replace({ path: `/applet/travelNotes/list` })
          this.$message({ type: 'success', message: '保存成功!' })
        }
        this.postLoading = false
      }).catch((err) => {
        this.postLoading = false
      })
      // this.axios({
      //   url: 'travels/v1/update',
      //   method: 'post',
      //   data: this.form
      // })
      //   .then((res) => {
      //     if(res.code==200){
      //       this.toPrePage()
      //       this.$message({ type: 'success', message: res.message })
      //       this.postLoading = false
      //     }
      //   })
      //   .catch((err) => {
      //     this.postLoading = false
      //   })
    },
    toPrePage() {
      this.$router.replace({ path: `/applet/travelNotes/list` })
    },
    getScenicSpot() {
      this.axios({
        url: 'scenicSpot/v1/queryAllScenicSpotList',
        method: 'post'
      }).then((res) => {
        this.scenicSpotList = res.data
      })
    },
    getTravelsType() {
      this.axios({
        url: 'travelsType/v1/minApp/all',
        method: 'post'
      }).then((res) => {
        this.travelTypeList = res.data
      })
    },
    getBaners(id) {
      this.axios({
        url: 'travels/v1/selectOne/banner',
        method: 'post',
        params: { travelsId: id }
      }).then((res) => {
        console.log(res);
        this.banners = res.data.map(v => {
          return {
            fileManageId: v.fileManageId,
            fileTypeEnum: v.fileTypeEnum
          }
        })
        this.bannerFileList = res.data.map(v => {
          return {
            name: v.fileManageUrl,
            url: this.urlbanner + v.fileManageUrl,
            fileManageId: v.fileManageId,
            fileTypeEnum: v.fileTypeEnum
          }
        })
      })
    },
    getDetail(id) {
      this.axios({
        url: 'travels/v1/selectOne',
        method: 'post',
        params: { travelsId: id }
      }).then((res) => {
        this.form = res.data
        this.coverFile = [{ name: res.data.coverFileManageUrl, url: this.urlbanner + res.data.coverFileManageUrl }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  background-color: #fff;
  margin: 20px 40px;
  padding: 20px 0;
}
.form {
  padding-right: 20px;
  margin: auto;
  max-width: 1000px;
}
.button-box {
  text-align: center;
}
.txt >>> img{
  width: 100%;
  margin-top: 10px;
}
</style>
