export interface LiveVideoState {
  mode: number
}

export interface VideoInfo {
  index: string
  switchVideoTypes: string[] | undefined
  type: string | undefined
}

export interface CameraInfo {
  index: string,
  name: string | undefined
  videoList: VideoInfo[] | undefined
}

export interface LiveCapacity {
  id: string,
  index: string,
  name: string,
  videos_list: VideoInfo[]
}

export interface LiveVideoInfo {
  sn: string,
  cameraInfos: CameraInfo[] | undefined
}

export interface LiveFlvInfo {
  sn: string,
  name: null | string,
  cameraIndex: string,
  cameraInfo: CameraInfo,
  isPayloadIndex: boolean,
  payloadSn: null | string
}
