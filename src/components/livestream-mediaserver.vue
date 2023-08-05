<template>
    <div class="flex-column flex-justify-start flex-align-center mt20">
        <video :style="{ width: '720px', height: '480px' }" id="video-webrtc" ref="videowebrtc" controls class="mt20">
        </video>
        <p class="fz24">Media服务器播放</p>

        <div class="flex-row flex-justify-center flex-align-center mt10">

            <template v-if="liveState && isDockLive">
                <span class="mr10">Lens:</span>
                <a-radio-group v-model:value="lensSelected" button-style="solid">
                    <a-radio-button v-for="lens in lensList" :key="lens" :value="lens">{{ lens }}</a-radio-button>
                </a-radio-group>
            </template>

            <template v-else>

                <a-select class="ml10" style="width:150px" placeholder="Select Drone" v-model:value="droneSelected">
                    <a-select-option v-for="item in droneList" :key="item.value" :value="item.value"
                        @click="onDroneSelect(item)">{{ item.label }}</a-select-option>
                </a-select>
                <a-select class="ml10" style="width:150px" placeholder="Select Camera" v-model:value="cameraSelected">
                    <a-select-option v-for="item in cameraList" :key="item.value" :value="item.value"
                        @click="onCameraSelect(item)">{{ item.label }}</a-select-option>
                </a-select>
                <a-select class="ml10" style="width:150px" placeholder="Select Lens" v-model:value="videoSelected">
                    <a-select-option v-for="item in videoList" :key="item.value" :value="item.value"
                        @click="onVideoSelect(item)">{{ item.label }}</a-select-option>
                </a-select>
            </template>
            <a-select class="ml10" style="width:150px" placeholder="Select Clarity" @select="onClaritySelect"
                v-model:value="claritySelected">
                <a-select-option v-for="item in clarityList" :key="item.value" :value="item.value">{{ item.label
                }}</a-select-option>
            </a-select>
        </div>

        <div class="mt10 flex-row flex-justify-center flex-align-center">
            <!-- <a-button v-if="liveState && isDockLive" type="primary" large @click="onSwitch">Switch Lens</a-button> -->

            <a-button type="primary" large @click="onStart">Play</a-button>

            <a-button class="ml20" type="primary" large @click="onStop">Stop</a-button>

            <!-- <a-button class="ml20" type="primary" large @click="onUpdateQuality">Update Clarity</a-button> -->
            <a-button v-if="!liveState || !isDockLive" class="ml20" type="primary" large @click="onRefresh">Refresh Live
                Capacity</a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { message } from 'ant-design-vue'
import { onMounted, reactive, ref } from 'vue'
import { CURRENT_CONFIG as config } from '/@/api/http/config'
import { changeLivestreamLens, getLiveCapacity, setLivestreamQuality, stopLivestream } from '/@/api/manage'
import { getBrowserLiveUrl, iotStopLive } from '/@/api/iot'
import { getRoot } from '/@/root'
import flvjs from 'flv.js'
const root = getRoot()

interface SelectOption {
    value: any,
    label: string,
    more?: any
}

const clarityList: SelectOption[] = [
  {
    value: 0,
    label: 'Adaptive'
  },
  {
    value: 1,
    label: 'Smooth'
  },
  {
    value: 2,
    label: 'Standard'
  },
  {
    value: 3,
    label: 'HD'
  },
  {
    value: 4,
    label: 'Super Clear'
  }
]

const videowebrtc = ref(null)
const livestreamSource = ref()
const droneList = ref()
const cameraList = ref()
const videoList = ref()
const droneSelected = ref()
const cameraSelected = ref()
const videoSelected = ref()
const claritySelected = ref()
const currentSn = ref()
const liveState = ref<boolean>(false)
const lensList = ref<string[]>([])
const lensSelected = ref<String>()
const isDockLive = ref(false)

const onRefresh = async () => {
  droneList.value = []
  cameraList.value = []
  videoList.value = []
  droneSelected.value = null
  cameraSelected.value = null
  videoSelected.value = null

  await getLiveCapacity({})
    .then(res => {
      console.log(res)
      if (res.code === 0) {
        if (res.data === null) {
          console.warn('warning: get live capacity is null!!!')
          return
        }
        const resData: Array<[]> = res.data
        console.log('live_capacity:', resData)
        livestreamSource.value = resData

        const temp: Array<SelectOption> = []
        if (livestreamSource.value) {
          livestreamSource.value.forEach((ele: any) => {
            temp.push({ label: ele.name + '-' + ele.sn, value: ele.sn, more: ele.cameras_list })
          })
          droneList.value = temp
        }
      }
    })
    .catch(error => {
      message.error(error)
      console.error(error)
    })
}

onMounted(() => {
  if (!flvjs.isSupported()) {
    alert('浏览器不支持flv.js')
  }
  onRefresh()
})

const onStart = async () => {
  console.log(
    'Param:',
    droneSelected.value,
    cameraSelected.value,
    videoSelected.value,
    claritySelected.value
  )
  /*  if (
                      droneSelected.value == null ||
                          cameraSelected.value == null ||
                          claritySelected.value == null
                    ) {
                      message.warn('waring: not select live para!!!')
                      return
                    } */

  currentSn.value = droneSelected.value

  getBrowserLiveUrl(currentSn.value)
    .then(res => {
      if (res.code === 0) {
        const data = res.data
        const httpFlvUrl = data.httpFlvUrl
        console.log('playURL', httpFlvUrl)
        const videoElement = videowebrtc.value
        const player = flvjs.createPlayer({
          type: 'flv',
          url: httpFlvUrl
        })
        player.attachMediaElement(document.getElementById('myVideo'))
        player.load()
        player.play()
      }
      console.log('getBrowserLiveUrl', res)
    })
    .catch(error => {
      console.log('error.getBrowserLiveUrl', error)
    })
}
const onStop = () => {
  iotStopLive(currentSn.value)
    .then(res => {
      if (res.code === 0) {
        message.success(res.message)
        liveState.value = false
        lensSelected.value = undefined
        console.log('stop play livestream')
      }
    })
    .catch(error => {
      console.log('stopLive', error)
    })
}

// const onUpdateQuality = () => {
//   if (!liveState.value) {
//     message.info('Please turn on the livestream first.')
//     return
//   }
//   setLivestreamQuality({
//     video_id: videoId.value,
//     video_quality: claritySelected.value
//   }).then(res => {
//     if (res.code === 0) {
//       message.success('Set the clarity to ' + clarityList[claritySelected.value].label)
//     }
//   })
// }

const onDroneSelect = (val: SelectOption) => {
  droneSelected.value = val.value
  const temp: Array<SelectOption> = []
  cameraList.value = []
  cameraSelected.value = undefined
  videoSelected.value = undefined
  videoList.value = []
  lensList.value = []
  if (!val.more) {
    return
  }
  val.more.forEach((ele: any) => {
    temp.push({ label: ele.name, value: ele.index, more: ele.videos_list })
  })
  cameraList.value = temp
}
const onCameraSelect = (val: SelectOption) => {
  cameraSelected.value = val.value
  const result: Array<SelectOption> = []
  videoSelected.value = undefined
  videoList.value = []
  lensList.value = []
  if (!val.more) {
    return
  }

  val.more.forEach((ele: any) => {
    result.push({ label: ele.type, value: ele.index, more: ele.switch_video_types })
  })
  videoList.value = result
  if (videoList.value.length === 0) {
    return
  }
  const firstVideo: SelectOption = videoList.value[0]
  videoSelected.value = firstVideo.value
  lensList.value = firstVideo.more
  lensSelected.value = firstVideo.label
  isDockLive.value = lensList.value?.length > 0
}
const onVideoSelect = (val: SelectOption) => {
  videoSelected.value = val.value
  lensList.value = val.more
  lensSelected.value = val.label
}
const onClaritySelect = (val: any) => {
  claritySelected.value = val
}

// const onSwitch = () => {
//   if (lensSelected.value === undefined || lensSelected.value === nonSwitchable) {
//     message.info('The ' + nonSwitchable + ' lens cannot be switched, please select the lens to be switched.', 8)
//     return
//   }
//   changeLivestreamLens({
//     video_id: videoId.value,
//     video_type: lensSelected.value
//   }).then(res => {
//     if (res.code === 0) {
//       message.success('Switching live camera successfully.')
//     }
//   })
// }

</script>

<style lang="scss" scoped>
@import '/@/styles/index.scss';
</style>
