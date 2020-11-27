<template>
  <div class="w-upload">
    <transition-group name="list-complete" class="image-list clear-float" tag="div">
      <div v-show="showUpload" :key="-1" class="image-upload">
        <el-upload
          ref="upload"
          class="uploader"
          list-type="picture-card"
          :accept="accept"
          :multiple="multiple"
          :limit="limit"
          :show-file-list="false"
          :file-list="fileList"
          action
          :on-change="onChange"
          :before-upload="_beforeUpload"
          :on-success="onSuccess"
          :on-error="onError"
          :on-exceed="onExceed"
          :on-progress="onProgress"
          :http-request="httpRequest"
        >
          <i class="el-icon-plus" />
          <slot slot="trigger" name="trigger" />
          <slot slot="tip" name="tip" />
        </el-upload>
      </div>
      <div v-for="(item,key) in fileList" :key="key" class="image-list-item">
        <el-image class="image" :src="item.url ? item.url : item" />
        <div v-if="item.pass === true" class="del">
          <i class="el-icon-delete" @click="handleFileRemove(item,key)" />
        </div>
        <div
          class="layer"
          :class="{'layer-show': item.pass === false}"
          @click="handleFileEnlarge(item)"
        >
          <el-progress
            v-if="item.pass === false"
            type="circle"
            :width="progressWidth"
            :percentage="item.progress"
            :status="item.pStatus"
          />
          <i v-if="item.pass === true" class="el-icon-view" />
        </div>
      </div>
    </transition-group>

    <el-dialog :visible.sync="isEnlargeImage" append-to-body top="8vh" width="60%">
      <el-image
        style="width:100%;"
        fit="contain"
        :src="enlargeImage"
        @click="isEnlargeImage = false"
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    'vauleFormat': {
      type: String,
      default: 'array-object',
      validator: function(val) { // 为string时只有当 limit = 1 才会生效
        return val === 'string' || val === 'array' || val === 'array-object'
      }
    },
    'progressWidth': {
      // 环形进度条画布宽度
      type: Number,
      default: 126
    },
    limit: {
      type: Number,
      default: null
    },
    accept: {
      type: String,
      default: 'image/*'
    },
    value: {
      type: [String, Array],
      default: ''
    },
    multiple: {
      // 多选
      type: Boolean,
      default: false
    },
    'beforeUpload': Function,
    change: Function
  },
  data() {
    return {
      hasInit: false,
      hasChange: false,
      isEnlargeImage: false, // 放大图片
      enlargeImage: '', // 放大图片地址
      fileList: []
    }
  },
  computed: {
    showUpload() {
      let flag = true
      const multiple = this.multiple
      const limit = this.limit
      const fileLength = this.fileList.length
      if (typeof limit === 'number' && fileLength >= limit) {
        flag = false
      }
      return flag
    }
  },
  watch: {
    value(val) {
      if (!this.hasChange && this.hasInit) {
        this.initData(val)
      }
    }
  },
  created() {
    this.initData(this.value)
  },
  methods: {
    initData(value) {
      const fileList = []
      if (typeof value === 'string' && value != '') {
        value = value.split(',')
        value.map(url => {
          fileList.push({
            url: url,
            pass: true
          })
        })
      } else if (Array.isArray(value)) {
        value.map(v => {
          fileList.push(Object.assign(v,{
            name: v.name ? v.name : v.url ? v.url : v,
            url: v.url ? v.url : v,
            pass: true
          }))
        })
      }
      if (this.hasInit === false) {
        this.handleValue(fileList)
      }
      this.$nextTick(() => {
        this.hasInit = true
      })
      this.fileList = fileList
    },
    handleChange(file) {
      this.hasChange = true
      this.change && this.change(file, this.fileList)
      this.handleValue(this.fileList)
    },
    handleValue(fileList) {
      if (this.vauleFormat === 'string') {
        this.$emit('input', fileList.map(v => v.url).join(','))
      } else if (this.vauleFormat === 'array') {
        const list = this.fileList.map(item => {
          return item.url
        })
        this.$emit('input', list)
      } else {
        this.$emit('input', fileList)
      }
    },
    onChange(file, fileList) {
      // 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用
      if (!file.url) {
        const blob = new Blob([file.raw], { type: 'application/image' })
        file.url = window.URL.createObjectURL(blob)
      }
      if (file.status === 'ready') {
        this.fileList.push({
          name: file.name,
          uid: file.uid,
          url: file.url,
          progress: 0,
          pass: false,
          pStatus: null
        })
      } else if (file.status === 'fail') {
        if (file.pStatus !== 'exception') {
          this.$message({
            type: 'error',
            duration: 1000,
            message: '文件读取错误，请刷新重试！'
          })
        }
      }
    },
    _beforeUpload(file) {
      // 上传文件之前
      if (this.beforeUpload) {
        return this.beforeUpload(file)
      }
      // let FileExt = file.name.replace(/.+\./, '')
      // if (['png', 'jpg'].indexOf(FileExt.toLowerCase()) === -1) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请上传后缀名为[jpg,png]的附件！'
      //   })
      //   return false
      // } else if (file.size / (1000 * 1024) > 2) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请上传大小在2MB以内的图片！'
      //   })
      //   return false
      // }
    },
    onProgress(e, file, fileList) {
      // console.log(e, file, fileList)
      // 上传时的
      this.fileList.map(item => {
        if (item.uid === file.uid) {
          item.progress = Math.floor(e.percent)
        }
      })
      // Math.floor(e.percent)
    },
    onSuccess(data, file) {
      // 上传成功
      this.fileList.map(item => {
        if (item.uid === file.uid) {
          item.pStatus = 'success'
          item.url = data.url
          this.$nextTick(() => {
            item.pass = true
          })
        }
      })
      this.handleChange(file)
    },
    onError(res, file) {
      // 上传失败
      this.fileList.map(item => {
        if (item.uid === file.uid) {
          item.pStatus = 'exception'
        }
      })
      this.$message({
        type: 'error',
        duration: 1000,
        message: '上传失败'
      })
      this.$nextTick(() => {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid)
      })
      this.handleChange(file)
    },
    handleFileRemove(file, i) {
      // 删除图片
      if (!file.url && !file) {
        return false
      }
      this.$confirm('是否删除此附件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message.success('删除成功')
          this.fileList.splice(i, 1)
          // const uploadFiles = this.$refs.upload.uploadFiles
          // if (uploadFiles.length !== this.fileList.length) {
          //   uploadFiles.splice(i, 1)
          // }
          this.handleChange(file)
        })
        .catch(meg => console.log(meg))
    },
    onExceed(files, fileList) {
      // 文件超出个数钩子//这里返回的文件并不是当前存入的图片//这里只用于数量限制
      this.$message.error('图片数量超出')
    },
    handleFileEnlarge(item) {
      // 放大图片
      if (item.url) {
        this.enlargeImage = item.url
      } else {
        this.enlargeImage = item
      }
      this.isEnlargeImage = !this.isEnlargeImage
    },
    httpRequest(content) {
      const { file } = content
      const formData = new FormData()
      formData.append('file', file)
      this.axios({
        url: 'fileManage/v1/insert/upload',
        method: 'post',
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.floor(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          content.onProgress({ percent: percentCompleted })
        },
        data: formData
      })
        .then(res => {
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1000
          })
          res.data.orginUrl = res.data.url
          res.data.url = '/api' + res.data.url
          content.onSuccess(res.data)
        })
        .catch(err => {
          content.onError(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.list-complete-enter {
  opacity: 0;
  transform: translateY(30px);
}
// .list-complete-enter-active {

// }
// .list-complete-enter-to {

// }
// .list-complete-leave {

// }
// .list-complete-leave-active {

// }
.list-complete-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.list-complete-leave-active {
  position: absolute;
}
* {
  box-sizing: border-box;
}
.w-upload {
  overflow: hidden;
  width: 100%;
}
.w-upload >>> .el-upload--picture-card {
  // width: 200px;
  // height: 200px;
  // line-height: 200px;
  width: 148px;
  height: 148px;
  line-height: 148px;
}
.w-upload .image-list-item {
  float: left;
  text-align: left;
  position: relative;
  // width: 200px;
  // height: 200px;
  width: 148px;
  height: 148px;
  padding: 5px;
  margin: 0 8px 8px 0;
  border: 1px solid #d1dbe5;
  // border-radius: 4px;
  border-radius: 6px;
  transition: all 1s;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.w-upload .image-upload {
  float: left;
  display: table;
  text-align: center;
  margin: 0 8px 8px 0;
}
.w-upload .uploader {
  width: 100%;
  display: table-cell;
  vertical-align: middle;
}
.w-upload .image-progress {
  text-align: center;
}
.w-upload .image-list-item .image {
  // display: block;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  border-radius: 4px;
}
.w-upload .image-list-item .name {
  margin-top: 10px;
}
.w-upload .image-list-item .name > div {
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 25px;
  line-height: 25px;
}
.w-upload .image-list-item:hover .del,
.w-upload .image-list-item:hover .layer {
  opacity: 1;
}
.w-upload .image-list-item .del,
.w-upload .image-list-item .layer {
  opacity: 0;
  transition: all 0.3s;
}

.w-upload .image-list-item .del {
  z-index: 10;
  position: absolute;
  right: 10px;
  top: 0;
  color: #f8f8f8;
  cursor: pointer;
  font-size: 1.1em;
}
.image-list-item .del:hover {
  color: red;
}
.w-upload .image-list-item .layer {
  display: flex;
  display: -webkit-flex;
  display: -ms-flexbox;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 100%;
  color: #fff;
  text-align: center;
  z-index: 5;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.2);
}
.w-upload .image-list-item .layer-show {
  background-color: rgba(255, 255, 255, 0.8);
  opacity: 1;
}
.w-upload .image-list-item .layer i {
  font-size: 1.6em;
}
.clear-float:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
</style>
