<template>
  <div class="header">FLV视频播放</div>
  <div class="parent">
    <template v-for="(item, index) in   urlsList  " :key="index">
      <PlayFlvPlayer class="child" :compent-id="'mse-' + index" :video-info="item" />
    </template>

    <!-- <a-row :gutter="[8, 8]">
      <template v-for="(item, index) in   urlsList  " :key="index">
        <a-col :span="12">
          <PlayFlvPlayer class="child-grid" :compent-id="'mse-' + index" :video-info="item" />
        </a-col>
      </template>
    </a-row> -->
  </div>
</template>

<script setup lang="ts">
import { ref } from '@vue/reactivity'
import { onMounted } from 'vue'
import PlayFlvPlayer from '/@/components/flv/PlayFlvPlayer.vue'
import { LiveVideoInfoItem } from '/@/api/liveflv'

const urlsList = ref<LiveVideoInfoItem[]>([])

onMounted(() => {
  // urlsList.value[0] = 'http://localhost:8080/hdl/live/4k264.flv'
  urlsList.value = [{
    url: 'http://localhost:8080/hdl/live/4k264.flv',
    sn: '',
    cameraIndex: '',
    state: {
      mode: 1
    }
  }, {
    url: 'http://localhost:8080/hdl/live/4k264.flv',
    sn: '',
    cameraIndex: '',
    state: {
      mode: 1
    }
  }, {
    url: 'http://localhost:8080/hdl/live/4k264.flv',
    sn: '',
    cameraIndex: '',
    state: {
      mode: 1
    }
  }, {
    url: 'http://localhost:8080/hdl/live/4k264.flv',
    sn: '',
    cameraIndex: '',
    state: {
      mode: 1
    }
  }]
  console.log('urlsList size = ', urlsList.value.length)
})

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
  height: 100%;
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
