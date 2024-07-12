<script setup>

import { to_tdp_path } from './utilities';
import { marked } from 'marked';

import { useQueryStore } from './stores/queryStore'
import { useLlmStore } from './stores/llmStore';

import { VueSpinner } from 'vue3-spinners';

const queryStore = useQueryStore()
const llmStore = useLlmStore()

function getIndicesOf(searchStr, str, caseSensitive) {
    var searchStrLen = searchStr.length;
    if (searchStrLen == 0) {
        return [];
    }
    var startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

function highlight_words(text, words){
    words.forEach(word => {
        word = word
        let indices = getIndicesOf(word, text, false)
        indices.slice().reverse().forEach(index => {
            text = text.slice(0, index) + "<span style='background-color: yellow;'>" + text.slice(index, index + word.length) + "</span>" + text.slice(index + word.length)
        })
    })
    return text
}

function to_path(result){
    const league = result['tdp_name']['league']['name']
    const year = result['tdp_name']['year']
    const team = result['tdp_name']['team_name']['name']
    return to_tdp_path(league, year, team)
}

</script>

<template>
    <!-- league nested menu -->
    <div class="row">

        <div v-if="llmStore.search_state == 'INACTIVE'">
            <div class="btn btn-primary" @click="llmStore.do_query">Ask LLM</div>
        </div>
        <div v-else-if="llmStore.search_state == 'WAITING'">
            <h3 class="text-center">Asking LLM... <VueSpinner /></h3>
        </div>

        
        <div v-if="llmStore.llm_response.length">
            <h3 class="text-center">LLM Response</h3>
            <hr>
            <div class="col-md-12">
                <div v-html="marked.parse(llmStore.llm_response)"></div>
            </div>
        </div>


        <template v-if="llmStore.search_state == 'INACTIVE'">
            <div v-if="queryStore.search_state == 'WAITING'">
                <h3 class="text-center">"{{ queryStore.query }}" - Searching <VueSpinner/></h3>
            </div>
            <div v-else-if="queryStore.search_state == 'EMPTY'">
                <h3 class="text-center">Empty search query</h3>
            </div>
            <div v-else-if="queryStore.search_state == 'DONE'">
                <h3 class="text-center">"{{ queryStore.query }}" - Retrieved {{ queryStore.search_results['paragraphs'].length }} results</h3>
            </div>
            <div v-else-if="queryStore.search_state == 'ERROR'">
                <h3 class="text-center">Error</h3>
            </div>

            <div v-if="queryStore.error_message.length">
                <br><br>
                <h4 class="text-center">{{ queryStore.error_message }}</h4>
            </div>
            
            <template v-for="result in queryStore.search_results['paragraphs']">
                <hr>
                <a :href="'#/tdp/' + to_path(result) + '?ref=list'" target="_blank">
                    <div class="row" style="font-weight: bold; font-size: 1.2em;">
                        <div class="col-md-5"> {{ result['title'] }} </div>
                        <div class="col-md-7 text-end"> 
                            {{ result['tdp_name']['team_name']['name_pretty'] }} -
                            {{ result['tdp_name']['league']['name_pretty'] }} - 
                            {{ result['tdp_name']['year'] }}
                        </div>
                    </div>
                </a>
                
                <div v-if="result['questions'].length">
                    
                    <template v-for="question in result['questions']">
                        <b>• {{ question }}</b><br>
                    </template>
                    <br>
                </div>
                <div v-html="highlight_words( result['content'], queryStore.search_results['keywords'] )"></div>
                <br>
            </template>
        </template>
    </div>
</template>

<style>
.pointer {
    cursor: pointer;
}
</style>