import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useFilterStore } from './filterStore.js'
import { useLlmStore } from "./llmStore.js";
import { API_URL, SEARCH_DISABLED, get_query_parameter_from_url } from '@/utilities.js'
import axios from 'axios';

export const useQueryStore = defineStore('query', () => {
    const filter_store = useFilterStore()
    const llm_store = useLlmStore()

    const query = ref("")
    const search_state = ref("INACTIVE")
    const search_results = ref([])
    const error_message = ref("")

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
        if(SEARCH_DISABLED){
            console.log("[queryStore][do_query] SEARCH_DISABLED")
            return
        }
        
        console.log("[queryStore][do_query] query =", query_)

        // Indicate that the search is in progress
        search_results.value = {}
        search_state.value = "WAITING"

        // If the query is empty, set the search state to empty and return
        if(query_ == ""){
            search_state.value = "EMPTY"
            return
        }

        llm_store.reset()

        // Create the filter string
        let filter_string = filter_store.get_filter_string_for_url()
        
        axios.get(API_URL + '/api/query?query=' + query_ + filter_string).then((response) => {
            console.log("[queryStore][do_query] vvv Axios response retrieved vvv")
            console.log(response.data)

            search_results.value = response.data
            search_state.value = "DONE"
            
        }).catch((error) => {
            console.log("[queryStore][do_query] Axios error")
            console.log(error)
            
            search_results.value = {}
            search_state.value = "ERROR"

            if ('response' in error && 'data' in error.response && 'error' in error.response.data && 'message' in error.response.data){
                console.log(error.response.data)
                if(error.response.data['error'] == "RateLimitError"){
                    error_message.value = "I'm out of OpenAI Credits! Stuff is expensive.. Please let me know via Discord or emielsteerneman@gmail.com"
                }else{
                    error_message.value = "Something went wrong, and I don't know what.. Please let me know via Discord or emielsteerneman@gmail.com. The error is: " + error.response.data['error'] + " : " + error.response.data['message']
                }
            }else{
                error_message.value = "Something went wrong, and I don't know what.. Please let me know via Discord or emielsteerneman@gmail.com. The error is: " + error
            }
        })        
    }

    const query_results = computed(() => {
        return do_query(query.value)
    })

    const get_query = function(){
        return query.value
    }

    return { query, search_results, search_state, error_message, set_query, update_query_from_url, query_results, do_query, get_query }

})