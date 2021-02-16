<template>
  <div class="hello">
     <!-- 关联商品对话框 -->
    <el-dialog title="核销商品列表" v-model="toProductVisible" :close-on-click-modal='onClose' :show-close="onClose" :fullscreen="!onClose">
      <el-table :data="gridData" @selection-change="handleSelectionChange" ref="multipleTable" v-loading="loading">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column property="downLoadImgUrl" label="图片" width="50">
          <template #default="scope">
            <img class="tableImg" :src="scope.row.downLoadImgUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column property="productName" label="商品名" width="200"></el-table-column>
        <el-table-column property="exchangeScore" label="兑换积分"></el-table-column>
        <el-table-column property="verifyRes" label="是否核销"></el-table-column>
        <el-table-column label="操作">
        <template #default="scope">
          <el-button size="mini" type="danger" @click="handleVerify(scope.$index, scope.row)" :disabled="scope.row.verify">核销</el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import {Vue} from 'vue-class-component'
import {ref, reactive, defineComponent, toRefs, onMounted} from 'vue'
import { getMyOrderList, updateMyOrderList} from '@/api/product'

interface productList {
  downLoadImgUrl: string,
  productName: string,
  productId: string,
  exchangeScore: number,
  forSalePrice: number,
  openId: string,
  productImage: string,
  verify: boolean,
  _id: string,
  verifyRes: string
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
    let relateToProductData:relateToProductData = reactive({
      gridData: [],
      multipleTable: ref(null),
      toProductVisible: true,
      selectedId: '',
      picId: '',
      loading: false,
      onClose: false,
      handleSelectionChange(value:any){
        relateToProductData.selectedId = value[0].productId
        if(value.length > 1){
          relateToProductData.multipleTable.toggleRowSelection(value[0]);
        }
      },
      cancelDailog(){
        relateToProductData.toProductVisible = false
      }
    })

    let handleVerify = async(index:any, row:any)=>{
      relateToProductData.loading = true
      let res = await updateMyOrderList({
        _id: row._id,
      })
      getOrderList()
      relateToProductData.loading = false
    }

    let getOrderList = async()=>{
      let tempUrl = (location.search).split('&')[0]
      let id = ''
      if(tempUrl){
        let tempParam = tempUrl.split('=')
        id = tempParam[1]
      }
      let ResList:any = await getMyOrderList({
          pageNumb: 0,
          pageCount: 1000,
          openId: id || "ooGnK5SlW35jcaS0rkyvC6W25JiM"
        })
        let temRes = ResList.data.data
        relateToProductData.gridData = temRes.map((res:any) => {
          res.verifyRes = res.verify?'已核销':'未核销'
          return res
        })
    }

    onMounted(async() => {
     getOrderList()
    })
    return {
      ...toRefs(relateToProductData),
      handleVerify
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
.hello .el-table{
  overflow: auto;
}
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
