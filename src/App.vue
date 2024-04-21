<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
import axios from 'axios';
import TDPBlade from './components/TDPBlade.vue'

let someString = ref('Hello World??')
let league_map = ref({})
let teamname_map = ref({})
let tdps = ref([])

let league_filter_collapsed = ref(false)

let checked = ref(false)

let league_nav = reactive({})
let league_filter = reactive({})

let year_min = ref(2021)
let year_max = ref(2024)

function to_yearleagueteam(tdps){
  let yearleagueteam = {}
  for( let tdp of tdps ){
    let year = tdp['y']
    let league = tdp['l']
    let team = tdp['t']
    if( ! (year in yearleagueteam) ){
      yearleagueteam[year] = {}
    }
    if( ! (league in yearleagueteam[year]) ){
      yearleagueteam[year][league] = []
    }
    yearleagueteam[year][league].push(team)
  }
  return yearleagueteam
}

onBeforeMount(() => {

  axios.get("http://localhost:5000/api/tdps").then((response) => {
    console.log(response.data)

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
    league_filter[9] = true
    league_filter[10] = true
    league_filter[11] = true

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
    
    console.log(to_yearleagueteam(tdps.value))

  })
})

function leagueIsActive(ids){
  return !ids.map(id => league_filter[id]).includes(false)
}

function toggleLeague(ids){
  let toActive = !leagueIsActive(ids)
  ids.map(id => league_filter[id] = toActive)
}

</script>

<template>
  <input type="text" v-model="someString" />
  <hr>

  <!-- league nested menu -->
  <div class="row">

    <div class="col-md-3">

      <div class="row">
        <div class="col-md-6">
          <select class="form-select" aria-label="Default select example" v-model="year_min">
            <option v-for="(e,year_offset) in 25" >{{2024-year_offset}}</option>
          </select>
        </div>
        <div class="col-md-6">
          <select class="form-select" aria-label="Default select example" v-model="year_max">
            <option v-for="(e,year_offset) in 25" >{{2024-year_offset}}</option>
          </select>
        </div>
      </div>

      <br>

      <!-- button that collapses the list -->
      <ul class="list-group user-select-none pointer" v-if="'parts' in league_nav">
        
        <li data-bs-toggle="collapse" data-bs-target="#leagueFilter" class="list-group-item" @click="league_filter_collapsed = !league_filter_collapsed">
          <div v-if="league_filter_collapsed">
            <b> Leagues</b><i class="bi bi-arrow-down float-end"></i>
          </div>
          <div v-else>
            <b> Leagues</b><i class="bi bi-arrow-up float-end"></i>
          </div>
        </li>

        <div class="collapse show" id="leagueFilter">

        <!-- Major-->
        <template v-for="[name_major, k_major] in Object.entries(league_nav.parts)">
          <li class="list-group-item pointer" @click="toggleLeague(k_major.ids)">
            <input class="form-check-input" type="checkbox" :checked="leagueIsActive(k_major.ids)" style="margin-right:15px"> <b>{{ name_major }}</b>
          </li>
          
          <!-- Minor-->
          <template v-for="[name_minor, k_minor] in Object.entries(k_major.parts)">
            <li class="list-group-item" @click="toggleLeague(k_minor.ids)">
              <div style="margin-left: 30px;">
                <input class="form-check-input" type="checkbox" :checked="leagueIsActive(k_minor.ids)" style="margin-right:15px"> {{ name_minor }}
              </div>
            </li>
            
            <!-- Sub -->
            <template v-for="[name_sub, k_sub] in Object.entries(k_minor.parts)">
              <li class="list-group-item" @click="toggleLeague(k_sub.ids)">
                <div style="margin-left: 60px;">
                  <input class="form-check-input" type="checkbox" :checked="leagueIsActive(k_sub.ids)" style="margin-right:15px"> {{ name_sub }}
                </div>
              </li>
            </template>
            <!-- // Sub -->

          </template>
          <!-- // Minor-->

        </template>
        <!-- // Major-->

        </div>
      
      </ul>
    </div>


    
    <div class="col-md-8">

      <template v-for="(e, year) in year_max - year_min + 1">
        <h2>{{ year+year_min }}</h2>
        
        <template v-for="(tdp, index) in tdps" :key="index">
          <!-- <template v-if=" teamname_map[tdp['t']][1].toLowerCase().includes(someString.toLowerCase())">
            year : {{index}} - {{ teamname_map[tdp['t']][1] }} - {{ league_map[tdp['l']][1] }} - {{  tdp['y'] }} <br>    
          </template> -->

          <template v-if="league_filter[tdp['l']] && tdp['y'] == year+year_min">
            
            <div style="display: inline-block; padding: 10px;">
              <b>{{ teamname_map[tdp['t']][1] }}</b> - {{ league_map[tdp['l']][1] }} <br>    
            </div>
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