<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
// import axios from 'axios';


import { get_query_parameter_from_url } from './utilities';

import { useQueryStore } from './stores/queryStore'

const queryStore = useQueryStore()

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
    // return text
    return text
}

</script>

<template>
    <!-- league nested menu -->
    <div class="row">
        <div v-if="queryStore.search_state == 'WAITING'">
            <h3 class="text-center">"{{ queryStore.query }}" - Searching...</h3>
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
        
        <template v-for="result in queryStore.search_results['paragraphs']">
            <hr>
            <div class="row" style="font-weight: bold; font-size: 1.2em;">
                <div class="col-md-6"> {{ result['title'] }} </div>
                <div class="col-md-6"> 
                    {{ result['tdp_name']['team_name']['name_pretty'] }} -
                    {{ result['tdp_name']['league']['name_pretty'] }} - 
                    {{ result['tdp_name']['year'] }}
                </div>
            </div>
            
            <template v-if="result['questions'].length">
                
                <template v-for="question in result['questions']">
                    <i>• {{ question }}</i><br>
                </template>
                <br>
            </template>
            <div v-html="highlight_words( result['content'], queryStore.search_results['keywords'] )"></div>
            <br>
        </template>
    </div>
</template>

<style>
.pointer {
    cursor: pointer;
}
</style>