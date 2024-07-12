<script setup>
import { ref } from 'vue'
import { API_URL } from '@/utilities'

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
    <div class="btn btn-primary" v-if="show_html"  @click="show_html = false">Toggle to PDF view</div>
    <div class="btn btn-primary" v-if="!show_html" @click="show_html = true">Toggle to HTML view</div>

    <template v-if="show_html">

        <iframe :src="API_URL + '/api/tdp/' + tdp_name + '/html'" width="100%" height="1000px" frameborder="0"></iframe>
        <!-- <iframe src="https://tdps.blob.core.windows.net/tdps/html/soccer/smallsize/2024/soccer_smallsize__2024__RoboIME__0.html" width="100%" height="1000px" frameborder="0"></iframe> -->

    </template>

    <template v-if="!show_html">

        <iframe :src="API_URL + '/api/tdp/' + tdp_name + '/pdf'" width="100%" height="1000px"></iframe>

    </template>
</template>