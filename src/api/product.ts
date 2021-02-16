import http from '../utils/http'

export const  getProductList = function (params: any){
  return http({
    url: 'api/product/get',
    method: 'get',
    params: {
      ...params
    },
  })
}

export const  getMyOrderList = function (params: any){
  return http({
    url: 'api/orderList/list',
    method: 'get',
    params: {
      ...params
    },
  })
}

export const  updateMyOrderList = function (params: any){
  return http({
    url: 'api/orderList/update',
    method: 'post',
    data: params
  })
}

export const  deleteProduct = function (params: any){
  return http({
    url: 'api/product/delete',
    method: 'post',
    data: params
  })
}

export const  updateProduct = function (params: any){
  return http({
    url: 'api/product/update',
    method: 'post',
    data: params
  })
}

export const  addProducts = function (params: any){
  return http({
    url: 'api/product/add',
    method: 'post',
    data: params
  })
}
