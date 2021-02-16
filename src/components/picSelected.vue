<template>
  <el-container>
    <el-aside width="200px">
      <div class="contentHead">
        <div>图片目录</div>
      </div>
      <div :class="{imgClass:true, active:activeFlag[index]}" v-for="(item,index) in contentList" :key="index" @click="viewPic(item, index)">{{item}}
      </div>
    </el-aside>
    <el-main v-loading="loading">
      <div class="imgTitle">
        <div class="imgTitle"><el-button type="success" round @click='onSure'> 确定 </el-button></div>
      </div>
      <div class="imgWrap">
        <div class="imgItems" v-for="(item, index) in imageList" :key="item._id">
          <el-checkbox v-model="checked[index]" class="checkbox" ></el-checkbox>
          <img :src="item.download_url"/>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted} from 'vue'
import { getImageClass, updateImageClass, queryImageList } from '@/api/picManager'


export default defineComponent({
  name: 'picManager',
  setup(props, ctx){
    let picData:any = reactive({
      inputValue:"",
      contentList: [],
      currentIndex: '',
      activeFlag:[],
      imageList:[],
      checked: [],
      loading: false,
      viewPic: async function(item:boolean, index:number){
        picData.loading = true
        picData.currentIndex = index
        picData.activeFlag.forEach((element:boolean, i:number) => {
          picData.activeFlag[i] = false
          if(i == index){
            picData.activeFlag[i] = true
          }
        });

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
      }
    })
    let onSure = () => {
      let resList:any = []
      picData.checked.forEach((item:boolean, index:number) => {
        if(item){
          resList.push(picData.imageList[index])
        }
      })
      ctx.emit('selectedPic', resList)
    }
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
      ...toRefs(picData),
      onSure
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