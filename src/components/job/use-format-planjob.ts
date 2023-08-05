import { DEFAULT_PLACEHOLDER } from '/@/utils/constants'
import { Task } from '/@/api/wayline'
import {
  TaskStatusColor,
  TaskStatusMap,
  TaskTypeMap,
  OutOfControlActionMap,
  MediaStatusMap,
  MediaStatusColorMap,
  MediaStatus
} from '/@/types/task'
import { isNil } from 'lodash'
import { PlanJob } from '/@/api/planjob'

export function useFormatPlanJob () {
  function formatTaskType (task: PlanJob) {
    return TaskTypeMap[task.task_type] || DEFAULT_PLACEHOLDER
  }

  function formatTaskTime (time: string) {
    return time || DEFAULT_PLACEHOLDER
  }

  function formatLostAction (task: PlanJob) {
    return OutOfControlActionMap[task.out_of_control] || DEFAULT_PLACEHOLDER
  }

  return {
    formatTaskType,
    formatTaskTime,
    formatLostAction
  }
}
