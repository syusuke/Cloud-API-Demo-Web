<template>
  <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #4f4f4f; font-weight: 450;">
    <a-row>
      <a-col :span="1"></a-col>
      <a-col :span="20">在线机场列表</a-col>
      <a-col :span="2">
        <!-- <router-link :to="{ name: ERouterName.LIVE_MEIDA_DEVICE }">
          <ReloadOutlined class="route-icon" />
        </router-link> -->
      </a-col>
      <a-col :span="1"></a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { ReloadOutlined } from '@ant-design/icons-vue'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ERouterName } from '/@/types/enums'

const route = useRoute()

</script>

<style lang="scss">
.route-icon {
  color: #fff;
  font-size: 16px;
}
</style>
