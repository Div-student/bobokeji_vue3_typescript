import http from '../utils/http'

export const  getLunBoTu = function (params: any){
  return http({
    url: 'api/getPic/lunbotu',
    method: 'get',
    params: {
      ...params
    },
  })
}

export const  linktoProduct = function (params: any){
  return http({
    url: 'api/getPic/linkToProduct',
    method: 'get',
    params: {
      ...params
    },
  })
}

export const  deletPic = function (params: any){
  return http({
    url: 'api/getPic/delete',
    method: 'get',
    params: {
      ...params
    },
  })
}

export const  addPic = function (params: any){
  return http({
    url: 'api/getPic/add',
    method: 'post',
    data:params
  })
}