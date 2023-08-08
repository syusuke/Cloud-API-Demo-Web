<template>
  <div class="header">FLV视频播放</div>
  <div class="parent">
    <template v-for="(item, index) in  liveFlvList " :key="index">
      <PlayFlvPlayer class="child" :compent-id="'mse-' + index" :video-info="item"/>
    </template>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from '@vue/reactivity'
import { onMounted, watch } from 'vue'
import PlayFlvPlayer from '/@/components/flv/PlayFlvPlayer.vue'
import { EDeviceTypeName, ELocalStorageKey } from '/@/types'
import { getDeviceTopo, getLiveCapacity, getDeviceLiveCapacity, } from '/@/api/manage'
import { useMyStore } from '/@/store'
import { Device, DeviceInfoType, OnlineDevice, PayloadInfo } from '/@/types/device'
import { CameraInfo, VideoInfo, LiveFlvInfo, LiveCapacity } from '/@/api/liveflv'

const store = useMyStore()

const workspaceId = ref(localStorage.getItem(ELocalStorageKey.WorkspaceId)!)

const liveFlvList = ref<LiveFlvInfo[]>([])

const payloads = ref<PayloadInfo[]>()

const selectOnlineDock = computed(() => {
  return store.state?.onlineDock
})

// const droneOsd = computed()

onMounted(() => {
})

watch(selectOnlineDock, (newValue, oldValue) => {
  console.log('CN', newValue)
  // change to dock info
  loadDockVideo(newValue.gateway.sn, newValue.sn, newValue.payload)
})

function loadDockVideo (dockSn: string, droneSn: string, pys: PayloadInfo[]) {
  liveFlvList.value = []
  fetchLiveCapacity(dockSn)
  fetchLiveCapacity(droneSn)
  if (pys.length > 0) {
    payloads.value = pys
  }
}

function fetchLiveCapacity (sn: string) {
  getDeviceLiveCapacity(sn)
    .then(res => {
      if (res.code === 0) {
        console.log('getDockLiveCapacity', sn, res.data)
        updateLiveCapacity(sn, res.data)
      }
    })
}

function updateLiveCapacity (sn: string, cameraList: LiveCapacity[]) {
  for (const camera of cameraList) {
    const isPayload = payloads.value?.find(idx => {
      return idx.payload_index === camera.index
    })
    console.log('updateLiveCapacity', sn, 'payload:', isPayload, '. camera:', camera)

    // LiveVideoInfo
    liveFlvList.value.push({
      sn: sn,
      name: sn,
      cameraIndex: camera.index,
      cameraInfo: {
        index: camera.index,
        name: camera.name,
        videoList: camera.videos_list
      },
      isPayloadIndex: isPayload !== undefined
    })
  }
}

</script>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  background: #fff;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  text-align: start;
  color: #000;
}

.parent {
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  min-height: 100%;
  overflow: auto;
}

.child {
  background: rgb(127, 145, 145);
  width: 660px;
  height: 540px;
  margin: 5px;
}

.child-grid {
  background: #099;
}
</style>
