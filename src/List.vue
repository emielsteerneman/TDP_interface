<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
import axios from 'axios';
import TDPBlade from './components/TDPBlade.vue'

import { to_yearleagueteam } from './utilities';

import { useTdpStore } from './stores/tdpStore';
import { useFilterStore } from './stores/filterStore';

const tdp_store = useTdpStore()
const filter_store = useFilterStore()

const current_year = new Date().getFullYear()
const year_range = Array.from({length: 25}, (_, i) => current_year-i)

const tdps_filtered = computed(() => {
    console.log("[List][tdps_filtered] calculating")
    
    if(!tdp_store.isFetched){
        console.log("[List][tdps_filtered] tdp_store not fetched")
        return {}
    }
    
    // current time in ms
    let start = new Date().getTime()

    let tdps_filtered_list = []
    
    for( let tdp of tdp_store.tdps ){
        let year = tdp['y']
        let league = tdp['l']
        let teamname = tdp['t']
        
        if( filter_store.year_min <= year && year <= filter_store.year_max){
            if( filter_store.league_is_active(league) ){
//                tdps_filtered_list.push(tdp)
                let teamname_filter = filter_store.teamname_filter.toLowerCase()
                if (teamname_filter.length == 0){
                    tdps_filtered_list.push(tdp)
                } else {
                    teamname = tdp_store.get_team_pretty(teamname).toLowerCase()
                    if( teamname.includes(teamname_filter) ){
                        tdps_filtered_list.push(tdp)
                    }
                }
            }
        }
    }
    
    let end = new Date().getTime()

    console.log("[List][tdps_filtered] done in", end-start, "ms")
    
    return to_yearleagueteam(tdps_filtered_list)
})

function toTdpPath(league_name, year, teamname){
    return league_name + '__' + year + '__' + teamname + '__0'
}

</script>

<template>
    {{  filter_store.teamname_filter }}
    <!-- For every year -->
    <template v-for="year in year_range">
        <template v-if="year in tdps_filtered">
            <h2>{{ year }}</h2>

            <!-- For every league -->
            <template v-for="([league_name, league_name_pretty], league_idx) in tdp_store.league_map">
                <template v-if="league_idx in tdps_filtered[year]">
                    <div>
                        <b>{{ league_name_pretty }}</b>
                    </div>
                    
                    <!-- For every team within year and league-->
                    <template v-for = "team_idx in tdps_filtered[year][league_idx]">
                        <a :href="'#/tdp/' + toTdpPath(league_name, year, tdp_store.get_team(team_idx) )" target="_blank">
                            <div style="display: inline-block; padding: 10px;">
                                {{ tdp_store.get_team_pretty(team_idx) }}
                            </div>
                        </a>
                    </template>
                </template>
            </template>
        </template>
    </template>
</template>

<style>
.pointer {
    cursor: pointer;
}
</style>