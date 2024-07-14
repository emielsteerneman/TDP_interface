<script setup>

import { ref } from 'vue';
import { to_tdp_path } from './utilities';
import { marked } from 'marked';

import { useQueryStore } from './stores/queryStore'
import { useLlmStore } from './stores/llmStore';

import { VueSpinner } from 'vue3-spinners';

const queryStore = useQueryStore()
const llmStore = useLlmStore()
const show_llm_input = ref(false)

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

        <div v-if="llmStore.search_state == 'WAITING'">
            <div class="col-md-8 offset-md-2">
                <h3 class="text-center">Asking LLM. This will take some time.. <VueSpinner /></h3>
                <br>
                <h4 class="text-center">Help keep this feature alive!</h4>
                <p class="text-start">Every <b>GPT 3.5</b> answer costs me around <b>1 cent</b>. I'm putting in my own money during the RoboCup. 
                Is your team willing to help me out? Please reach out to me at emielsteerneman@gmail.com </p>
                <br>
                <h4 class="text-center">Help improve this feature!</h4>
                <p class="text-start">
                    <b>Quality:</b> Every <b>GPT 4o</b> answer costs me around <b>10 cent</b>. It's answers are significantly better but also very expensive.
                    <br>
                    <b>Speed:</b> This search engine runs mostly on Azure free tier. Upgrading to a paid tier would make it faster but also more expensive.
                </p>


            </div>
        </div>
        
        <template v-if="llmStore.search_state=='DONE'">

            <!-- BUTTONS -->
            <div class="row">
                <div class="col-md-4">
                    <h3 class="text-start">LLM Response</h3>
                </div>
                <div class="col-md-4 d-grid">
                    <button class="btn btn-outline-primary" type="button" @click="llmStore.search_state='INACTIVE'">Go back to the search results</button>
                </div>
                <div class="col-md-4 d-grid">
                    <button class="btn btn-outline-primary" type="button" @click="show_llm_input = !show_llm_input">{{ show_llm_input ? 'Hide' : 'Show' }} the LLM input</button>
                </div>
            </div>

            <!-- LLM TEXT -->
            <hr style="margin-top: 10px;">
            <div class="col-md-12" v-if="show_llm_input">

                You are a helpful and knowledgeable assistant. You will be asked a question from a participant in the Robocup. The RoboCup is an international scientific initiative with the goal to advance the state of the art of intelligent robots. Every year, teams from all over the world compete in various robot leagues and robot soccer matches. The Robocup is all about sharing knowledge, collaboration, and friendly competition. You are a helpful and knowledgeable assistant. 
                You will be given a question and a list of paragraphs. Answer the question based on the information in the paragraphs. Always cite the team and year and number of the source paragraph for every piece of information you provide. Your answer should be concise and to the point. If you don't know the answer, you can say 'I don't know'.The answer should encourage the participant to do its own research. Maybe ask a question back to the participant or suggest follow-up research. 
                Again, it is absolutely important to always cite the source of your information. Always provide the paragraph title.

                For each paragraph given, answer the following question (ignore paragraphs without relevant data), and end with a summary: " {{ queryStore.query}} "

                <div v-html="llmStore.llm_input"></div>
            </div>
            <div class="col-md-12">
                <div v-html="marked.parse(llmStore.llm_response)"></div>
            </div>
        </template>

        <template v-if="llmStore.search_state == 'INACTIVE'">
            <template v-if="queryStore.search_state == 'WAITING'">
                <h3 class="text-center">"{{ queryStore.query }}" - Searching <VueSpinner/></h3>
            </template>
            <template v-else-if="queryStore.search_state == 'EMPTY'">
                <h3 class="text-center">Empty search query</h3>
            </template>
            <template v-else-if="queryStore.search_state == 'DONE'">
                <div class="col-md-8">
                    <h3 class="text-start">"{{ queryStore.query }}" - {{ queryStore.search_results['paragraphs'].length }} results</h3>
                </div>
                <div class="col-md-4 d-grid">
                    <button class="btn btn-outline-primary" type="button" @click="llmStore.do_query">Ask LLM (while the money lasts)</button>
                </div>
            </template>

            <template v-else-if="queryStore.search_state == 'ERROR'">
                <h3 class="text-center">Error</h3>
            </template>
            
            <template v-if="queryStore.error_message.length">
                <br><br>
                <h4 class="text-center">{{ queryStore.error_message }}</h4>
            </template>
            
            <template v-for="result in queryStore.search_results['paragraphs']">
                <hr style="margin-top: 10px;">
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