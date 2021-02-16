import http from '../utils/http'

export const  addImages = function (params: any){
  return http({
    url: 'api/pic/add',
    method: 'post',
    data:params
  })
}

export const  deletImages = function (params: any){
  return http({
    url: 'api/pic/delete',
    method: 'post',
    data:params
  })
}

export const  updateImageClass = function (params: any){
  return http({
    url: 'api/pic/updataInageClass',
    method: 'post',
    data:params
  })
}

export const  getImageClass = function (params: any){
  return http({
    url: 'api/pic/getInageClass',
    method: 'get',
    params: {
      ...params
    },
  })
}

export const  queryImageList = function (params: any){
  return http({
    url: 'api/pic/query',
    method: 'get',
    params: {
      ...params
    },
  })
}
