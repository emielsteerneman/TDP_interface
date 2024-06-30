<script setup>
import { ref } from 'vue'
const hostname = window.location.hostname

let currentPath = window.location.pathname
if( window.location.hash != "" ){
  currentPath = window.location.hash
}
if (currentPath.startsWith("#")){
  currentPath = currentPath.slice(1)
}

const path_parts = currentPath.split('/')
console.log(path_parts)
// find 'tdp' in path_parts
const tdp_name = path_parts[path_parts.indexOf('tdp')+1]

const show_html = ref(false);

let API_URL = "https://functionapp-test-dotenv-310.azurewebsites.net"
//API_URL = "http://"+hostname+":5000"

</script>

<template>
    <div class="btn btn-primary" @click="show_html = !show_html">Toggle</div>

    <template v-if="show_html">

        <iframe :src="API_URL + '/api/tdp/' + tdp_name + '/html'" width="100%" height="1000px"></iframe>

    </template>

    <template v-if="!show_html">

        <iframe :src="API_URL + '/api/tdp/' + tdp_name + '/pdf'" width="100%" height="1000px"></iframe>

    </template>
</template>