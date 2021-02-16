<template>
  <div class="productWrap" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <div class="title">商品分类配置：</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            label="中文名"
            prop="cName">
          </el-table-column>
          <el-table-column
            label="英文名"
            prop="eName">
          </el-table-column>
          <el-table-column
            align="right">
            <template #header>
              <el-button size='mini' @click="addClass">新增</el-button>
            </template>
            <template #default="scope">
              <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-popconfirm title="这是一段内容确定删除吗？" @confirm='onConfirm'>
                <template #reference>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row class="hostSiteTitle">
      <el-col :span="24">
        <div class="title">核销网址配置：</div>
      </el-col>
    </el-row>
    <el-row class="hostSite">
      <el-col :span="20">
        <el-input placeholder="请输入核销地址如： http://localhost:8080/orderCheck" v-model="hostSite"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button @click="updateHostSite">修改</el-button>
      </el-col>
    </el-row>

  <el-dialog :title="dialogTitle" v-model="dialogFormVisible">
    <el-form :model="form">
      <el-form-item label="中文名" :label-width="formLabelWidth">
        <el-input v-model="form.cName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="英文名" :label-width="formLabelWidth">
        <el-input v-model="form.eName" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSure">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  </div>
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import { getConfigs, updateConfigs } from '@/api/config'
export default defineComponent({
  name: 'config',
  setup(){
    // 分类配置
    let classData = reactive({
      tableData: [{
        cName: '2016-05-02',
        eName: '王小虎',
      }],
      configId: '',
      loading: false
    })
    let addClass = () => {
      dialogData.dialogFormVisible = true,
      dialogData.dialogTitle = '新增'
      dialogData.form.cName = ''
      dialogData.form.eName = ''
      dialogData.currentIndex = 0
    }
    let handleDelete = (index:number, row:any) => {
      dialogData.dialogTitle ='删除'
      dialogData.currentIndex = index
      debugger
    }
    let handleEdit = (index:number, row:any) => {
      dialogData.dialogTitle ='编辑'
      dialogData.dialogFormVisible = true
      dialogData.form.cName = row.cName
      dialogData.form.eName = row.eName
      dialogData.currentIndex = index
    }
    let getConfigsList = async ()=>{
      classData.loading = true
      let res:any = await getConfigs({})
      if(res.code == 200 && res.resultList.length > 0){
        let tempres = res.resultList[0]
        let classLists = []
        hostSite.hostSite = tempres.managerHost
        classData.configId = tempres._id
        if(tempres.classList.length>0){
          classLists = tempres.classList.map((items:any) => {
            return {
              cName: items.name,
              eName: items.value,
            }
          })
        }
        classData.tableData = classLists
      }
      classData.loading = false
    }

    // 核销地址配置
    let hostSite = reactive({
      hostSite: ''
    })
    let updateHostSite = async() => {
      updateConfig({
        managerHost: hostSite.hostSite
      })
    }

    // 对话框逻辑
    let dialogData = reactive({
      dialogFormVisible: false,
      form: {
        cName: '',
        eName: '',
      },
      formLabelWidth: '120px',
      currentIndex: 0,
      dialogTitle: '编辑'
    })
    let onSure = async() => {
      if(dialogData.dialogTitle =='编辑'){
        classData.tableData.splice(dialogData.currentIndex, 1, dialogData.form)
      }else if(dialogData.dialogTitle =='新增'){
        classData.tableData.unshift(dialogData.form)
      }
      let param = classData.tableData.map(item => {
        return {
          name: item.cName,
          value: item.eName
        }
      })
      await updateConfig({classList: param})
      await getConfigsList()
      dialogData.dialogFormVisible = false
    }
    let onConfirm = async ()=>{
      classData.tableData.splice(dialogData.currentIndex, 1)
      await onSure()
    }
    let updateConfig = async(data:any) => {
      classData.loading = true
      let res = await updateConfigs({
        _id: classData.configId,
        ...data
      })
      classData.loading = false
      return res
    }
    onMounted(() => {
      getConfigsList()
    })

    return {
      ...toRefs(classData),
      addClass,
      handleDelete,
      handleEdit,
      ...toRefs(dialogData),
      onSure,
      updateConfig,
      onConfirm,
      ...toRefs(hostSite),
      updateHostSite
    }
  }
})
</script>

<style scoped>
  .title {
    line-height: 20px;
    float: left;
  }
  .hostSite {
    margin-top: 0.5rem
  }
  .hostSiteTitle{
    margin-top: 1rem
  }
</style>
<style>
  .el-table thead, .hostSite {
    line-height: 0px!important;
  }
</style>