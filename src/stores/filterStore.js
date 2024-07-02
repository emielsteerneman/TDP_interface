import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useTdpStore } from './tdpStore.js'

export const useFilterStore = defineStore('filter', () => {
    const tdp_store = useTdpStore()

    const league_filter = ref({})
    const teamname_filter = ref("")

    const current_year = new Date().getFullYear()
    const year_range = Array.from({length: 25}, (_, i) => current_year-i)

    const year_min = ref(current_year-10)
    const year_max = ref(current_year)

    function league_is_active(league_id){
        if(league_id in league_filter.value){
            return league_filter.value[league_id]
        }else{
            return false
        }
    }

    function set_league_map(league_map){
        console.log("[filterStore.js][set_league_map]")
        // [league_id] => { league_id: false }
        league_filter.value = Object.fromEntries(Object.keys(league_map).map(league_id => [league_id, false]))
    }

    function set_league(league_id, is_active){
        console.log("[filterStore.js][set_league] " + league_id + " " + is_active)
        league_filter.value[league_id] = is_active
    }

    return { league_is_active, set_league, set_league_map, teamname_filter, year_min, year_max }

})