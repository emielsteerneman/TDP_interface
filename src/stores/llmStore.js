import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useQueryStore } from './queryStore.js'
import { useFilterStore } from './filterStore.js'
import { API_URL, SEARCH_DISABLED } from '@/utilities.js'
import axios from 'axios';

export const useLlmStore = defineStore('llm', () => {

    const llm_input = ref("")
    const llm_response = ref("")
    const search_state = ref("INACTIVE")
    const error_message = ref("")

    const query_store = useQueryStore()
    const filter_store = useFilterStore()

    function do_query(){
        if(SEARCH_DISABLED){
            console.log("[llmStore][do_query] SEARCH_DISABLED")
            return
        }

        console.log("[llmStore][do_query]")

        search_state.value = "WAITING"

        const query = query_store.get_query()
        const filter_string = filter_store.get_filter_string_for_url()

        axios.get(API_URL + '/api/query/llm?query=' + query + filter_string).then((response) => {
            console.log("[llmStore][do_query] vvv Axios response retrieved vvv")

            llm_input.value = response.data['llm_input'].replace(/\n/g, "<br>")
            llm_response.value = response.data['llm_response']

            search_state.value = "DONE"
        }).catch((error) => {
            console.log("[llmStore][do_query] Axios error")
            console.log(error)

            llm_input.value = ""
            llm_response.value = ""
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

    function reset(){
        llm_input.value = ""
        llm_response.value = ""
        search_state.value = "INACTIVE"
        error_message.value = ""
    }

    return { do_query, llm_response, llm_input, search_state, error_message, reset }
})