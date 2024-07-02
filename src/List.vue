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
const tdps_filtered_has_results = computed(() => {
    return 0 < Object.keys(tdps_filtered.value).length
})

function toTdpPath(league_name, year, teamname){
    return league_name + '__' + year + '__' + teamname + '__0'
}

</script>

<template>
    <!-- For every year -->
    <template v-if="!tdps_filtered_has_results == 0">
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
    <template v-else>
        <div style="padding: 50px">
            <br><br><br>
            <p class="text-center" id="welcome"> Welcome to RoboTeam Twente TDP Search Engine. Ask and you shall receive. </p>
            <p class="text-center"> Start by selecting filters on the left </p>
            <hr>
            <p class="text-center" style="font-style: italic;">
                "By the middle of the 21st century, a team of fully autonomous humanoid robot soccer players shall win a soccer game, complying with the official rules of FIFA, against the winner of the most recent World Cup."
            </p>
            <p align="justify">
                We are all working towards the same goal. What I love about the Small Size League is that, while 
                we're opponents on the field, we're always ready to help one another with development and improvement. 
                I am not only referring to the currently existing teams and their members, but also all those that came before us. 
                All of these teams are helping us by sharing their knowledge through the TDPs and ETDPs (634 papers in my collection and counting). 
                Reading 634 papers is of course impossible. Therefore, to keep our inspiration and innovation going, 
                RoboTeam Twente has made this information more accessible through this (E)TDP Search Engine.
            </p>
        </div>
    </template>
</template>

<style>
.pointer {
    cursor: pointer;
}
#welcome {
    font-size: 1.25em;
}
</style>