import { message } from 'ant-design-vue'
import request, { IPage, IWorkspaceResponse, IListWorkspaceResponse } from '/@/api/http/request'
import { TaskType, TaskStatus, OutOfControlAction } from '/@/types/task'
import { WaylineType } from '/@/types/wayline'

const HTTP_PREFIX = '/planjob/api/v1'

export interface CreatePlanJob {
  name: string,
  description: string,
  file_id: string,
  dock_sn: string,
  task_type: TaskType, // 任务类型
  wayline_type: WaylineType, // 航线类型
  task_days?: number[] // 执行任务的日期（秒）
  task_periods?: number[][] // 执行任务的时间点（秒）
  rth_altitude: number // 相对机场返航高度 20 - 500
  out_of_control: OutOfControlAction // 失控动作
}

export interface PlanJob {
  id: number,
  name: string,
  description: string,
  file_id: string,
  dock_sn: string,
  task_type: TaskType, // 任务类型
  wayline_type: WaylineType, // 航线类型
  rth_altitude: number // 相对机场返航高度 20 - 500
  out_of_control: OutOfControlAction // 失控动作
  create_time: string,
  update_time: string
}

// Create Wayline Job
export const createPlanJob = async function (workspaceId: string, planJob: CreatePlanJob): Promise<IWorkspaceResponse<any>> {
  const url = `${HTTP_PREFIX}/planJob/add?workspaceId=${workspaceId}`
  const result = await request.post(url, planJob)
  return result.data
}

export const getPlanJobs = async function (workspaceId: string, page: IPage): Promise<IListWorkspaceResponse<PlanJob>> {
  const url = `${HTTP_PREFIX}/planJob/page?page=${page.page}&size=${page.page_size}`
  const result = await request.post(url, {})
  return result.data
}

export const executeJob = async function (planJobId: number): Promise<IListWorkspaceResponse<PlanJob>> {
  const url = `${HTTP_PREFIX}/planJob/run/${planJobId}`
  const result = await request.get(url)
  return result.data
}
