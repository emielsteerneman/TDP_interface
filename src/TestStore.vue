<script setup>
    import { ref, computed } from 'vue'

    import { useTdpStore } from './stores/tdpStore.js'
    import { onMounted } from 'vue'

    
    import LeagueFilter from './components/LeagueFilter.vue'

    const tdp_store = useTdpStore()

    onMounted(() => {
        if(!tdp_store.isFetched)
            tdp_store.fetch()

        console.log("TestStore.vue: onMounted()")
    })

</script>

<template>
    <div>
        <h1>TestStore</h1>
        <p>TestStore</p>

        isFetched: {{ tdp_store.isFetched }}
        <br>
        <!-- <pre v-if="tdp_store.isFetched">
            {{ JSON.stringify(tdp_store.navigation, null, 2) }}
        </pre> -->
        
        <br><br>

        <div class="row">
            <div class="col-md-3">
                <LeagueFilter />
            </div>
        </div>

    </div>
</template>