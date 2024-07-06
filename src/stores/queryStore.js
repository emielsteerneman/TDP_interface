import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useTdpStore } from './tdpStore.js'
import { useFilterStore } from './filterStore.js'
import { get_query_parameter_from_url } from '../utilities.js'
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
        let query_ = get_query_parameter_from_url("query")
        query.value = query_
        do_query(query_)
    }

    function do_query(query_){
        console.log("[queryStore][do_query] query =", query_)
        search_results.value = {}

        if(query_ == ""){
            search_state.value = "EMPTY"
            return
        }

        let API_URL = "https://functionapp-test-dotenv-310.azurewebsites.net"
    
        search_state.value = "WAITING"
        axios.get(API_URL + '/api/query?query=' + query_).then((response) => {
            console.log("[queryStore][do_query] Axios response retrieved")
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
        
        console.log("[queryStore][do_query] onBeforeMount() finished")
        
    }

    const query_results = computed(() => {
        return do_query(query.value)
    })

    return { query, search_results, search_state, set_query, update_query_from_url, query_results, do_query }

})