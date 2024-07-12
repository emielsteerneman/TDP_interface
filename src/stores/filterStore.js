import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useTdpStore } from './tdpStore.js'

export const useFilterStore = defineStore('filter', () => {
    const tdp_store = useTdpStore()

    const league_filter = ref({})
    let league_names = []
    const teamname_filter = ref("")

    const current_year = new Date().getFullYear()
    const year_range = Array.from({length: 25}, (_, i) => current_year-i)

    const year_min = 2000
    const year_max = current_year

    const year_from = ref(year_min)
    const year_to = ref(year_max)

    function league_is_active(league_id){
        if(league_id in league_filter.value){
            return league_filter.value[league_id]
        }else{
            return false
        }
    }

    function get_active_league_names(){
        return Object.keys(league_filter.value).filter(league_id => league_filter.value[league_id]).map(league_id => league_names[league_id])
    }

    function set_league_map(league_map){
        league_filter.value = Object.fromEntries(Object.keys(league_map).map(league_id => [league_id, false]))
        league_names = Object.keys(league_map).map(league_id => league_map[league_id][0])
    }

    function set_league(league_id, is_active){
        league_filter.value[league_id] = is_active
    }

    function get_filter_string_for_url(){
        let filter_string = ""
        const active_league_names = get_active_league_names()
        if(active_league_names.length > 0){
            filter_string += "&leagues=" + active_league_names.join(",")
        }
        if(year_min < year_from.value){
            filter_string += "&year_min=" + year_from.value
        }
        if(year_max > year_to.value){
            filter_string += "&year_max=" + year_to.value
        }
        return filter_string
    
    }

    return { league_is_active, set_league, set_league_map, get_active_league_names, teamname_filter, year_from, year_to, year_min, year_max, get_filter_string_for_url }

})