<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
import axios from 'axios';
import TDPBlade from './components/TDPBlade.vue'

import { to_yearleagueteam, get_query_parameter_from_url } from './utilities';

let teamname_filter = ref('')
let league_map = ref({})
let teamname_map = ref({})
let tdps = ref([])

let league_nav = reactive({})
let league_filter = reactive({})

const hostname = window.location.hostname
const query = get_query_parameter_from_url()

const current_year = new Date().getFullYear()
const year_range = Array.from({length: 25}, (_, i) => current_year-i)

const year_min = ref(current_year-1)
const year_max = ref(current_year)

const tdps_filtered = computed(() => {
  console.log("tdps_filtered()")
  
  let tdps_filtered_list = []
  for( let tdp of tdps.value ){
    if( year_min.value <= tdp['y'] && tdp['y'] <= year_max.value){
      if( league_filter[tdp['l']] ){
        if (teamname_filter.value.length == 0){
          tdps_filtered_list.push(tdp)
        } else {
          let teamname = teamname_map.value[tdp['t']][1]
          if( teamname.toLowerCase().includes(teamname_filter.value.toLowerCase()) ){
            tdps_filtered_list.push(tdp)
          }
        }
      }
    }
  }
  
  return to_yearleagueteam(tdps_filtered_list)
})

let search_results = ref([])
let search_state = ref("INACTIVE")

onBeforeMount(async () => {

  console.log("onBeforeMount()")

  let API_URL = "https://functionapp-test-dotenv-310.azurewebsites.net"
  //API_URL = "http://"+hostname+":5000"

  search_state.value = "WAITING"
  await axios.get(API_URL + '/api/query?query=' + query).then((response) => {
    console.log("Axios response retrieved")

    search_results.value = response.data
    search_state.value = "DONE"
    return;

  }).catch((error) => {
    console.log("Axios error")
    console.log(error)
    search_results = []
    search_state.value = "ERROR"
  })

  console.log("onBeforeMount() finished")
})

function leagueIsActive(ids){
  return !ids.map(id => league_filter[id]).includes(false)
}

function toggleLeague(ids){
  let toActive = !leagueIsActive(ids)
  ids.map(id => league_filter[id] = toActive)
}

function toTdpPath(league_name, year, teamname){
  return league_name + '__' + year + '__' + teamname + '__0'
}

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

    <div class="col-md-3">

      <div class="input-group">
        <span class="input-group-text">
          <b>Team name</b>
        </span>
        <input type="text" class="form-control" v-model="teamname_filter">
      </div>

      <br>

      <!-- <div class="input-group">
        <span class="input-group-text">
          <b>Team name</b>
        </span>
        <select class="form-select form-control" value="">
          <option v-for="team in teamname_map">{{team[1]}}</option>
        </select>
      </div>

      <br> -->

      <!-- Year range -->
      <div class="input-group">
        <span class="input-group-text">
          <b>From</b>
        </span>
        <select class="form-select form-control" aria-label="Default select example" v-model.number="year_min">
          <option v-for="year in year_range" >{{year}}</option>
        </select>
        <span class="input-group-text">
          <b>To</b>
        </span>
        <select class="form-select" aria-label="Default select example" v-model.number="year_max">
          <option v-for="year in year_range" >{{year}}</option>
        </select>
      </div>

      <br>

      <br>
    </div>

    <div class="col-md-9">

      <div v-if="search_state == 'WAITING'">
        <h3>"{{ query }}" - Searching...</h3>
      </div>
      <div v-else-if="search_state == 'DONE'">
        <h3>"{{ query }}" - Retrieved {{ search_results['paragraphs'].length }} results</h3>
      </div>
      <div v-else-if="search_state == 'ERROR'">
        <h3>Error</h3>
      </div>
      
      <template v-for="result in search_results['paragraphs']">
        <hr>
        <div class="row" style="font-weight: bold; font-size: 1.2em;">
          <div class="col-md-7"> {{ result['title'] }} </div>
          <div class="col-md-5"> 
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
        <div v-html="highlight_words( result['content'], search_results['keywords'] )"></div>
        <br>
      </template>

      <template v-for="year in year_range">
        <template v-if="year in tdps_filtered">
          <h2>{{ year }}</h2>
          <template v-for="([league_name, league_name_pretty], league_idx) in league_map">
            
            <template v-if="league_idx in tdps_filtered[year]">
              <div>
                <b>{{ league_name_pretty }}</b>
              </div>

              <template v-for = "team_idx in tdps_filtered[year][league_idx]">

                <a :href="'#/tdp/' + toTdpPath(league_name, year, teamname_map[team_idx][0])" target="_blank">
                    <div style="display: inline-block; padding: 10px;">
                    <div v-if="teamname_map[team_idx][1] == 'RoboTeam Twente'">
                        <b style="color: purple; font-size: 1.5em;">{{ teamname_map[team_idx][1] }}</b>
                    </div>
                    <div v-else>
                        {{ teamname_map[team_idx][1] }}
                    </div>
                    </div>
                </a>


              </template>

            </template>

          </template>

        </template>
      </template>
    </div>

  </div>
</template>

<style>
.pointer {
  cursor: pointer;
}
</style>