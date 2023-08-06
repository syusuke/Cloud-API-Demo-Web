export interface LiveVideoState {
    mode: number
}

export interface LiveVideoInfoItem {
    url: string,
    sn: string,
    cameraIndex: string,
    state: LiveVideoState
}
