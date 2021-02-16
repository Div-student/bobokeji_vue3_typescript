<template>
  <div class="about" v-loading='deletLoading'>
    <div class="addpic">
     <span class="btnItem" @click="addLunbotu">新增轮播图</span> 
    </div>
    <div class="wrap" v-for="item in lunbotuList" :key="item.id">
      <div class="imgs">
        <img class="pic" :src="item.download_url" alt="">
      </div>
      <div class="opearator">
        <div class="clickItem" @click="deletImg(item.fileid)">删除</div>
        <div class="clickItem" @click="relateTo(item.pic_id)">关联商品</div>
      </div>
    </div>

    <!-- 图片上传对话框 -->
    <el-dialog title="轮播图上传" v-model="dialogTableVisible">
      <div v-loading="dailogLoading">
        <el-upload
        class="upload-demo"
        action="api/getPic/add"
        :multiple="false"
        :show-file-list='false'
        :limit="1"
        :on-success='uploadSuccess'
        :before-upload="starUpload"
        >
          <el-button size="small" type="primary">点击上传</el-button>
          <template #tip>
            <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
          </template>
        </el-upload>
      </div>
    </el-dialog>

    <!-- 关联商品对话框 -->
    <el-dialog title="选择关联商品" v-model="toProductVisible">
      <el-table :data="gridData" @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column property="downLoadImgUrl" label="图片" width="150">
          <template #default="scope">
            <img class="tableImg" :src="scope.row.downLoadImgUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column property="productName" label="商品名" width="200"></el-table-column>
        <el-table-column property="productDsc" label="商品描述"></el-table-column>
      </el-table>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelDailog">取 消</el-button>
          <el-button type="primary" @click="confirmRelate">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 删除商品对话框-->
    <el-dialog title="选择关联商品" v-model="deletProductVisible">
      <template #footer>
        <span class="dialog-footer">
          <div class="tipTitle">您确定要删除该轮播图吗？</div>
          <el-button @click="cancelDelete">取 消</el-button>
          <el-button type="primary" @click="confirmDelete">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import {Vue} from 'vue-class-component'
import {ref, reactive, defineComponent, onBeforeMount, toRefs} from 'vue'
import { getLunBoTu, linktoProduct, deletPic, addPic} from '@/api/lunbotu'
import { getProductList} from '@/api/product'

interface picList {
  download_url: string,
  fileid: string,
  id: string
}

interface defaultData {
  lunbotuList: picList[],
}

interface uploadData {
  dialogTableVisible: boolean
  dailogLoading: boolean
}

interface productList {
  downLoadImgUrl: string,
  productName: string,
  productDsc: string,
  productId: string
}
interface relateToProductData {
  picId:string,
  toProductVisible:boolean,
  multipleTable:any,
  selectedId: string,
  loading:boolean,
  gridData:productList[]
}

export default defineComponent({
  name: "lunbotu",
  setup() {
    let data:defaultData = reactive({
      lunbotuList:[],
    })
    let uploadData:uploadData = reactive({
      dialogTableVisible: false,
      dailogLoading: false,
      addLunbotu: () => {
        uploadData.dialogTableVisible = true
      },
      uploadSuccess:async() => {
        let lunbotuList:any = await getLunBoTu({})
        if(lunbotuList.lunbotu && lunbotuList.lunbotu.length > 0){
          data.lunbotuList = lunbotuList.lunbotu
        }
        uploadData.dialogTableVisible = false
        uploadData.dailogLoading = false
      },
      starUpload(){
        uploadData.dailogLoading = true
      }
    })

    let relateToProductData:relateToProductData = reactive({
      gridData: [],
      multipleTable: ref(null),
      toProductVisible: false,
      selectedId: '',
      picId: '',
      loading: false,
      handleSelectionChange(value:any){
        relateToProductData.selectedId = value[0].productId
        if(value.length > 1){
          relateToProductData.multipleTable.toggleRowSelection(value[0]);
        }
      },
      relateTo: async (picId:string) => {
        relateToProductData.toProductVisible = true
        relateToProductData.loading = true
        let ResList:any = await getProductList({
          pageNumb: 0,
          pageCount: 10
        })
        relateToProductData.gridData = ResList.resultList
        relateToProductData.picId = picId
        relateToProductData.loading = false
      },
      confirmRelate: async() => {
        relateToProductData.loading = true
        try {
          let resID = await linktoProduct({picId:relateToProductData.picId, productId:relateToProductData.selectedId})
          relateToProductData.toProductVisible = false
          relateToProductData.loading = false
        } catch (error) {
          console.log(error)
          relateToProductData.loading = false
        }
      },
      cancelDailog(){
        relateToProductData.toProductVisible = false
      }
    })

    let deletData = reactive({
      deletLoading:false,
      deletProductVisible:false,
      fileid: '',
      deletImg: async (fileid:string) => {
        deletData.deletProductVisible = true
        deletData.fileid = fileid
      },
      cancelDelete(){
        deletData.deletProductVisible = false
      },
      confirmDelete: async () => {
        deletData.deletLoading = true
        await deletPic({fileid:deletData.fileid})
        let lunbotuList:any = await getLunBoTu({})
        deletData.deletLoading = false
        deletData.deletProductVisible = false
        if(lunbotuList.lunbotu && lunbotuList.lunbotu.length > 0){
          data.lunbotuList = lunbotuList.lunbotu
        }
      }
    })

    onBeforeMount(async () => {
      let lunbotuList:any = await getLunBoTu({})
      if(lunbotuList.lunbotu && lunbotuList.lunbotu.length > 0){
        data.lunbotuList = lunbotuList.lunbotu
      }
    })

    return {
      ...toRefs(data),
      ...toRefs(uploadData),
      ...toRefs(relateToProductData),
      ...toRefs(deletData)
    }
  }
})
</script>

<style scoped>
.wrap{
  display: flex;
  height: 5rem;
  justify-content: space-between;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  box-shadow: 5px 8px 10px #666;
}
.pic, .imgs{
  height: 5rem;
  width: 10rem;
}
.imgs{
  flex: 8;
  display: flex;
  justify-content: flex-start;
  align-items: center
}
.opearator{
  display: flex;
  background: wheat;
  flex: 3;
  align-items: center;
  justify-content: space-around
}
.clickItem{
  height: 100%;
  line-height: 5rem;
  cursor: pointer;
}
.addpic{
  height: 2rem;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-sizing: border-box;
}
.about{
  display: flex;
  flex-direction: column
}
.btnItem{
  border: 1px solid burlywood;
  height: 2rem;
  line-height: 2rem;
  padding: 0 .5rem;
  cursor: pointer;
  margin-bottom: 1rem;
}
.tableImg{
  height: 3rem;
  width: 3rem;
}
</style>
<style>
.el-dialog__header{
  line-height: 0!important;
}
.el-table__footer-wrapper, .el-table__header-wrapper {
  line-height: 0!important;
}
.el-dialog{
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5vh!important;
  /* height: 100vh!important; */
}
.el-table--fit {
  height: 65vh;
}
.tipTitle{
  text-align: center
}
</style>