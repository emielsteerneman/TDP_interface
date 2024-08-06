<script setup>
import { ref, onMounted } from 'vue'
import { API_URL, get_param_from_url } from '@/utilities'
import { VueSpinner } from 'vue3-spinners';

let currentPath = window.location.pathname
if( window.location.hash != "" ){
  currentPath = window.location.hash
}
if (currentPath.startsWith("#")){
  currentPath = currentPath.slice(1)
}

const path_parts = currentPath.split('/')
// find 'tdp' in path_parts
let tdp_name = path_parts[path_parts.indexOf('tdp')+1]
tdp_name = tdp_name.split('?')[0]

const referer = get_param_from_url('ref')

const show_html = ref(true);

const frame_html_loaded = ref(false)
const frame_pdf_loaded = ref(false)

function html_loaded(){
    frame_html_loaded.value = true
}
function pdf_loaded(){
    frame_pdf_loaded.value = true
}

</script>
                                                                                                                                                                                                           
<template>
    <div class="btn btn-primary" v-if="show_html"  @click="show_html = false">Toggle to PDF view</div>
    <div class="btn btn-primary" v-if="!show_html" @click="show_html = true">Toggle to HTML view</div>

    <template v-if="show_html">

        <template v-if="!frame_html_loaded">
            <h3>Loading document <VueSpinner/></h3>
            HTML versions might not yet be available for all documents. If you need a PDF version, please click the button above.
        </template>

        <iframe ref="frame_html" 
            :src="API_URL + '/api/tdp/' + tdp_name + '/html?ref=' + referer" 
            width="100%" height="1000px" frameborder="0" 
            @load="html_loaded">
        </iframe>

        
        
    </template>

    <template v-if="!show_html">
        
        <template v-if="!frame_pdf_loaded">
            <h3>Loading document <VueSpinner/></h3>
        </template>

        <iframe ref="frame_pdf" 
            :src="API_URL + '/api/tdp/' + tdp_name + '/pdf'" 
            width="100%" height="1000px"
            @load="pdf_loaded">
        </iframe>

    </template>
</template>