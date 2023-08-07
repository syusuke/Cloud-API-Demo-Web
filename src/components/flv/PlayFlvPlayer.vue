<template>
  <div>
    <div class="player-item">
      <div :id="props.compentId" class="video-container"></div>
      <div class="flex-row flex-justify-center flex-align-center" v-if="isPayloadIndex">

        <template v-if="cameraMode === 0">
          <a-space wrap>
            <a-tag color="default">
              <template #icon>
                <camera-outlined/>
              </template>
              拍照模式
            </a-tag>
            <a-button type="primary" size="small" @click="requestPayloadControl" danger>获取负载控制权</a-button>
            <a-button type="primary" size="small" :disabled="!(photoState === 0)" @click="takePhoto">拍照</a-button>
          </a-space>
        </template>

        <template v-else-if="cameraMode === 1">
          <a-space wrap>
            <a-tag color="default">
              <template #icon>
                <video-camera-outlined/>
              </template>
              录制模式
            </a-tag>
            <a-button type="primary" size="small" @click="requestPayloadControl" danger>获取负载控制权</a-button>
            <a-button type="primary" size="small" :disabled="!(recordingState === 0)" @click="startRecording">开始录像
            </a-button>
            <a-button type="primary" size="small" :disabled="!(recordingState === 1)" @click="stopRecording">停止录像
            </a-button>
          </a-space>
        </template>

        <template v-else>
          <a-tag color="error">
            <template #icon>
              <question-circle-outlined/>
            </template>
            不支持拍照或者录像
          </a-tag>
        </template>

      </div>
      <div class="info">
        <a-input-search v-model:value="liveUrl" addon-before="播放URL" placeholder="视频直播URL"
                        @search="reloadVideoUrl">
          <template #enterButton>
            <a-button>加载</a-button>
          </template>
        </a-input-search>
      </div>

      <div class="flex-row flex-justify-center flex-align-center mt10">
        <a-space wrap>
          <a-tooltip title="刷新列表">
            <a-button type="primary" shape="circle" size="small" :icon="h(RedoOutlined)"/>
          </a-tooltip>
          <a-select style="width:150px" placeholder="选择设备">
            <a-select-option v-for="item in droneList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-select style="width:150px" placeholder="选择摄像头">
            <a-select-option v-for="item in cameraList" :key="item.value" :value="item.value">
              {{ item.label }}
            </a-select-option>
          </a-select>

          <a-button type="primary">获取URL</a-button>
          <a-button type="primary">开始直播</a-button>
          <a-button type="primary">停止直播</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { onMounted, onUnmounted, defineProps, reactive, watch, h, computed } from 'vue'
import Player, { Events } from 'xgplayer'

import FlvPlugin from 'xgplayer-flv'
import 'xgplayer/dist/index.min.css'
import { LiveVideoInfo, CameraInfo, VideoInfo, LiveFlvInfo } from '/@/api/liveflv'
import { getLiveUrlBySn, stopLiveBySn } from '/@/api/iot'
import {
  CameraOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  RedoOutlined
} from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'
import RefreshPlugin from './RefreshPlugin.js'
import { useMyStore } from '/@/store'
import { refreshToken } from '/@/api/manage'

const props = defineProps({
  compentId: String,
  videoInfo: Object
})

const store = useMyStore()

const videoSize = {
  width: 640,
  height: 360
}

const playerConfig = {
  autoplay: true,
  autoplayMuted: true,
  isLive: true,
  plugins: [RefreshPlugin, FlvPlugin],
  allowSeekAfterEnded: false,
  closeVideoDblclick: true,
  fetchOptions: {
    mode: 'cors'
  },
  width: videoSize.width,
  height: videoSize.height,
  ignores: ['cssfullscreen', 'fullscreen'],
  screenShot: true,
  videoAttributes: {
    crossOrigin: 'anonymous'
  },
  playbackRate: [],
  keyShortcut: false,
  lang: 'zh',
  refresh: true
}

let player: Player

const liveUrl = ref<string>('')
const isPayloadIndex = ref(false)
const cameraMode = ref(0)
const photoState = ref(0)
const recordingState = ref(0)
const controlSource = ref<string>('')
const currentVideoInfo = reactive({} as LiveFlvInfo)

const droneList = ref()
const cameraList = ref()

onMounted(() => {
  console.log('isHevcSupported', Player.isHevcSupported())
  const info = props.videoInfo as LiveFlvInfo
  Object.assign(currentVideoInfo, info)
  if (!info.isPayloadIndex) {
    isPayloadIndex.value = info.isPayloadIndex
  }
})

watch([() => currentVideoInfo.sn, () => currentVideoInfo.cameraIndex], ([newSn, newIndex], [oldSn, oldIndex]) => {
  console.log('onCameraIndexChange', newSn, newIndex)
  startGetVideoUrl(newSn, newIndex)
})

const droneOsd = computed(() => {
  return store.state.deviceState.deviceInfo[currentVideoInfo.sn]
})

watch(droneOsd.value, (n, o) => {
  const payload = n.cameras?.find(c => c.payload_index === currentVideoInfo.cameraIndex)
  if (payload !== undefined) {
    cameraMode.value = payload.camera_mode
    photoState.value = payload.photo_state
    recordingState.value = payload.recording_state
  }
})

function startGetVideoUrl (sn: string, index: string) {
  getLiveUrlBySn(sn, index)
    .then(res => {
      if (res.code === 200) {
        const item = res.data
        const playUrl = item[index]
        console.log(playUrl)
        liveUrl.value = playUrl.httpFlvUrl
      }
    })
    .catch(error => {
      console.log(error)
    })
}

// watch([() => cameraMode.value, photoState.value, recordingState.value], ([newCm, newPs, newRs], [oldCm, oldPs, oldRs]) => {
//   console.log('更新', newCm)

//   if (newCm === 3 || newPs === 3 || newRs === 3) {
//   }
//   console.log(oldCm, oldPs, oldRs)
// })

watch(liveUrl, (newUrl, oldUrl) => {
  startVideo(newUrl)
})

function startVideo (videoUrl: string) {
  if (player !== undefined) {
    player.destroy()
  }
  if (isLegalLiveUrl(videoUrl)) {
    player = new Player({
      ...playerConfig,
      id: props.compentId,
      url: videoUrl
    })
  } else {
    openNotification('URL 不合法')
  }
}

onUnmounted(() => {
  if (player !== undefined) {
    player.destroy()
  }
})

function reloadVideoUrl () {
  player.retry()
}

function isLegalLiveUrl (newVideoUrl: string) {
  return newVideoUrl.startsWith('http://') || newVideoUrl.startsWith('https://')
}

function requestPayloadControl () {
  // DO request
  controlSource.value = 'A'
}

function takePhoto () {

}

function startRecording () {

}

function stopRecording () {
}

function openNotification (description: string, title: string = '通知') {
  notification.open({
    message: title,
    description: description
  })
}

</script>

<style lang="scss" scoped>
.player-item {
  width: 100%;
  height: 100%;

  .video-container {
    width: 640px;
    height: 400px;
    margin: 0 auto;
    background: black;
  }

  .payload {
    margin: 0px 10px;
  }

  .info {
    margin: 10px;
    background-color: bisque;
  }
}
</style>
