<template>
  <div>
    <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
      <a-row>
        <a-col :span="1"></a-col>
        <a-col :span="20">在线机场列表Device</a-col>
      </a-row>
      <a-row>
        <template v-for="item of onlineDocks.data" v-bind:key="item.sn">
          <div @click="onDockSelect(item)" style="background: #abc; width: 100%; cursor: pointer">
            <span >{{ item.gateway.sn }}</span>
            <br/>
            <span>{{ item.sn }}</span>
          </div>

        </template>
      </a-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ReloadOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ERouterName } from '/@/types/enums'
import { EDeviceTypeName, ELocalStorageKey } from '/@/types'
import { Device, EModeCode, OSDVisible, EDockModeCode, DeviceOsd, OnlineDevice } from '/@/types/device'
import { getDeviceTopo, getUnreadDeviceHms, updateDeviceHms } from '/@/api/manage'
import { useMyStore } from '/@/store'

const store = useMyStore()

const workspaceId = ref(localStorage.getItem(ELocalStorageKey.WorkspaceId)!)

const onlineDevices = reactive({
  data: [] as OnlineDevice[]
})

const onlineDocks = reactive({
  data: [] as OnlineDevice[]
})

const route = useRoute()

onMounted(() => {
  getOnlineTopo()
})

function onDeviceSelect (item: OnlineDevice) {
  store.commit('SET_SELECT_ONLINE_DEVICE', item)
}

function onDockSelect (item: OnlineDevice) {
  store.commit('SET_SELECT_ONLINE_DOCK', item)
}

function getOnlineTopo () {
  getDeviceTopo(workspaceId.value).then((res) => {
    if (res.code !== 0) {
      return
    }
    onlineDevices.data = []
    onlineDocks.data = []
    res.data.forEach((gateway: any) => {
      const child = gateway.children
      const device: OnlineDevice = {
        model: child?.device_name,
        callsign: child?.nickname,
        sn: child?.device_sn,
        mode: EModeCode.Disconnected,
        gateway: {
          model: gateway?.device_name,
          callsign: gateway?.nickname,
          sn: gateway?.device_sn,
          domain: gateway?.domain
        },
        payload: []
      }
      child?.payloads_list.forEach((payload: any) => {
        device.payload.push({
          index: payload.index,
          model: payload.model,
          payload_name: payload.payload_name,
          payload_sn: payload.payload_sn,
          control_source: payload.control_source,
          payload_index: payload.payload_index
        })
      })
      if (EDeviceTypeName.Dock === gateway.domain) {
        onlineDocks.data.push(device)
      }
      if (gateway.status && EDeviceTypeName.Gateway === gateway.domain) {
        onlineDevices.data.push(device)
      }
    })
  })
}
</script>

<style lang="scss">
.route-icon {
  color: #fff;
  font-size: 16px;
}
</style>
