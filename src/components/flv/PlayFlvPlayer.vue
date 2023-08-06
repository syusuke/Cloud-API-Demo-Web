<template>
  <div>
    <div class="player-item">
      <div :id="props.compentId" class="video-container"></div>
      <div class="flex-row flex-justify-center flex-align-center" v-if="enablePayload">

        <template v-if="cameraMode === 0">
          <a-space wrap>
            <a-tag color="default">
              <template #icon>
                <camera-outlined />
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
                <video-camera-outlined />
              </template>
              录制模式
            </a-tag>
            <a-button type="primary" size="small" @click="requestPayloadControl" danger>获取负载控制权</a-button>
            <a-button type="primary" size="small" :disabled="!(recordingState === 0)"
              @click="startRecording">开始录像</a-button>
            <a-button type="primary" size="small" :disabled="!(recordingState === 1)"
              @click="stopRecording">停止录像</a-button></a-space>
        </template>

        <template v-else>
          <a-tag color="error">
            <template #icon>
              <question-circle-outlined />
            </template>
            不支持拍照或者录像
          </a-tag>
        </template>

      </div>
      <div class="info">
        <a-input-search v-model:value="liveUrl" addon-before="播放URL" placeholder="视频直播URL" @search="reloadVideoUrl">
          <template #enterButton>
            <a-button>加载</a-button>
          </template>
        </a-input-search>
      </div>

      <div class="flex-row flex-justify-center flex-align-center mt10">
        <a-space wrap>
          <a-tooltip title="刷新列表">
            <a-button type="primary" shape="circle" size="small" :icon="h(RedoOutlined)" />
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

          <a-button type="primary">开始直播</a-button>
          <a-button type="primary">停止直播</a-button>
        </a-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { onMounted, onUnmounted, defineProps, reactive, watch, h } from 'vue'
import Player from 'xgplayer'
import FlvPlugin from 'xgplayer-flv'
import 'xgplayer/dist/index.min.css'
import { LiveVideoInfoItem } from '/@/api/liveflv'
import {
  CameraOutlined,
  VideoCameraOutlined,
  QuestionCircleOutlined,
  RedoOutlined
} from '@ant-design/icons-vue'
import { notification } from 'ant-design-vue'

const props = defineProps({
  compentId: String,
  videoInfo: Object
})

const videoSize = {
  width: 640,
  height: 360
}

interface SelectOption {
  value: any,
  label: string,
  more?: any
}

const playerConfig = {
  autoplay: true,
  autoplayMuted: true,
  isLive: true,
  plugins: [FlvPlugin],
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
  lang: 'zh'
}

let player: Player

const liveUrl = ref<string>('')
const enablePayload = ref(true)
const cameraMode = ref(1)
const photoState = ref(0)
const recordingState = ref(0)
const droneList = ref()
const cameraList = ref()
const currentVideoInfo = reactive({} as LiveVideoInfoItem)

onMounted(() => {
  const info = props.videoInfo as LiveVideoInfoItem
  // liveVideoInfo.value = info
  Object.assign(currentVideoInfo, info)
})

watch(() => currentVideoInfo.url, (newUrl, oldUrl) => {
  console.log('当前视频URL', newUrl)
  startVideo(newUrl)
})

// watch([() => cameraMode.value, photoState.value, recordingState.value], ([newCm, newPs, newRs], [oldCm, oldPs, oldRs]) => {
//   console.log('更新', newCm)

//   if (newCm === 3 || newPs === 3 || newRs === 3) {
//   }
//   console.log(oldCm, oldPs, oldRs)
// })

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
  liveUrl.value = videoUrl
}

onUnmounted(() => {
  if (player !== undefined) {
    player.destroy()
  }
})

function reloadVideoUrl () {
  const newVideoUrl = liveUrl.value
  currentVideoInfo.url = newVideoUrl
}
function isLegalLiveUrl (newVideoUrl: string) {
  return newVideoUrl.startsWith('http://') || newVideoUrl.startsWith('https://')
}

function requestPayloadControl () {

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
