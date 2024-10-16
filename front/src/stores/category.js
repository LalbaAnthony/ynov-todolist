import { defineStore } from 'pinia'
import { get } from '@/helpers/api'

export const useCategoryStore = defineStore('category', {
  persist: true,
  state: () => ({
    categories: {
      loading: true,
      data: [],
    },
    category: {
      loading: false,
      data: {},
    },
  }),

  actions: {
    clearCategory() {
      this.category.data = {}
    },

    async fetchCategory(categoryId) {
      categoryId = parseInt(categoryId)

      // Loading
      this.category.loading = true

      // If category is already loaded, we don't make the request
      if (this.category.data.categoryId !== categoryId) {
        // Before making the request, we check if the element is already in local
        const category = this.categories.data.find(category => category.categoryId === categoryId)
        if (category) {
          this.category.data = category
        } else {
          this.clearCategory()

          const resp = await get(`category/${categoryId}`)
          this.category.data = resp.data.data || {}
        }
      }

      // Loading
      this.category.loading = false
    },

    async fetchCategories(givenParams = {}) {
      // Loading
      this.categories.loading = true

      // Data
      this.categories.data = []

      // Request
      const params = {
        // ...
      }

      Object.assign(params, givenParams)

      const resp = await get('categories', params)
      this.categories.data = resp.data.data || []

      // Loading
      this.categories.loading = false
    },
  },
})
