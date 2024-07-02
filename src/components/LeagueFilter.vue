<script setup>

import { ref } from 'vue'
import { useTdpStore } from '@/stores/tdpStore.js'
import { useFilterStore } from '@/stores/filterStore.js';

const tdp_store = useTdpStore()
const filter_store = useFilterStore()

const current_year = new Date().getFullYear()
const year_range = Array.from({length: 25}, (_, i) => current_year-i)

let league_filter_collapsed = ref(false)

function allLeaguesActive(){
    let all_filter_values = Object.values(props.league_filter)
    return !all_filter_values.includes(true)
}

function leagueIsActive(ids){
    return !ids.map(id => filter_store.league_is_active(id)).includes(false)
}

function toggleLeague(ids){
    console.log("[LeagueFilter][toggleLeague] toggleLeague()", ids)
    let any_deactivated = ids.map(id => filter_store.league_is_active(id)).includes(false)
    
    for(const id of ids){
        filter_store.set_league(id, any_deactivated)
    }
}

</script>

<template>
    <template v-if="tdp_store.isLoading">
        Loading leagues...
    </template>
    
    <template v-if="tdp_store.isFetched">
        
        <!-- Team name filter -->
        <div class="input-group">
            <span class="input-group-text">
                <b>Team name</b>
            </span>
            <input type="text" class="form-control" v-model="filter_store.teamname_filter">
        </div>
        
        <br>
        
        <!-- Year range -->
        <div class="input-group">
            <span class="input-group-text">
                <b>From</b>
            </span>
            <select class="form-select form-control" v-model.number="filter_store.year_min">
                <option v-for="year in year_range" >{{year}}</option>
            </select>
            <span class="input-group-text">
                <b>To</b>
            </span>
            <select class="form-select" v-model.number="filter_store.year_max">
                <option v-for="year in year_range" >{{year}}</option>
            </select>
        </div>

        <br>
        
        <ul class="list-group user-select-none pointer" v-if="'sublevels' in tdp_store.navigation">
            <li data-bs-toggle="collapse" data-bs-target="#leagueFilter" class="list-group-item" @click="league_filter_collapsed = !league_filter_collapsed">
                <div v-if="league_filter_collapsed">
                    <b> Leagues</b><i class="bi bi-arrow-down float-end"></i>
                </div>
                <div v-else>
                    <b> Leagues</b><i class="bi bi-arrow-up float-end"></i>
                </div>
            </li>
            <!-- list -->
            <div class="collapse show" id="leagueFilter">
                <!-- Major-->
                <template v-for="[name_major, k_major] in Object.entries(tdp_store.navigation.sublevels)">
                    <li class="list-group-item pointer" @click="toggleLeague(k_major.leagues)">
                        <input class="form-check-input" type="checkbox" :checked="leagueIsActive(k_major.leagues)" style="margin-right:15px"> <b>{{ name_major }}</b>
                    </li>
                    
                    <!-- Minor-->
                    <template v-for="[name_minor, k_minor] in Object.entries(k_major.sublevels)">
                        <li class="list-group-item" @click="toggleLeague(k_minor.leagues)">
                            <div style="margin-left: 30px;">
                                <input class="form-check-input" type="checkbox" :checked="leagueIsActive(k_minor.leagues)" style="margin-right:15px"> {{ name_minor }}
                            </div>
                        </li>
                        
                        <!-- Sub -->
                        <template v-for="[name_sub, k_sub] in Object.entries(k_minor.sublevels)">
                            <li class="list-group-item" @click="toggleLeague(k_sub.leagues)">
                                <div style="margin-left: 60px;">
                                    <input class="form-check-input" type="checkbox" :checked="leagueIsActive(k_sub.leagues)" style="margin-right:15px"> {{ name_sub }}
                                </div>
                            </li>
                        </template>
                        <!-- // Sub -->
                        
                    </template>
                    <!-- // Minor-->
                    
                </template>
                <!-- // Major-->
            </div>
        </ul>
    </template>
</template>