import { message } from 'ant-design-vue'
import request, { IPage, IWorkspaceResponse } from '/@/api/http/request'
import { ELocalStorageKey } from '/@/types'
import { CURRENT_CONFIG } from '/@/api/http/config'
import axios from 'axios'
import { login } from '/@/api/manage'

const HTTP_PREFIX = '/media/api/v1'

// Get Media Files
export const getMediaFiles = async function (wid: string, pagination: IPage): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/files/${wid}/files?page=${pagination.page}&page_size=${pagination.page_size}`
  const result = await request.get(url)
  return result.data
}
// Download Media File
export const downloadMediaFile = async function (workspaceId: string, fileId: string): Promise<any> {
  const url = `${HTTP_PREFIX}/files/${workspaceId}/file/${fileId}/url`
  const result = await request.get(url, { responseType: 'blob' })
  if (result.data.type === 'application/json') {
    const reader = new FileReader()
    reader.onload = function (e) {
      const text = reader.result as string
      const result = JSON.parse(text)
      message.error(result.message)
    }
    reader.readAsText(result.data, 'utf-8')
  } else {
    return result.data
  }
}

// 以下为自定义HTTP获取,302后的地址
function getAuthToken () {
  return localStorage.getItem(ELocalStorageKey.Token)
}

function get302UrlResponse (url: string, callback: (red: string) => void) {
  let xhr = new XMLHttpRequest()
  xhr.open('GET', url, true)
  xhr.onload = function () {
    console.log('XMLHttpRequest.', xhr.responseURL)
    callback(xhr.responseURL)
  }
  xhr.setRequestHeader(ELocalStorageKey.Token, getAuthToken()!!)
  xhr.send(null)
}

const myInstance = axios.create({
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 12000,
})
myInstance.interceptors.request.use(
  config => {
    config.headers[ELocalStorageKey.Token] = getAuthToken()
    // config.headers[REQUEST_ID] = uuidv4()
    config.baseURL = CURRENT_CONFIG.baseURL
    return config
  },
  error => {
    if (error.response.status === 302) {
      console.log('ERROR', error.response)
    } else {
      return Promise.reject(error)
    }
  })

export const getMediaFileUrl = async function (workspaceId: string, fileId: string) {
  // const newUrl = `/media/api/v1/files/${workspaceId}/file/${fileId}/url`
  // await myInstance.get(newUrl).then(res => {
  //   console.log('getMediaFileUrl', res)
  // })

  // const url = `${CURRENT_CONFIG.baseURL}media/api/v1/files/${workspaceId}/file/${fileId}/url`
  //  // let headers = new Map<string, string | null>()
  //  get302UrlResponse(url, ossUrl => {
  //    console.log('ossUrl', ossUrl)
  //  })
  const url = `${CURRENT_CONFIG.baseURL}media/api/v1/files/${workspaceId}/file/${fileId}/url`
  let headers = new Headers()
  headers.append(ELocalStorageKey.Token, getAuthToken()!!)
  // console.log('getMediaFileUrl token:', JSON.stringify(headers))
  let response = await fetch(url, {
    redirect: 'manual',
    headers: headers
  })
  console.log('getMediaFileUrl', response)
  return response.url
  // console.log(response)
  // if (response.status === 302) {
  //   return response.url
  // }
  // console.log('getMediaFileUrl http status', response.status)
  // // console.log(response)
  // // console.log(response.url)
  // return null
}
