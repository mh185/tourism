<template>
	<div>
		<!-- <div class="header">
			 <el-input
				placeholder="请输入商家名称"
				v-model="searchValue" size="small" clearable>
				<i slot="prefix" class="el-input__icon el-icon-search"></i>
			</el-input>
			<el-button type="primary" @click="search" size="small">搜索</el-button>
		</div> -->
		<el-main>
			<el-table :data="userList" border stripe style="width: 100%" :header-cell-style="{background:'#dcdfe6'}" max-height="800">
				<el-table-column prop="businessName" label="商家名称" width="120">
				</el-table-column>
				<el-table-column prop="corporationName" label="法人姓名" width="80">
				</el-table-column>
				<el-table-column prop="corporationIdPictureFrontUrl" label="法人身份证正面" width="170">
                    <template slot-scope="scope">
                         <img :src="scope.row.corporationIdPictureFrontUrl">                       
                    </template>
				</el-table-column>
				<el-table-column prop="corporationIdPictureInverseUrl" label="法人身份证反面"  width="170">
                    <template slot-scope="scope">
                         <img :src="scope.row.corporationIdPictureInverseUrl">                       
                    </template>
				</el-table-column>
				<el-table-column prop="businessLicenseUrl" label="营业执照"  width="170">
                     <template slot-scope="scope">
                         <img :src="scope.row.businessLicenseUrl">                       
                    </template>
				</el-table-column>
				<el-table-column prop="businessPhone" label="联系电话">
				</el-table-column>
				<el-table-column prop="businessType" label="商家类型"  width="80">
                    <template slot-scope="scope">
                        <span v-if="scope.row.businessType =='0'">景区</span>
                        <span v-else-if="scope.row.businessType =='1'">普通商家</span>
                        <span v-else-if="scope.row.businessType =='2'">酒店</span>
                        <span v-else>旅行社</span>
                    </template>
				</el-table-column>
				<el-table-column prop="createTime" label="商家后台账号" width="120">
				</el-table-column>
				<el-table-column prop="createTime" label="商家后台密码" width="120">
				</el-table-column>
				<el-table-column label="状态"  width="150">
					<template slot-scope="scope">
						<el-switch
							v-model="scope.row.isEnable"
							active-color="#13ce66"
							inactive-color="#ff4949"
							active-text="启用"
                            active-value="1"
							inactive-text="停用"
                            inactive-value="0"
							@change="getStatus(scope.row.isEnable,scope.row.id)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="success" size="mini" @click="details(scope.row)">详情</el-button>
                        <el-button type="warning" size="mini" @click="resetPwd">重置商家后台密码</el-button>
                    </template>
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
				hide-on-single-page>
			</el-pagination>
			<!-- 弹窗 -->
			<el-dialog title="新增用户"  :visible.sync="detailsStatus" width="30%">
				<el-form :model="form">
					<el-form-item label="用户名" label-width="120px">
						<el-input v-model="form.name" clearable></el-input>
					</el-form-item>
					<el-form-item label="登录密码" label-width="120px">
						<el-input v-model="form.password" clearable></el-input>
					</el-form-item>
					<el-form-item label="姓名" label-width="120px">
						<el-input v-model="form.fullName" clearable></el-input>
					</el-form-item>
					<el-form-item label="角色" label-width="120px">
						<el-select v-model="form.roles" placeholder="请选择">
							<el-option
							v-for="item in rolesList"
							:key="item.value"
							:label="item.label"
							:value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer"  class="dialog-footer">
					<el-button type="primary" @click="detailsStatus = false">确 定</el-button>
				</div>
			</el-dialog>
		</el-main>
		
	</div>

</template>

<script>
import { getBusinessList , stopOrStart} from "@/api/bussiness"
export default {
	data(){
		return{
			total:100,//总条数默认给100
			pageSize:10,
			pageNum:1,//当前页数
			userList:[],
			detailsStatus:false,//详情
			form:{
				name:'',
				password:'',
				fullName:'',
				isEnable:'',
			},
			rolesList:[ //角色
				{
					value: 'admin',
          			label: '管理员'
				},
				{
					value: '1',
          			label: '普通'
				}
			],
			searchValue:'',
		}
	},
	mounted(){
		this.getUserList();
	},
	methods:{
		//获取列表
		getUserList(){
			//条件分页
			let data={
				page : this.pageNum,
				size: this.pageSize
			}
			//查询条件 没有则传空
			let query={

			}
            getBusinessList(data,query).then( res => {
				console.log(res)
				if(res.code==200){
					this.userList=res.data.rows
					this.total=res.data.rows.total
				}
			})
           
		},
		// 状态
		getStatus(status,id){
            //1 启用 0 停用
			console.log(status,id)
			let data={
				id : id,
				isEnable : status
			}
			stopOrStart(data).then(res=>{
				console.log(res,"222");
				if (res.code==200) {
					this.$message(res.message)
				}
			})
			
		},
		// 详情
		details(row){
			this.detailsStatus = true;
			console.log(row)
		},
		// 重置密码
		resetPwd(){
			this.$confirm('此操作将重置密码, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
				}).then(() => {
					// this.getUserList();
					this.$message({
						type: 'success',
						message: '密码已重置!'
					});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消重置'
					});          
			});
		},
		handleCurrentChange(pageNum){
			this.pageNum = pageNum;//点击第几页
			console.log(pageNum)
			// this.getUserList();
		},
		handleSizeChange(pageSize){
			this.pageSize = pageSize;//每页下拉显示数据
			// console.log(pageSize)
		},
		search(){
			console.log(this.searchValue)
		},
	}
}
</script>

<style lang="scss" scoped>
	.table{
		/* padding: 20px; */
	}
	.el-pagination{
		padding-top: 20px;
	}
	.el-input,.el-select{
		width: 50%;
	}
	.header{
		padding: 20px 20px 0;
		.el-input{
			width: 160px;
		}
		.el-button--small{
			margin-left: 20px;
			
		}
	}
</style>
