<script setup>
import { ref, computed, reactive, onBeforeMount } from 'vue'
import axios from 'axios';
import TDPBlade from './components/TDPBlade.vue'

let someString = ref('Hello World??')
let league_map = ref({})
let teamname_map = ref({})
let tdps = ref([])

let league_filter_collapsed = ref(true)

let checked = ref(false)

let league_nav = reactive({})
let league_filter = reactive({})

onBeforeMount(() => {
  //someString = "Before Mount"
  console.log(axios)
  axios.get("http://localhost:5000/api/tdps").then((response) => {
    console.log(response.data)

    let _league_map = response.data['league_map']

    league_map.value = response.data['league_map']
    teamname_map.value = response.data['teamname_map']
    tdps.value = response.data['tdps']
    
    let nav = {
      'parts': {},
      'ids' : []
    }

    Object.keys(_league_map).map( key => {
      league_filter[key] = false
    })

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

      console.log(nav)

    }

    league_nav = nav
    
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
    <div class="col-md-2">

      <!-- button that collapses the list -->

      <ul class="list-group" v-if="'parts' in league_nav">
        
        <li data-bs-toggle="collapse" data-bs-target="#collapseExample" class="list-group-item" @click="league_filter_collapsed = !league_filter_collapsed">
          <div v-if="league_filter_collapsed">
            <b>v Leagues</b>
          </div>
          <div v-else>
            <b>^ Leagues</b>
          </div>
        </li>

        <div class="collapse" id="collapseExample">

        <!-- Major-->
        <template v-for="[name_major, k_major] in Object.entries(league_nav.parts)">
          <li class="list-group-item" @click="toggleLeague(k_major.ids)">
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
  
    <div class="col-9">
      <template v-for="(tdp, index) in tdps" :key="index">
        <!-- <template v-if=" teamname_map[tdp['t']][1].toLowerCase().includes(someString.toLowerCase())">
          year : {{index}} - {{ teamname_map[tdp['t']][1] }} - {{ league_map[tdp['l']][1] }} - {{  tdp['y'] }} <br>    
        </template> -->

        <template v-if="league_filter[tdp['l']]">
          year : {{index}} - {{ teamname_map[tdp['t']][1] }} - {{ league_map[tdp['l']][1] }} - {{  tdp['y'] }} <br>    
        </template>
      </template>
    </div>

  </div>
</template>
