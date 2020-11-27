<template>
  <span @click="handleUpload()">
    <slot />
    <input v-if="ishowFile" ref="upload-input" class="upload-input" type="file" :accept="accept" @input="handleClick">
  </span>
</template>

<script>
export default {
  name: 'Upload',
  props: {
    url: {
      type: String,
      default: 'propertyQuestion/importExcel'
    },
    accept: {
      type: String,
      default: '.xlsx'
    },
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    onChange: Function
  },
  data() {
    return {
      ishowFile: true,
      file: ''
    }
  },
  watch: {
    'file.status'(nv, ov) {
      this.onChange && this.onChange(this.file)
    }
  },
  methods: {
    handleUpload() {
      this.$refs['upload-input'].click()
    },
    handleClick(e) {
      console.log(e)
      const files = e.target.files
      const rawFile = files[0] // only use files[0]
      this.file = {
        uid: new Date().getTime(),
        raw: null,
        status: null
      }
      this.file.raw = rawFile
      if (!rawFile) {
        this.file.status = 'fail'
      } else {
        this.file.status = 'ready'
        this.$nextTick(() => {
          this.upload(rawFile)
        })
      }
    },
    upload(file) {
      this.ishowFile = false // 销毁
      this.file.status = 'uploading'
      const formData = new FormData()
      formData.append('file', file)
      this.axios({
        url: this.url,
        port: 'party',
        method: 'post',
        timeout: 300000,
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.floor(
            (progressEvent.loaded * 100) / progressEvent.total
          )
          this.file.percent = percentCompleted
          this.onProgress && this.onProgress({ percent: percentCompleted })
        },
        data: formData
      })
        .then((res) => {
          this.ishowFile = true // 重建
          this.$message({
            type: 'success',
            message: res.message,
            duration: 1000
          })
          this.file.response = res
          this.file.status = 'success'
          this.onSuccess && this.onSuccess(res.data)
        })
        .catch((err) => {
          this.file.status = 'error'
          this.onError && this.onError(err)
          this.ishowFile = true // 重建
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-input {
  display: none;
  z-index: -9999;
}
</style>
