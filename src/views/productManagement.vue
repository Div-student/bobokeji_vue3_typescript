<template>
  <div class="productWrap" v-loading="loadingFlag">
    <div class="addProduct">
      <span @click="deletProducts">删除商品</span>
      <span @click="addProduct">新增商品</span>
    </div>
    <!-- 商品展示 -->
    <div class="products">
      <div v-for="(item, index) in productInfors" :key="index" class="productsWrap">
        <el-checkbox v-model="checked[index]" class="checkbox" ></el-checkbox>
        <productCube class="productCube" :productInfo="item" @click="onEditor(index)"></productCube>
      </div>
    </div>

    <!-- 编辑商品对话框 -->
    <el-dialog :title="dialogTittle" v-model="dialogFormVisible" destroy-on-close>
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品分类" :label-width="formLabelWidth">
              <el-select v-model="form.productType" placeholder="请选择商品分类">
                <el-option v-for="(item, index) in classList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品热销分类" :label-width="formLabelWidth">
              <el-select v-model="form.hotType" placeholder="请选择热销分类">
                <el-option v-for="(item, index) in hotClassList" :key="index" :label="item.name" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品名称" :label-width="formLabelWidth">
              <el-input v-model="form.productName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品小标题" :label-width="formLabelWidth">
              <el-input v-model="form.subName" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品价格" :label-width="formLabelWidth">
              <el-input v-model="form.price" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="推销价格" :label-width="formLabelWidth">
              <el-input v-model="form.forSalePrice" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品描述" :label-width="formLabelWidth">
              <el-input v-model="form.productDsc" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品评论数" :label-width="formLabelWidth">
              <el-input v-model="form.commentCount" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品品牌" :label-width="formLabelWidth">
              <el-input v-model="form.productBrand" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品评分" :label-width="formLabelWidth">
              <el-input v-model="form.productScore" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="库存数量" :label-width="formLabelWidth">
              <el-input v-model="form.inventory" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="配送方式" :label-width="formLabelWidth">
              <el-select v-model="form.DistributionMode" placeholder="请选择配送方式">
                <el-option label="快递" value="express"></el-option>
                <el-option label="到店领取" value="person"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否积分兑换" :label-width="formLabelWidth">
              <el-radio-group v-model="form.isExchange">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否上架" :label-width="formLabelWidth">
              <el-radio-group v-model="form.onShelf">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  label="封面图片" :label-width="formLabelWidth">
              <div class="imgs">
                <img class="fistPic" :src="form.downLoadImgUrl" alt="">
                <div class="addFistPic" v-if="form.downLoadImgUrl?false:true" @click="selectPic('封面')">新增</div>
                <div class="addFistPic" v-else @click="selectPic('封面')">修改</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品详情" :label-width="formLabelWidth">
              <div class="editorDetail" @click="editorDetail">编辑详情</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateProducts">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 图片对框 -->
    <teleport to="body">
      <div class="picWrapList" v-if="picDialog">
        <picSelected @selectedPic="selectedPic"></picSelected>
      </div>
    </teleport>

    <!-- 编辑商品详情对话框 -->
    <el-dialog title="商品详情" v-model="dialogDetail" destroy-on-close>
      <div class="detailWrap">
        <div class="detailItem">
          <div class='detailTitle'> <span>详情轮播图：</span> <span class="selectedImg" @click="selectPic('详情轮播')">选择图片</span></div>
          <div class="content">
            <span class="imgWrap" v-for="(item, index) in RotationImgList" :key="index">
              <span class="closeImge">X</span>
              <img :src="item.download_url" alt="">
            </span>
          </div>
        </div>
        <div class="detailItem">
          <div class='detailTitle'> <span>商品详情图：</span> <span class="selectedImg" @click="selectPic('详情介绍')">选择图片</span></div>
          <div class="content">
            <span class="imgWrap" v-for="(item, index) in productIdDetailImgList" :key="index">
              <span class="closeImge">X</span>
              <img :src="item.download_url" alt="">
            </span>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogDetail = false">取 消</el-button>
          <el-button type="primary" @click="updateProducts">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
  
</template>
<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import productCube from '../components/productCube.vue'
import picSelected from '../components/picSelected.vue'
import { getProductList, updateProduct, addProducts, deleteProduct} from '@/api/product'
import { getConfigs, updateConfigs } from '@/api/config'
export default defineComponent({
  name: 'productManagement',
  components:{ productCube, picSelected },
  setup(){
     const cubeData = reactive({
        productInfors: [
          {
          productId: "11111",
          productType: "hot",
          hotType:"hot",
          productName: "黑暗极光香橙巧克力蛋糕",
          subName:"深沉黑夜，神秘极光",
          price: 123,
          forSalePrice: 88,
          productImge:"",
          productDsc:"",
          commentCount:23,
          DistributionMode: "express",
          RotationImg:[],
          productIdDetailImg:[],
          productScore: 4.5,
          productBrand: "bobo",
          onShelf: true,
          isExchange: true,
          downLoadImgUrl: ""
        }]
      })

      // 获取商品列表
      const getProducts = async (pageNumb:number, pageCount:number) => {
        editorData.loadingFlag = true
        let res:any = await getProductList({
          pageNumb,
          pageCount
        })
        cubeData.productInfors =  res.resultList
        paginationData.total = res.count || 10
        deletProductData.checked = Array(res.count).fill(false) //初始化选中状态
        editorData.loadingFlag = false
      }
      
      // 编辑商品逻辑
      const editorData = reactive({
        dialogFormVisible: false,
        form: {
          downLoadImgUrl:'',
          productImge: ''
        },
        formLabelWidth: '120px',
        loadingFlag: false,
        dialogTittle: '编辑商品',
        classList: [], //商品分类
        hotClassList: [
          {
            name: "创意网红",
            value: "internetCelebrity"
          },
          {
            name: "当日达",
            value: "currentday"
          },
          {
            name: "热卖",
            value: "hotSall"
          },
          {
            name: "全部",
            value: "all"
          },
        ] //商品分类
      })
      let getConfig = async() => {
        let res:any = await getConfigs({})
        if(res.code == 200 && res.resultList.length > 0){
          let tempres = res.resultList[0]
          editorData.classList = tempres.classList
          console.log(editorData.classList)
        }
      } 

      // 新增商品逻辑
      let addProduct = () => {
        editorData.dialogTittle = "新增商品";
        editorData.dialogFormVisible = true
      }

      // 删除商品逻辑
      let deletProductData = reactive({
        checked: [true],
      })
      let deletProducts = async() => {
        editorData.loadingFlag = true
        let productsId:any = []
        deletProductData.checked.forEach((item:any, index:number)=> {
          if(item){
            productsId.push(cubeData.productInfors[index].productId)
          }
        })
        await deleteProduct({productIdList:productsId})
        editorData.loadingFlag = false
        getProducts(0, 10)
      }
      
      // 分页逻辑
      const paginationData = reactive({
        currentPage: 1,
        pageSize: 10,
        total: 0,
      })
      let handleSizeChange = (val:any) => {
        paginationData.pageSize = val
        getProducts((paginationData.currentPage-1)*val, val)
      }
      let handleCurrentChange = (val:any) => {
        paginationData.currentPage = val
        getProducts((val-1)*(paginationData.pageSize), paginationData.pageSize)
      }

      let onEditor = function(index:number){
        editorData.dialogTittle = "编辑商品"
        editorData.dialogFormVisible = true
        editorData.form = JSON.parse(JSON.stringify(cubeData.productInfors[index]))
      }

      // 更新商品
      const updateProducts = async () => {
        editorData.loadingFlag = true
        editorData.dialogFormVisible = false
        let tempData:any = editorData.form
        let tempProductId = editorData.dialogTittle === "新增商品"?new Date().getTime() + tempData.productType:tempData.productId
        let params:any = {
          productType: tempData.productType,
          hotType: tempData.hotType,
          productName: tempData.productName,
          subName: tempData.subName,
          price: tempData.price,
          forSalePrice: tempData.forSalePrice,
          commentCount: tempData.commentCount,
          DistributionMode: tempData.DistributionMode,
          productScore: tempData.productScore,
          productBrand: tempData.productBrand,
          onShelf: tempData.onShelf || true,
          isExchange: tempData.isExchange || true,
          productId: tempProductId,
          productImge: tempData.productImge,
          inventory: tempData.inventory,
          productDsc: tempData.productDsc,
        }
        if(editorData.dialogTittle === "编辑商品"){
          await updateProduct(params)
        }else{
          params.RotationImg = []
          await addProducts(params)
        }
        if(selectedPicdate.selectPicType === '详情轮播' || selectedPicdate.selectPicType === '详情介绍'){
          let tempRotalImgs = productDetailData.RotationImgList.map(res => {
            return res.fileId
          })
          let tempDetailImgList = productDetailData.productIdDetailImgList.map(res => {
            return res.fileId
          })
          params = {
            productId: tempProductId,
            RotationImg: tempRotalImgs,
            productIdDetailImg: tempDetailImgList
          }
          await updateProduct(params)
        }
        getProducts((paginationData.currentPage-1)*(paginationData.pageSize), paginationData.pageSize)
      }

      // 选择图片逻辑
      const selectedPicdate = reactive({
        picDialog: false,
        selectPicType: ''
      })
      let selectPic = (flag:string)=>{
        selectedPicdate.picDialog = true
        selectedPicdate.selectPicType = flag
      }
      let selectedPic = (e:any) => {
         selectedPicdate.picDialog = false
         if(e&&e.length>0 && e[0].download_url){
          if(selectedPicdate.selectPicType === '详情轮播'){
            productDetailData.RotationImgList = e
          }else if(selectedPicdate.selectPicType === '封面'){
            editorData.form.downLoadImgUrl = e[0].download_url
            editorData.form.productImge = e[0].fileId
          }else if(selectedPicdate.selectPicType === '详情介绍'){
            productDetailData.productIdDetailImgList = e
          }
         }
      }

      // 编辑商品详情逻辑
      let productDetailData = reactive({
        dialogDetail: false,
        RotationImgList: [{
          fileId: 'sddsdadsda',
          download_url:"https://626f-bobokeji-dev-1304094918.tcb.qcloud.la/lunbotu/1609665252388-0.5507940248957983-product11.jpg"
        }],
        productIdDetailImgList:[{
          fileId: 'sddsdadsda',
          download_url:"https://626f-bobokeji-dev-1304094918.tcb.qcloud.la/lunbotu/1609665252388-0.5507940248957983-product11.jpg"
        }]
      })
      let editorDetail= ()=>{
        productDetailData.dialogDetail = true
      }

      onMounted(()=>{
        getProducts(0, 10)
        getConfig()
      })
    return{
      getProducts,
      ...toRefs(cubeData),
      onEditor,
      ...toRefs(editorData),
      handleSizeChange,
      handleCurrentChange,
      ...toRefs(paginationData),
      updateProducts,
      addProduct,
      ...toRefs(selectedPicdate),
      selectPic,
      selectedPic,
      getConfig,
      ...toRefs(deletProductData),
      deletProducts,
      ...toRefs(productDetailData),
      editorDetail
    }
  }
})
</script>

<style scoped>
  /* .pagination{
    position:absolute;
    bottom: 1px;
    right: 1rem;
  } */
  .products{
    width:100%;
    display: flex;
    flex-wrap: wrap;
    flex:1;
  }
  .productsWrap{
    position: relative;
  }
  .checkbox{
    position:absolute;
    top: 1rem;
    left: 2rem;
    z-index: 1000;
  }
  .productCube{
    margin: .5rem .8rem;
  }
  .productWrap{
    display: flex;
    flex-direction: column;
    /* height: 100%; */
  }
  .addProduct{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 1rem;
    padding: .5rem .5rem 0 0;
  }
  .addProduct span{
    margin-right: .5rem;
    border: 1px solid #ccc;
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 2px;
    cursor: pointer;
  }
  .imgs{
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 3rem;
  }
  .addFistPic{
    cursor: pointer;
    border: 1px solid #ccc;
    height: 1.5rem;
    line-height: 1.5rem;
  }
  .fistPic{
    outline: 1px dashed #ccc;
    margin-right: 1rem;
    width: 3rem;
    height: 3rem;
  }
  .picWrapList{
    width:100%;
    height: 100%;
    position: fixed;
    top:0;
    right: 0;
    background: rgba(0, 0, 0, .5);
    z-index: 10000;
  }
  .editorDetail{
    color: aqua;
    cursor: pointer;
    text-decoration: underline;
  }
  .detailWrap{
    display: flex;
    flex-direction: column;
    height: 50vh;
  }
  .detailItem{
    width:100%;
    flex:1;
    margin-top: .5rem;
    display: flex;
    flex-direction: column;
  }
  .detailItem div{
    width:100%;
    flex:1;
    margin-top: .5rem;
  }
  .detailItem .content{
    width:100%;
    flex:10;
    margin-top: .5rem;
    display: flex;
    justify-content: flex-start;
  }
  .imgWrap{
    position: relative;
  }
  .closeImge{
    display: inline-block;
    width: 1rem;
    height: 1rem;
    text-align: center;
    line-height: 1rem;
    color: white;
    background: #ccc;
    position: absolute;
    top: .5rem;
    right: 1rem;
    cursor: pointer;
  }
  .detailItem .content img{
    width: 5rem;
    height: 6.5rem;
    margin-right: .5rem;
  }
  .detailTitle{
    display: flex;
    justify-content: space-between;
  }
  .selectedImg{
    cursor: pointer;
  }
</style>
<style>
  .el-dialog{
    line-height: 0!important;
  }
  .el-aside{
    width: 5rem
  }
  .el-pagination{
    height: 2rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: .5rem;
  }
  .el-main{
    line-height: 0!important;
    box-sizing: border-box;
    padding: 0;
  }
  body {
    overflow: hidden;
  }
</style>