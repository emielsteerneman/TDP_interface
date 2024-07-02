<script setup>
import { ref, computed } from 'vue'

import Navbar from './Navbar.vue'
import LeagueFilter from './components/LeagueFilter.vue'
import List from './List.vue'
import TDP from './TDP.vue'
import Query from './Query.vue'
import TestStore from './TestStore.vue'
import { useTdpStore } from './stores/tdpStore'
import { onBeforeMount } from 'vue'

const tdp_store = useTdpStore()


const routes = {
    '/' : List,
    '/tdp': TDP,
    '/query': Query,
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


onBeforeMount(() => {
    console.log("[App][onBeforeMount]", currentPath.value)
    if(!currentPath.value.startsWith('/tdp'))
        if(!tdp_store.isFetched)
            tdp_store.fetch()
})

</script>

<template>

    <Navbar />
    <br><br><br>

    <template v-if="currentPath.startsWith('/tdp')">
        <component :is="currentView" />
    </template>
    <template v-else>
        <div class="row">
            <div class="col-md-3">
                <LeagueFilter />
            </div>
            <div class="col-md-9">
                <component :is="currentView" />
            </div>
        </div>
    </template>

</template>