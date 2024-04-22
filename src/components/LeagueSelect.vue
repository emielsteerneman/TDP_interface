<script setup>

import { ref } from 'vue'

const props = defineProps({
    league_nav: Object,
    league_filter: Object
})

let league_filter_collapsed = ref(false)

function leagueIsActive(ids){
    return !ids.map(id => props.league_filter[id]).includes(false)
}

function toggleLeague(ids){
    let toActive = !leagueIsActive(ids)
    ids.map(id => props.league_filter[id] = toActive)
}

</script>

<template>
    <ul class="list-group user-select-none pointer" v-if="'parts' in league_nav">
        <!-- button that collapses the list -->
        <li data-bs-toggle="collapse" data-bs-target="#leagueFilter" class="list-group-item" @click="league_filter_collapsed = !league_filter_collapsed">
            <div v-if="league_filter_collapsed">
            <b> Leagues</b><i class="bi bi-arrow-down float-end"></i>
            </div>
            <div v-else>
            <b> Leagues</b><i class="bi bi-arrow-up float-end"></i>
            </div>
        </li>
        <!-- list -->
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
</template>