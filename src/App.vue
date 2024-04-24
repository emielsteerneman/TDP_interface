<script setup>
import { ref, computed } from 'vue'

import List from './List.vue'
import TDP from './TDP.vue'
import Navbar from './Navbar.vue'

const routes = {
  '/': List,
  '/tdp': TDP
}

const currentPath = ref(window.location.pathname)
if( window.location.hash != "" ){
  currentPath.value = window.location.hash
}
if (currentPath.value.startsWith("#")){
  currentPath.value = currentPath.value.slice(1)
}

console.log("??", window.location.hash, window.location.pathname, currentPath.value)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
  if (currentPath.value.startsWith("#")){
    currentPath.value = currentPath.value.slice(1)
  }
})

const currentView = computed(() => {
  console.log("Recalculated currentView |", currentPath.value)

  let route = '/'
  for (let route_key of Object.keys(routes)){
    console.log("  - Checking if", currentPath.value, "starts with", route_key)
    if (currentPath.value.startsWith(route_key)){
      route = route_key
    }
  }
  console.log("  Setting route to", route)

  return routes[route] || List
})
</script>

<template>

  <Navbar />
  <br><br><br>
  
  <component :is="currentView" />
</template>