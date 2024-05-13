<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
import axios from 'axios';
import TDPBlade from './components/TDPBlade.vue'
import LeagueSelect from './components/LeagueSelect.vue';

import { to_yearleagueteam } from './utilities';

let teamname_filter = ref('')
let league_map = ref({})
let teamname_map = ref({})
let tdps = ref([])

let league_nav = reactive({})
let league_filter = reactive({})

const hostname = window.location.hostname

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

onBeforeMount(async () => {

  console.log("onBeforeMount()")

  let API_URL = "https://functionapp-test-dotenv-310.azurewebsites.net"
  API_URL = "http://"+hostname+":5000"

  await axios.get(API_URL + '/api/tdps').then((response) => {
    console.log("Axios response retrieved")

    let _league_map = response.data['league_map']

    league_map.value = response.data['league_map']
    teamname_map.value = response.data['teamname_map']
    tdps.value = response.data['tdps']
    
    let nav = {
      'parts': {
        '(De)select all':{
          'parts': {},
          'ids': [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
        }},
      'ids' : []
    }

    Object.keys(_league_map).map( key => {
      league_filter[key] = false
    })
    // league_filter[9] = true
    // league_filter[10] = true
    // league_filter[11] = true

    // For each league in league_map
    for (let [key, [name, name_pretty]] of Object.entries(_league_map)) {
 
      let name_parts = name_pretty.split(" ")

      let currently_at = nav
      for( let idx in name_parts ){
        let name_part = name_parts[idx]

        if( ! (name_part in currently_at.parts ) ){
          currently_at['parts'][name_part] = { 'parts': {}, 'ids': [key] }
        }
        if( ! (key in currently_at['ids']) ){
          currently_at['ids'].push(key)
        }

        currently_at = currently_at['parts'][name_part]
      }
    }

    league_nav = nav

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

      <LeagueSelect :league_filter :league_nav />

      <br>
    </div>


    <div class="col-md-9">

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