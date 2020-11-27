<template>
  <div class="app-container">

    <div class="custom_form_box">
      <el-form ref="form" class="custom_form" :model="form" :rules="rules" label-width="110px" label-suffix="：">
        <el-form-item v-if="pageType === 1" label="用户名" prop="username">
          <div style="position: relative;">
            <el-input v-model="form.username" /> <span class="ml-10" style="position: absolute; width: 300px;">用户名为登录账号,初始密码为：123456</span>
          </div>

        </el-form-item>
        <el-form-item v-else-if="pageType === 2" label="用户名:">{{ form.username }}</el-form-item>
        <el-form-item label="登录密码" prop="password">
          <el-input v-model="form.password" type="password" />
        </el-form-item>
        <!-- <el-form-item label="确认密码" prop="checkPassword">
          <el-input type="password" v-model="form.checkPassword" />
        </el-form-item> -->
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="关联角色" prop="roleId">
          <el-select v-model="form.roleId" multiple>
            <el-option v-for="(item,index) in roleList" :key="index" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" prop="headUrl">
          <upload v-model="form.headUrl" vaule-format="string" :limit="1" />
        </el-form-item>
      </el-form>
      <div class="form_handle">
        <el-button type="primary" :loading="postLoading" @click="save('form')">保存</el-button>
        <el-button @click="reset('form')">重置</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload/image-upload'

export default {
  components: { Upload },
  data() {
    var validateUserName = async(rule, value, callback) => {
      if (this.routeId) {
        callback()
      } else {
        const uPattern = /^[a-zA-Z0-9_-]{4,16}$/
        if (value == '') {
          callback(new Error('用户名不能为空'))
        } else {
          if (value !== '') {
            if (uPattern.test(value)) {
              const flag = await this.getUserName(value)
              if (flag == true) {
                callback(new Error('用户名已存在'))
              } else {
                callback()
              }
            } else {
              callback(
                new Error('用户名号为4到16位字符（包括字母,数字,下划线,减号）')
              )
            }
          }
        }
      }
    }
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.checkPassword !== '') {
          this.$refs.form.validateField('checkPassword')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      postLoading: false,
      props: {
        label: 'name',
        value: 'id',
        children: 'children',
        emitPath: false
      },
      roleList: [], // 角色数组
      form: {
        username: '', // 用户名
        name: '', // 姓名
        phone: '', // 手机
        roleId: '', // 角色
        headUrl: '' // 头像
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { validator: validateUserName, trigger: 'change' }
        ],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        roleId: [{ required: true, message: '请选择角色', trigger: 'blur' }]
      },
      routeId: ''
    }
  },
  computed: {
    pageType() {
      if (this.routeId) {
        // 编辑
        return 2
      } else {
        // 新增
        return 1
      }
    }
  },
  created() {
    this.routeId = this.$route.params.id
    if (this.routeId) {
      this.form.id = this.routeId
      this.getDetail()
    }
    this.getAllRoleList()
  },
  methods: {
    getUserName(name) {
      return new Promise((resolve, reject) => {
        this.axios({
          url: '/userInfo/v1/getUsername',
          method: 'post',
          params: { username: name }
        }).then((res) => {
          resolve(res.data)
        })
      })
    },
    reset(formName) {
      this.$refs[formName].resetFields()
    },
    save(formName) {
      const pageType = this.pageType
      const data = { ...this.form }
      Object.keys(data).forEach((key) => {
        if (data[key] === null || data[key] === '') {
          delete data[key]
        }
      })
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postLoading = true
          if (pageType === 1) {
            this.add(data)
          } else if (pageType === 2) {
            this.edit(data)
          }
        } else {
          return false
        }
      })
    },
    edit(data) {
      this.axios({
        url: '/userInfo/v1/update',
        method: 'post',
        data: data
      })
        .then((res) => {
          this.$message({ type: 'success', message: '保存成功!' })
          this.toUser()
          this.postLoading = false
        })
        .catch((err) => {
          this.postLoading = false
        })
    },
    add(data) {
      this.axios({
        url: '/userInfo/v1/insert',
        method: 'post',
        data: data
      })
        .then((res) => {
          this.$message({ type: 'success', message: '保存成功!' })
          this.toUser()
          this.postLoading = false
        })
        .catch((err) => {
          this.postLoading = false
        })
    },
    toUser() {
      this.$store
        .dispatch('tagsView/delView', this.$route)
        .then(({ visitedViews }) => {
          this.$router.replace({ path: `/setting/user/list` })
        })
    },
    getCompanyList() {
      this.axios({
        url: '/company/b1/findAll',
        method: 'post'
      }).then((res) => {
        this.companyList = res.data
      })
    },
    getAllRoleList() {
      this.axios({
        url: '/role/v1/findAll',
        method: 'post'
      }).then((res) => {
        this.roleList = res.data
      })
    },
    getDetail() {
      this.axios({
        url: '/userInfo/v1/findById',
        method: 'post',
        params: { id: this.routeId }
      }).then((res) => {
        const data = res.data
        data.roleId = data.roleList ? data.roleList.map((v) => v.id) : []
        Object.keys(this.form).forEach((key) => {
          this.form[key] = data[key]
        })
        this.form.roleList = data.roleList
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form_handle {
  text-align: center;
}
.custom_form_box {
  margin-top: 15px;
  padding: 80px 0;
  background-color: #fff;
}
.custom_form {
  max-width: 500px;
  margin: auto;
}
>>> .el-select__tags {
  .el-tag {
    .el-select__tags-text {
      display: inline-block;
      max-width: 80px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .el-tag__close.el-icon-close {
      top: -7px;
    }
  }
}
</style>
