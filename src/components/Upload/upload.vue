<template>
  <div class="w-upload">
    <el-upload
      ref="upload"
      class="uploader"
      :multiple="multiple"
      action
      drag
      :limit="limit"
      :file-list="fileList"
      :before-upload="_beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :before-remove="beforeRemove"
      :on-exceed="onExceed"
      :http-request="httpRequest"
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
    </el-upload>
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
    limit: {
      type: Number,
      default: null
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
    'beforeUpload': Function
  },
  data() {
    return {
      hasInit: false,
      hasChange: false,
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
        fileList.push({ name: `img_${value}`, url: value })
      } else if (Array.isArray(value)) {
        value.map(v => {
          fileList.push({
            name: v.name ? `img_${v.name}` : `img_${v.url}`,
            url: v.url
          })
        })
      }
      this.hasInit = true
      this.fileList = fileList
    },
    handleChange() {
      this.hasChange = true
      const multiple = this.multiple
      const fileList = this.fileList.map(item => {
        return {
          name: item.name,
          url: item.url
        }
      })
      this.$emit('change', fileList)
      if (this.limit === 1 && this.vauleFormat === 'string') {
        this.$emit('input', fileList[0] ? fileList[0].url : '')
      } else if (this.vauleFormat === 'array') {
        const list = this.fileList.map(item => {
          return item.url
        })
        this.$emit('input', list)
      } else {
        this.$emit('input', fileList)
      }
    },
    _beforeUpload(file) {
      if (this._beforeUpload) {
        return this.beforeUpload(file)
      }
    },
    onSuccess(data, file) {
      // 上传成功
      this.fileList.push(file)
      this.fileList.map(item => {
        if (item.uid === file.uid) {
          item.url = data.url
        }
      })
      this.handleChange()
    },
    onError(res, file) {
      // 上传失败
      this.$message({
        type: 'error',
        duration: 1000,
        message: '上传失败'
      })
      this.$nextTick(() => {
        this.fileList = this.fileList.filter(item => item.uid !== file.uid)
        this.handleChange()
      })
    },
    beforeRemove(file, fileList) {
      if (file.status !== 'ready') {
        return this.$confirm('是否删除此附件？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.$message.success('删除成功')
            this.fileList = this.fileList.filter(item => item.uid !== file.uid)
            this.handleChange()
          })
          .catch(meg => console.log(meg))
      }
    },
    onExceed(files, fileList) {
      // 文件超出个数钩子//这里返回的文件并不是当前存入的文件//这里只用于数量限制
      this.$message.error('文件数量超出')
    },
    httpRequest(content) {
      const { file } = content
      const formData = new FormData()
      formData.append('file', file)
      this.axios({
        url: 'fileManage/v1/upload',
        port: 'security',
        method: 'post',
        timeout: 300000,
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
</style>
