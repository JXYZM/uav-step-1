/*
method.js
post 定义
*/
import request from '../utils/request'

export async function myPost(params) {
  //debugger
  //const reqHeader = getAuthRequestHeader()
  return request('/dev/', {
    method: 'POST',
    // timeout: 180000,
    // headers: {
    //   hi: "hello"
    // },
    body: JSON.stringify(params),
  })
}
