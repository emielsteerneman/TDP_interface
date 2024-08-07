import { defineStore } from "pinia";
import axios from "axios";
import { ref, computed } from "vue";
import { useFilterStore } from "./filterStore";
import { API_URL } from '@/utilities.js'

function create_navigation(league_map, tdps){

    // Create league_to_n map
    let league_to_n = {}
    for( const tdp of tdps ){
        let league_id = tdp['l']
        if( ! (league_id in league_to_n) ){
            league_to_n[league_id] = 0
        }
        league_to_n[league_id] += 1
    }
    
    // Create the navigation object
    let nav = { 'sublevels': {}, 'leagues': [], 'n': 0 }
    
    for(const [league_id, [league_name, league_name_pretty]] of Object.entries(league_map)){
        
        let name_parts = league_name_pretty.split(" ")
        // Start at the top level
        let level = nav
        // For each name part ( e.g. ["Soccer", "Humanoid", "Adult"] )
        for( let idx in name_parts ){
            let name_part = name_parts[idx]
            // Create the next level if it doesn't exist
            if( ! (name_part in level.sublevels ) ){
                level['sublevels'][name_part] = { 'sublevels': {}, 'leagues': [], 'n': 0 }
            }
            // Add league (e.g. "Humanoid") to current level (e.g. "Soccer") if needed
            if( ! (league_name_pretty in level['leagues']) ){
                level['leagues'].push(league_id)
            }

            // If we are at the last name part (e.g. "Adult"), add the league to the sublevel
            if( idx == name_parts.length - 1 ){
                level['sublevels'][name_part]['leagues'].push(league_id)
            }                

            // Go down one level
            level = level['sublevels'][name_part]

            // Update the count of leagues in this level
            level['n'] += league_to_n[league_id]
            
        }
    }

    return nav
}

export const useTdpStore = defineStore('tdp', () => {
    const tdps = ref([])
    const n_tdps = ref(0)
    const isLoading = ref(false)
    const isFetched = ref(false)
    const error = ref(null)
    const league_map = ref({})
    const teamname_map = ref({})
  
    let response_data = null

    const filter_store = useFilterStore()

    const navigation = computed(() => {
        if (!isFetched.value) return null
    
        // let names_pretty = Object.values(league_map.value).map(x => x[1])
        const nav = create_navigation(response_data['league_map'], response_data['tdps'])
    
        console.log("[tdpStore.js] navigation computed")
    
        return nav
    })
  
    async function fetch() {
        console.log("[tdpStore.js] fetch()")

        if(isLoading.value) return

        isLoading.value = true
        try {
            const response = await axios.get(API_URL + '/api/tdps')
            console.log(response.data)
    
            response_data = response.data

            tdps.value = response.data['tdps']
            n_tdps.value = response.data['n_tdps']

            league_map.value = response.data['league_map']
            teamname_map.value = response.data['teamname_map']
    
            filter_store.set_league_map(league_map.value)

            console.log("[tdpStore.js][fetch] isFetched = true")
            isFetched.value = true
    
        } catch (err) {
            error.value = err
        } finally {
            isLoading.value = false
        }
    }

    function get_team(team_id){
        return teamname_map.value[team_id][0]
    }

    function get_team_pretty(team_id){
        return teamname_map.value[team_id][1]
    }
  
    return { tdps, n_tdps, isLoading, isFetched, league_map, error, navigation, fetch, league_map, teamname_map, get_team, get_team_pretty }
})
