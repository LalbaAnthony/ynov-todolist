import { defineStore } from 'pinia'
import { get, post, put, del } from '@/helpers/api'
import { useAuthStore } from '@/stores/auth'
import { notify } from '@/helpers/notif.js'
import { watchSyncEffect } from 'vue'

const authStore = useAuthStore()

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: {
      loading: true,
      data: [],
      pagination: { page: 1, perPage: 10, total: 1 },
    },
    task: {
      loading: false,
      data: {},
    },
  }),

  actions: {
    clearTask() {
      this.task.data = {}
    },

    async fetchTask(taskId) {
      taskId = parseInt(taskId)

      // Loading
      this.task.loading = true

      // If task is already loaded, we don't make the request
      if (this.task.data.taskId !== taskId) {
        // Before making the request, we check if the element is already in local
        const task = this.tasks.data.find(task => task.taskId === taskId)
        if (task) {
          this.task.data = task
        } else {
          const params = {
            userId: authStore.user.userId,
          }

          this.clearTask()

          const resp = await get(`task/${taskId}`, params)
          this.task.data = resp.data.data || {}
        }
      }

      // Loading
      this.task.loading = false
    },

    async fetchTasks(givenParams = {}) {
      // Loading
      this.tasks.loading = true

      // Data
      this.tasks.data = []

      // Request
      const params = {
        userId: authStore.user.userId,
        page: this.tasks.pagination.page || 1,
        perPage: this.tasks.pagination.perPage || 10,
        sort: [
          { order: 'DESC', orderBy: 'createdAt' },
        ],
      }

      Object.assign(params, givenParams)

      const resp = await get('tasks', params)
      this.tasks.data = resp.data.data || []
      this.tasks.pagination = resp.pagination || { page: 1, perPage: 10, total: 1 }

      // Loading
      this.tasks.loading = false
    },

    changePage(page, scroll = true) {
      this.tasks.pagination.page = page
      this.fetchTasks()
      if (scroll) window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    initTask() {
      this.clearTask()
      this.task.data.startAt = new Date().toISOString()
      this.task.data.endAt = new Date().toISOString()
      this.task.data.userId = authStore.user.userId
    },

    async updateTaskDone(taskId, done = false) {
      // Update in local
      const index = this.tasks.data.findIndex(task => task.taskId === taskId)
      this.tasks.data[index].done = done
      
      // Update task
      this.updateTask(this.tasks.data[index])
    },

    async deleteTask(taskId) {
      // Remove in local
      this.tasks.data.splice(this.tasks.data.findIndex(task => task.taskId === taskId), 1)

      // Request
      const resp = await del(`task/${taskId}`)

      if (resp.status !== 200) {
        notify(resp.data.message, 'error')
        return false
      }

      return true
    },

    async createTask(task) {
      // Loading
      this.task.loading = true

      // Request
      const resp = await post('tasks', task)

      if (resp.status !== 201) {
        notify(resp.data.message, 'error')
        return false
      }

      // Append in local
      this.tasks.data.unshift(resp.data.data)

      // Loading
      this.task.loading = false

      return true
    },

    async updateTask(task) {
      // Loading
      this.task.loading = true

      // Request
      const resp = await put(`task/${task.taskId}`, task)

      if (resp.status !== 201) {
        notify(resp.data.message, 'error')
        return false
      }

      // Loading
      this.task.loading = false

      return true
    },
  },
})
