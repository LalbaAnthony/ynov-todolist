<template>
  <div>
    <!-- Mobile bottom menu -->
    <nav v-if="isMobile()"
      class="fixed bottom-0 left-0 z-20 w-full flex justify-around items-center bg-dark-light border-t border-gray p-4 gap-3">
      <div class="flex flex-col items-center" @click.stop="toggleSidebar()">
        <Bars3Icon class="size-10 text-gray-light rounded-lg p-1 cursor-pointer" />
        <span class="text-sm text-gray font-semibold">More</span>
      </div>
      <router-link class="flex flex-col items-center" to="/">
        <HomeIcon class="size-10 text-gray-light rounded-lg p-1 cursor-pointer" />
        <span class="text-sm text-gray font-semibold">Home</span>
      </router-link>
      <router-link class="flex flex-col items-center" to="/search">
        <MagnifyingGlassIcon class="size-10 text-gray-light rounded-full p-1 cursor-pointer" />
        <span class="text-sm text-gray font-semibold">Search</span>
      </router-link>
    </nav>

    <!-- Desktop header -->
    <header v-else class="flex justify-between items-center bg-dark-light border-b border-gray p-4 gap-3">
      <Bars3Icon class="size-10 text-gray-light rounded-lg p-1 cursor-pointer" @click.stop="toggleSidebar()" />
      <router-link :to="route.path">
        <h1 class="text-2xl font-bold text-light">
          {{ route.meta.title }}
        </h1>
      </router-link>
      <MagnifyingGlassIcon class="size-10 text-gray-light rounded-full p-1.5 cursor-pointer"
        @click.stop="focusSearchBar" />
    </header>

    <!-- Sidebar -->
    <TransitionRoot :show="showSidebar">
      <!-- Hide at click outside -->
      <TransitionChild v-click-outside="() => hideSidebar()" as="aside"
        enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0"
        leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full"
        class="fixed top-0 left-0 h-full w-72 bg-dark-light z-50 border-r border-gray">

        <!-- Close sidebar -->
        <div class="flex justify-end p-4">
          <XMarkIcon class="size-8 text-gray-light cursor-pointer" @click.stop="hideSidebar()" />
        </div>

        <!-- Search -->
        <div v-if="!isMobile()" class="py-2 px-4">
          <form action="" @submit.prevent="triggerSearch()">
            <input v-model="search" id="layoutSearch" type="search"
              class="w-full px-4 p-2 rounded-lg bg-gray-dark text-light" placeholder="Search" />
          </form>
        </div>

        <!-- Navigation -->
        <nav class="py-2 px-4 flex flex-col gap-4">
          <router-link v-if="!isMobile()" to="/"
            :class="[route.name.includes('home') ? 'bg-gray-dark' : '', 'flex items-center cursor-pointer text-light rounded-lg hover:bg-gray-dark p-2']"
            @click.stop="hideSidebar()">
            <HomeIcon class="size-6 text-gray-light" />
            <span class="ml-3 mt-0.5">Home</span>
          </router-link>
          <hr>
          <router-link to="/tasks"
            :class="[route.name.includes('task') ? 'bg-gray-dark' : '', 'flex items-center cursor-pointer text-light rounded-lg hover:bg-gray-dark p-2']"
            @click.stop="hideSidebar()">
            <NewspaperIcon class="size-6 text-gray-light" />
            <span class="ml-3 mt-0.5">Tasks</span>
          </router-link>
          <hr>
          <router-link to="/account"
            :class="[route.name.includes('account') ? 'bg-gray-dark' : '', 'flex items-center cursor-pointer text-light rounded-lg hover:bg-gray-dark p-2']"
            @click.stop="hideSidebar()">
            <UserCircleIcon class="size-6 text-gray-light" />
            <span class="ml-3 mt-0.5">Account</span>
          </router-link>
          <div class="flex items-center cursor-pointer text-danger-light rounded-lg hover:bg-gray p-2"
            @click.stop="authStore.logout()">
            <ArrowLeftEndOnRectangleIcon class="size-6 text-danger" />
            <span class="ml-3 mt-0.5">Log out</span>
          </div>
        </nav>
        <div class="text-gray-light mb-2 mr-4 absolute bottom-0 right-0">
          Version {{ VITE_APP_VERSION }}
        </div>
      </TransitionChild>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { isMobile } from '@/helpers/functions.js'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'
import { Bars3Icon } from '@heroicons/vue/24/solid'
import { XMarkIcon } from '@heroicons/vue/24/solid'
import { HomeIcon } from '@heroicons/vue/24/solid'
import { NewspaperIcon } from '@heroicons/vue/24/solid'
import { UserCircleIcon } from '@heroicons/vue/24/solid'
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/vue/24/solid'
import { ref } from 'vue'
import { TransitionRoot, TransitionChild } from '@headlessui/vue'
import { useRoute, useRouter } from 'vue-router'
import vClickOutside from '@/directives/clickOutside.js'
import { useAuthStore } from '@/stores/auth'
import { VITE_APP_VERSION } from '@/config';


const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const showSidebar = ref(false)
const search = ref('')

function blurApp() {
  const BLUR = '2px'
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const nav = document.querySelector('nav')
  if (main) main.style.filter = `blur(${BLUR})`
  if (header) header.style.filter = `blur(${BLUR})`
  if (nav) nav.style.filter = `blur(${BLUR})`
}

function unblurApp() {
  const main = document.querySelector('main')
  const header = document.querySelector('header')
  const nav = document.querySelector('nav')
  if (main) main.style.filter = 'none'
  if (header) header.style.filter = 'none'
  if (nav) nav.style.filter = 'none'
}

function hideSidebar() {
  showSidebar.value = false
  unblurApp()
}

function revealSidebar() {
  showSidebar.value = true
  if (isMobile()) blurApp()
}

function toggleSidebar() {
  showSidebar.value = !showSidebar.value
  if (showSidebar.value) {
    if (isMobile()) blurApp()
  } else {
    unblurApp()
  }
}

function focusSearchBar() {
  revealSidebar()
  setTimeout(() => {
    const input = document.getElementById('layoutSearch')
    input.focus()
  }, 200) // wait for sidebar to be visible
}

function triggerSearch() {
  const query = { ...route.query }
  delete query.search
  if (search.value) {
    query.search = search.value
    search.value = ''
    hideSidebar()
    router.push({ path: '/search', query })
  }
}

// Add shortcuts
if (!isMobile()) {
  window.addEventListener('keydown', (e) => {
    // ctrl + F short to focus search
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault()
      focusSearchBar()
    }
  })
}

</script>