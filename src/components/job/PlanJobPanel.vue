<template>
  <div class="header">飞行航线库</div>
  <div class="plan-panel-wrapper">
    <a-table class="plan-table" :columns="columns" :data-source="plansData.data" row-key="job_id"
             :pagination="paginationProp" :scroll="{ x: '100%', y: 600 }" @change="refreshData">

      <!-- 失控动作 -->
      <template #lostAction="{ record }">
        <div>{{ formatLostAction(record) }}</div>
      </template>

      <!-- 创建时间 -->
      <template #createTimeAction="{ record }">
        <div>{{ formatTaskTime(record.create_time) }}</div>
      </template>

      <!--操作-->
      <template #action="{ record }">
        <div class="action-area">
          <a-button type="primary" size="small">查看航线</a-button>
          <a-button type="primary" size="small">查看关联无人机</a-button>
          <a-popconfirm
              title="确定要执行当前任务?"
              ok-text="立即执行"
              cancel-text="取消执行"
              @confirm="onRunJob(record.id)">
            <a-button type="primary" size="small">执行</a-button>
          </a-popconfirm>
        </div>
      </template>
      >
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from '@vue/reactivity'
import { message } from 'ant-design-vue'
import { TableState } from 'ant-design-vue/lib/table/interface'
import { onMounted } from 'vue'
import { IPage } from '/@/api/http/type'
import {
  deleteTask,
  updateTaskStatus,
  UpdateTaskStatus,
  uploadMediaFileNow
} from '/@/api/wayline'
import { useMyStore } from '/@/store'
import { ELocalStorageKey } from '/@/types/enums'
import { getErrorMessage } from '/@/utils/error-code/index'
import { commonColor } from '/@/utils/color'
import { ExclamationCircleOutlined, UploadOutlined } from '@ant-design/icons-vue'
import { getPlanJobs, executeJob, PlanJob } from '/@/api/planjob'
import { useFormatPlanJob } from './use-format-planjob'

const store = useMyStore()
const workspaceId = localStorage.getItem(ELocalStorageKey.WorkspaceId)!

const body: IPage = {
  page: 1,
  total: 0,
  page_size: 50
}
const paginationProp = reactive({
  pageSizeOptions: ['20', '50', '100'],
  showQuickJumper: true,
  showSizeChanger: true,
  pageSize: 50,
  current: 1,
  total: 0
})

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 100,
  },
  {
    title: '机场编号',
    dataIndex: 'dock_sn',
    width: 80
  },
  {
    title: '描述',
    dataIndex: 'description',
    width: 150,
  },
  {
    title: '自动返航高度(m)',
    dataIndex: 'rth_altitude',
    width: 50
  },
  {
    title: '断开操作',
    dataIndex: 'out_of_control',
    width: 80,
    slots: { customRender: 'lostAction' },
  },
  {
    title: '创建时间',
    dataIndex: 'create_time',
    width: 80,
    slots: { customRender: 'createTimeAction' },
  },
  {
    title: '操作',
    width: 160,
    slots: { customRender: 'action' }
  }
]
type Pagination = TableState['pagination']

const plansData = reactive({
  data: [] as PlanJob[]
})

const {
  formatLostAction,
  formatTaskTime
} = useFormatPlanJob()

function getCodeMessage (code: number) {
  return getErrorMessage(code) + `（code: ${code}）`
}

onMounted(() => {
  getPlans()
})

function getPlans () {
  getPlanJobs(workspaceId, body,).then(res => {
    if (res.code !== 0) {
      return
    }
    plansData.data = res.data.list
    paginationProp.total = res.data.pagination.total
    paginationProp.current = res.data.pagination.page
  })
}

function refreshData (page: Pagination) {
  body.page = page?.current!
  body.page_size = page?.pageSize!
  getPlans()
}

function onRunJob (id: number) {
  console.log('开始执行PlanJob', id)
  executeJob(id)
    .then(value => {
      console.log('选择任务结果', value)
      if (value.code === 0) {
        // 成功
        console.log('执行success')
      }
    })
    .catch(error => {
      console.log('执行任务失败,', error)
    })
}

// 删除任务
async function onDeleteTask (jobId: string) {
  const { code } = await deleteTask(workspaceId, {
    job_id: jobId
  })
  if (code === 0) {
    message.success('Deleted successfully')
    getPlans()
  }
}

// 挂起任务
async function onSuspendTask (jobId: string) {
  const { code } = await updateTaskStatus(workspaceId, {
    job_id: jobId,
    status: UpdateTaskStatus.Suspend
  })
  if (code === 0) {
    message.success('Suspended successfully')
    getPlans()
  }
}

// 解除挂起任务
async function onResumeTask (jobId: string) {
  const { code } = await updateTaskStatus(workspaceId, {
    job_id: jobId,
    status: UpdateTaskStatus.Resume
  })
  if (code === 0) {
    message.success('Resumed successfully')
    getPlans()
  }
}

// 立即上传媒体
async function onUploadMediaFileNow (jobId: string) {
  const { code } = await uploadMediaFileNow(workspaceId, jobId)
  if (code === 0) {
    message.success('Upload Media File successfully')
    getPlans()
  }
}
</script>

<style lang="scss" scoped>
.plan-panel-wrapper {
  width: 100%;
  padding: 16px;

  .plan-table {
    background: #fff;
    margin-top: 10px;
  }

  .action-area {

    &::v-deep {
      .ant-btn {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }

  .circle-icon {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 3px;
    border-radius: 50%;
    vertical-align: middle;
    flex-shrink: 0;
  }
}

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
</style>
