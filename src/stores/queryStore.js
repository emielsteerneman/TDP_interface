import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useTdpStore } from './tdpStore.js'
import { useFilterStore } from './filterStore.js'
import { API_URL, get_query_parameter_from_url } from '../utilities.js'
import axios from 'axios';

export const useQueryStore = defineStore('query', () => {
    const filter_store = useFilterStore()

    const query = ref("")
    const search_state = ref("INACTIVE")
    const search_results = ref([])

    function set_query(query_){
        query.value = query_
        do_query(query_)
    }

    function update_query_from_url(){
        console.log("[queryStore][update_query_from_url]")
        let query_ = get_query_parameter_from_url("query")
        query.value = query_
        do_query(query_)
    }

    function do_query(query_){
        console.log("[queryStore][do_query] query =", query_)

        // Indicate that the search is in progress
        search_results.value = {}
        search_state.value = "WAITING"

        // If the query is empty, set the search state to empty and return
        if(query_ == ""){
            search_state.value = "EMPTY"
            return
        }

        // Create the filter string
        let filter_string = ""
        
        const active_league_names  = filter_store.get_active_league_names()
        if(active_league_names.length > 0){
            filter_string += "&leagues=" + active_league_names.join(",")
        }
        if(filter_store.year_min < filter_store.year_from){
            // TODO fix year_min and year_from naming inconsistency
            filter_string += "&year_min=" + filter_store.year_from
        }
        if(filter_store.year_max > filter_store.year_to){
            // TODO fix year_max and year_to naming inconsistency
            filter_string += "&year_max=" + filter_store.year_to
        }
        
        axios.get(API_URL + '/api/query?query=' + query_ + filter_string).then((response) => {
            console.log("[queryStore][do_query] vvv Axios response retrieved vvv")
            console.log(response.data)

            search_results.value = response.data
            search_state.value = "DONE"
            return;
            
        }).catch((error) => {
            console.log("[queryStore][do_query] Axios error")
            console.log(error)
            search_results.value = {}
            search_state.value = "ERROR"
        })        
    }

    const query_results = computed(() => {
        return do_query(query.value)
    })

    return { query, search_results, search_state, set_query, update_query_from_url, query_results, do_query }

})