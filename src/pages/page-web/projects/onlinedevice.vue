<!-- <template>
  <div>
  <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
    <a-row>
      <a-col :span="1"></a-col>
      <a-col :span="20">在线机场列表</a-col>
    </a-row>
    <a-row>
      <template v-for="item of deviceList" v-bind:key="item.device_sn">
        <span @click="onDeviceSelect(item)">{{ item.device_sn }}</span>
      </template>
    </a-row>
  </div>
  <router-view/>
  </div>
</template>

<script lang="ts" setup>
import { ReloadOutlined } from '@ant-design/icons-vue'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ERouterName } from '/@/types/enums'
import { EDeviceTypeName, ELocalStorageKey } from '/@/types'
import { Device, EModeCode, OSDVisible, EDockModeCode, DeviceOsd } from '/@/types/device'
import { getDeviceTopo, getUnreadDeviceHms, updateDeviceHms } from '/@/api/manage'

const workspaceId = ref(localStorage.getItem(ELocalStorageKey.WorkspaceId)!)
const deviceList = ref<Device[]>([])

const route = useRoute()

onMounted(() => {
  getOnlineTopo()
})

function onDeviceSelect (item: Device) {

}

function getOnlineTopo () {
  getDeviceTopo(workspaceId.value)
    .then((res) => {
      console.log('getDeviceTopo', res)
      if (res.code === 0) {
        deviceList.value = res.data
      }
    })
}

</script>

<style lang="scss">
.route-icon {
  color: #fff;
  font-size: 16px;
}
</style> -->
