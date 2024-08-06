<script setup>
import { ref, computed } from 'vue'

import Navbar from './Navbar.vue'
import LeagueFilter from './components/LeagueFilter.vue'
import List from './List.vue'
import TDP from './TDP.vue'
import Query from './Query.vue'
import { useTdpStore } from './stores/tdpStore'
import { useQueryStore } from './stores/queryStore'
import { onBeforeMount } from 'vue'

const tdp_store = useTdpStore()
const queryStore = useQueryStore()

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
        // console.log("  - Checking if", currentPath.value, "starts with", route_key)
        if (currentPath.value.startsWith(route_key)){
            route = route_key
        }
    }
    console.log("  Setting route to", route)

    if (route == '/query'){
        queryStore.update_query_from_url()
    }

    if (route == '/' && !tdp_store.isFetched){
        tdp_store.fetch()
    }

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
        <div class="row">
            <div style="margin: 50px;"></div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="fixed-bottom">
                    <div style="padding: 10px; background-color: #f8f9fa; border-top: 2px solid #fcc;">
                        <div class="text-center">
                            <i class="bi bi-exclamation-triangle-fill" style="font-size:1.2em"></i>
                            Papers are still being processed! It might happen that the HTML version of a paper is not available yet, or that 
                            a paper doesn't show up in the search results.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </template>

</template>