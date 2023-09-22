<template>
  <div>
    <div class="header">无人机视频面板</div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from '@vue/reactivity'
import { onMounted, watch } from 'vue'

import { getRoot } from '/@/root'
import { getLiveCapacity } from '/@/api/manage'
import { message } from 'ant-design-vue'
import { useMyStore } from '/@/store'

interface SelectOption {
  value: any,
  label: string,
  more?: any
}

const root = getRoot()
const store = useMyStore()

const livestreamSource = ref()
const deviceList = ref()
const cameraList = ref()
const videoList = ref()

const onRefresh = async () => {
  deviceList.value = []
  cameraList.value = []
  videoList.value = []

  await getLiveCapacity({})
    .then(res => {
      console.log('getLiveCapacity', res)
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
            temp.push({
              label: ele.name + '-' + ele.sn,
              value: ele.sn,
              more: ele.cameras_list
            })
          })
          deviceList.value = temp
        }
      }
    })
    .catch(error => {
      message.error(error)
      console.error(error)
    })
}
const osdVisible = computed(() => {
  return store.state.osdVisible
})

onMounted(() => {
  console.log('osdVisible', osdVisible)
  onRefresh()
})

</script>
<style lang="scss" scoped>
.header {
  width: 100%;
  height: 60px;
  padding: 16px;
  font-size: 20px;
  font-weight: bold;
  text-align: start;
  color: #fff;
}
</style>
