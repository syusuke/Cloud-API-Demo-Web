import request, { IWorkspaceResponse } from '/@/api/http/request'

const HTTP_PREFIX = '/iot'

// getBrowserLiveUrl
export const getBrowserLiveUrl = async function (sn: string): Promise<IWorkspaceResponse<any>> {
    const url = `${HTTP_PREFIX}/live/getBrowserLiveUrl/${sn}`
    const result = await request.get(url)
    return result.data
}

export const iotStopLive = async function (sn: string): Promise<IWorkspaceResponse<any>> {
    const url = `${HTTP_PREFIX}/live/stopLive/${sn}`
    const result = await request.get(url)
    return result.data
}
