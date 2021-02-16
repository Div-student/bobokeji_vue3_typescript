<template>
  <el-container>
    <el-aside width="200px">
      <div class="contentHead">
        <div>图片目录</div>
        <div class="imgPlus" @click="centerDialogVisible = true">+</div>
      </div>
      <div :class="{imgClass:true, active:activeFlag[index]}" v-for="(item,index) in contentList" :key="index" @click="viewPic(item, index)">{{item}}
        <span class="delet" @click.stop="deletContent(item,index)" v-if="item !== '全部'">X</span>
      </div>
    </el-aside>
    <el-main v-loading="loading">
      <div class="imgTitle">
        <div class="imgTitle"><el-button type="success" round @click='dialogTableVisible = true'> 上传图片</el-button></div>
        <div class="imgTitle"><el-button type="success" round @click='deleteImages'> 删除图片</el-button></div>
      </div>
      <div class="imgWrap">
        <div class="imgItems" v-for="(item, index) in imageList" :key="item._id">
          <el-checkbox v-model="checked[index]" class="checkbox" @change='boxChange(index)'></el-checkbox>
          <img :src="item.download_url"/>
        </div>
      </div>
    </el-main>
    <!-- 弹出对话框 -->
    <el-dialog
      title="提示"
      v-model="centerDialogVisible"
      width="30%"
      center>
      <el-input placeholder="请输入图片分类名称" v-model="inputValue"></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="enterText">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 图片上传对话框 -->
    <el-dialog title="图片上传" v-model="dialogTableVisible">
        <div v-loading="dailogLoading">
          <el-upload
          ref="uploadPic"
          class="upload-demo"
          :action="uploadUrl"
          :multiple="true"
          :show-file-list='true'
          :limit="5"
          :on-success='uploadSuccess'
          :before-upload="starUpload"
          :auto-upload="false"
          :file-list="fileList"
          >
            <el-button size="small" type="primary">选择图片</el-button>
            <el-button size="small" type="primary" @click.stop="submitUpload">确定上传</el-button>
            <template #tip>
              <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
            </template>
          </el-upload>
        </div>
      </el-dialog>

      <!-- 删除对话框 -->
      <el-dialog title="提示" v-model="dialogDeletVisible">
        <div>您确定需要删除此分类吗？</div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogDeletVisible = false">取 消</el-button>
            <el-button type="primary" @click="enterDelet">确 定</el-button>
          </span>
        </template>
      </el-dialog>
  </el-container>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted} from 'vue'
import { getImageClass, updateImageClass, queryImageList, deletImages } from '@/api/picManager'
import { ElMessage } from 'element-plus'


export default defineComponent({
  name: 'picManager',
  setup(){
    let picData:any = reactive({
      dialogDeletVisible:false,
      dailogLoading: false,
      inputValue:"",
      contentList: [],
      centerDialogVisible: false,
      dialogTableVisible: false,
      fileList:[],
      uploadPic: ref(null),
      currentIndex: '',
      activeFlag:[],
      uploadUrl: 'api/pic/add?picClass=详情图片',
      imageList:[],
      checked: [],
      loading: false,
      enterText(){
        picData.centerDialogVisible = false,
        picData.contentList.push(picData.inputValue)
        updateImageClass(picData.contentList)
      },
      viewPic: async function(item:boolean, index:number){
        picData.loading = true
        picData.currentIndex = index
        picData.activeFlag.forEach((element:boolean, i:number) => {
          picData.activeFlag[i] = false
          if(i == index){
            picData.activeFlag[i] = true
          }
        });
        picData.uploadUrl = `api/pic/add?picClass=${picData.contentList[index]}`

        let res:any = await queryImageList(
          {
            className: picData.contentList[index]
          }
        )
        picData.imageList = res.imageList
        picData.loading = false
        // 初始化图片选择
        picData.imageList.forEach(()=>{
          picData.checked.push(false)
        })
      },
      deletContent: async function(item:string,index:number){
        picData.dialogDeletVisible = true
        picData.currentIndex = index
      },
      submitUpload: async function () {
        let res = await picData.uploadPic.submit();
      },
      starUpload(){
        picData.dailogLoading = true
      },
      uploadSuccess: async() => {
        picData.dailogLoading = false
        picData.dialogTableVisible = false
        let results:any = await queryImageList({className: picData.contentList[picData.currentIndex]})
        picData.imageList = results.imageList
      },
      enterDelet: async() => {
        picData.dialogDeletVisible = false
        picData.contentList.splice(picData.currentIndex, 1)
        updateImageClass(picData.contentList)
      },
      boxChange(index:number){
        // picData.checked[index] = !picData.checked[index]
        console.log(picData.checked)
      },
      deleteImages:async() => {
        if(picData.checked.includes(true) == false){
          ElMessage.error('请选择你要删除的图片');
        }else{
          let fileIds:any = []
          picData.checked.forEach((res:boolean, index:number) => {
            if(res){
              fileIds.push(picData.imageList[index].fileId)
            }
          })
          picData.loading = true
          let result = await deletImages(fileIds)
          let results:any = await queryImageList({className: picData.contentList[picData.currentIndex]})
          picData.imageList = results.imageList
          picData.loading = false
        }
      }
    })
    onMounted(async ()=>{
      let classList:any = await getImageClass({})
      picData.contentList = classList.configList.picContent.split(',')
      // 图片类型样式
      picData.contentList.forEach((item:any, index:number)=>{
        if(index == 0){
          picData.activeFlag.push(true)
        }else{
          picData.activeFlag.push(false)
        }
      })
      let results:any = await queryImageList({})
      picData.imageList = results.imageList
    })
    return {
      ...toRefs(picData)
    }
  }
})
</script>
<style scoped>
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 2rem;
  }
  .imgClass{
    background: #666;
    height: 2rem;
    margin: .5rem 0;
    color: white;
    cursor: pointer;
    position: relative;
  }
  .active{
    background: #B3C0D1
  }
  .contentHead{
    height: 3rem;
    background: rgb(155, 153, 153);
    display: flex;
    justify-content:space-between;
    align-items: center;
    padding: 1rem;
    box-sizing: border-box;
  }
  .imgPlus{
    cursor: pointer;
  }
  .delet{
    color: #ccc;
    position: absolute;
    right: .5rem;
    font-size: 12px;
  }
  .el-main {
    background-color: #cccc;
    color: #333;
    text-align: center;
    height: 100vh;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .imgTitle{
    line-height: 0;
    display: flex;
    justify-content: flex-end
  }
  .imgWrap{
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    margin-top: 1rem;
  }
  .imgWrap .imgItems {
    width: 10rem;
    height: 10rem;
    border: 1px dashed #666;
    display: flex;
    align-items: center;
    margin-right: 1rem;
    box-shadow: 5px 5px 8px #666;
    position: relative;
  }
  .checkbox{
    position:absolute;
    top: .5rem;
    right: .5rem;
    z-index: 1;
  }
  .imgWrap .imgItems img {
    max-width: 100%;  
    max-height: 100%;     
    width: auto;  
    height: auto;  
  }
</style>
<style>
  .el-main {
    background-color: #cccc;
    color: #333;
    text-align: center;
    height: 100vh;
    line-height: 0px!important;
  }
</style>