import { IWorkspaceResponse } from '/@/api/http/request'
import axios from 'axios'
import { CURRENT_CONFIG } from '/@/api/http/config'

const flightRequest = axios.create({
  // withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 12000,
})

flightRequest.interceptors.request.use(
  config => {
    config.baseURL = CURRENT_CONFIG.flightBaseUrl
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

// getBrowserLiveUrl
export const getLiveUrlBySn = async function (sn: string, cameraIndex: string | undefined): Promise<IWorkspaceResponse<any>> {
  let query = ''
  if (cameraIndex !== undefined) {
    query = `?cameraIndex=${cameraIndex}`
  }
  const url = `live/getLiveUrl/${sn}${query}`
  const result = await flightRequest.get(url)
  return result.data
}

export const stopLiveBySn = async function (sn: string): Promise<IWorkspaceResponse<any>> {
  const url = `live/stopLive/${sn}`
  const result = await flightRequest.get(url)
  return result.data
}
