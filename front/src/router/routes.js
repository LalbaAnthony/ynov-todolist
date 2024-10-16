const routes = [
  // ==================== HOME ====================
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/HomePage.vue'),
    meta: {
      title: 'Home',
      private: true,
      displayInSearch: true,
      tags: ['home', 'welcome', 'index'],
    },
  },

  {
    path: '/search',
    name: 'search',
    component: () => import('../pages/SearchPage.vue'),
    meta: {
      title: 'Search',
      private: true,
      displayInSearch: false,
      tags: ['search', 'find', 'query'],
    },
  },
  // ==================== TASKS ====================
  {
    path: '/tasks',
    name: 'tasks.list',
    component: () => import('../pages/task/TasksPage.vue'),
    meta: {
      title: 'Tasks',
      private: true,
      displayInSearch: true,
      tags: ['tasks', 'years', 'periods'],
    },
  },
  {
    path: '/tasks/add',
    name: 'tasks.add',
    component: () => import('../pages/task/TaskPage.vue'),
    meta: {
      title: 'Add a task',
      private: true,
      displayInSearch: true,
      tags: ['tasks', 'years', 'periods', 'add'],
    },
  },
  {
    path: '/task',
    name: 'task',
    children: [
      {
        path: ':taskId',
        name: 'tasks.details',
        component: () => import('../pages/task/TaskPage.vue'),
        meta: {
          title: 'Task details',
          private: true,
          displayInSearch: false,
          tags: ['tasks', 'years', 'periods', 'details'],
        },
      },
    ],
  },
  // ==================== AUTH & ACCOUNT ====================
  {
    path: '/auth',
    name: 'auth',
    component: () => import('../pages/auth/AuthPage.vue'),
    meta: {
      title: 'Authentication',
      private: false,
      displayInSearch: false,
      tags: [],
    },
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('../pages/account/AccountPage.vue'),
    meta: {
      title: 'My account',
      private: true,
      displayInSearch: true,
      tags: ['account', 'profile', 'settings'],
    },
  },
  // ==================== CATCH ====================
  {
    path: '/:catchAll(.*)*',
    name: 'Error',
    component: () => import('../pages/error/ErrorPage.vue'),
    meta: {
      title: 'Error',
      displayInSearch: false,
    },
  },
]

export default routes