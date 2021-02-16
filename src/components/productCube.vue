<template>
  <div class="productInfo">
    <div class="imgWrap">
      <img :src="productInfo.downLoadImgUrl" alt="">
    </div>
    <div class="content">
      <div class="productTitle">{{productInfo.productName}}</div>
      <div class="productSubTitle">{{productInfo.subName}}</div>
      <div class="productPrice">
        <span>¥{{productInfo.forSalePrice}}</span>
        <span>原价：{{productInfo.price}}</span>
      </div>
      <div class="bottom">
        <span>{{productInfo.commentCount}}评价</span>
        <span>{{productInfo.DistributionMode}}</span>
      </div>
    </div>
    <div class="editor">编辑</div>
  </div>
</template>
<script>
import {reactive, toRefs} from 'vue'

export default ({
  name: "productCube",
  props:{
    productInfo: Object
  },
  setup(){
    let productData = reactive({
    })

    return{
      ...toRefs(productData)
    }
  }
})
</script>

<style scoped>
  .productInfo{
    height: 20rem;
    width: 15rem;
    display: flex;
    flex-direction: column;
    line-height: 10px;
    justify-content: space-between;
    border: 1px solid #ccc;
    position: relative;
  }
  .editor{
    position:absolute;
    top: .5rem;
    right: .5rem;
    background: rgb(19, 150, 19);
    width: 3rem;
    height: 1.5rem;
    line-height: 1.5rem;
    border-radius: 3px;
    cursor: pointer;
    color: rgb(235, 224, 209);
  }
  .imgWrap img{
    width: 15rem;
    height: 15rem;
  }
  .imgWrap{
    display: flex;
  }
  .content{
    flex:1;
    display:flex;
    flex-direction: column;
    padding: .5rem .5rem 0 .5rem;
    height: 4rem;
    font-size: 14px;
    box-sizing: border-box;
  }
  .productTitle,.productSubTitle,.bottom, .productPrice{
    flex:1;
    display:flex;
  }
  .bottom, .productPrice{
    font-size: 12px;
    display:flex;
    justify-content: space-between
  }
</style>