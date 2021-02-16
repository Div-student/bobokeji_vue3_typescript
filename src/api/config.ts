import http from '../utils/http'

export const  getConfigs = function (params: any){
  return http({
    url: 'api/config/get',
    method: 'get',
    params: {
      ...params
    },
  })
}

export const  updateConfigs = function (params: any){
  return http({
    url: 'api/config/update',
    method: 'post',
    data: params
  })
}


