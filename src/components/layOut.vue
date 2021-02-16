<template>
  <el-container>
    <el-header>波波科技管理后台</el-header>
    <el-container>
      <el-aside width="200px">
        <div v-for="(item, index) in navyList" :key="index">
          <router-link :to="item.path">{{item.label}}</router-link>
        </div>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script lang="ts">

import { defineComponent, reactive, toRefs } from 'vue'
import { Options, Vue } from 'vue-class-component';

export default defineComponent({
  name: 'layout',
  setup(){
      const handleOpen = function (key:any, keyPath:any) {
        console.log(key, keyPath);
      }

      const handleClose = function (key:any, keyPath:any) {
        console.log(key, keyPath);
      }

      const data = reactive({
        navyList: [
          {
            label: "轮播图",
            path: "/lunbotu"
          },
          {
            label: "图片管理",
            path: "/picManager"
          },
          {
            label: "商品管理",
            path: "/productManagement"
          },
          {
            label: "商品配置",
            path: "/config"
          }
        ]
      })


    return {
      ...toRefs(data),
      handleOpen,
      handleClose
    }
  }
})
</script>
<style  scoped>
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }
  
  body > .el-container {
    margin-bottom: 40px;
  }
  .el-container.is-vertical{
    height: 100vh;
  }
  
  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }
  
  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
  .el-aside{
    width: 5rem!important;
    line-height: 5rem!important;
  }
</style>