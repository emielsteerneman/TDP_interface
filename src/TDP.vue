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

const show_html = ref(true);

</script>

<template>
    <div class="btn btn-primary" @click="show_html = !show_html">Toggle</div>

    <template v-if="show_html">

        <iframe :src="'http://' + hostname + ':5000/api/tdp/' + tdp_name + '/html'" width="100%" height="1000px"></iframe>

    </template>

    <template v-if="!show_html">

        <iframe :src="'http://' + hostname + ':5000/api/tdp/' + tdp_name + '/pdf'" width="100%" height="1000px"></iframe>

    </template>
</template>