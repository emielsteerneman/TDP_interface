<script setup>
    import { ref } from 'vue'
    import { get_query_parameter_from_url } from './utilities';

    const query = ref(get_query_parameter_from_url())
    console.log("[Navbar] query =", query.value)

    function handleSearch(){
        // let searchbox = document.getElementById("searchbox")
        // let query = searchbox.value
        window.location.href = "/#/query?query=" + query.value
    }
</script>

<template>
    <!-- Navbar Top -->
    <nav class="navbar navbar-expand navbar-light bg-light fixed-top">
        <div class="container">
            <a class="navbar-brand" href="/#">
                <!-- <img src="/static/logos/RoboTeam Twente.png" alt="Logo" width="24" height="24" class="d-inline-block align-text-top"> -->
                RTT ETDP
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item" style="padding: 0px 10px 0px 10px">
                        <a class="nav-link" href="/#">List of TDPs</a>
                    </li>
                    <li class="nav-item" style="padding: 0px 10px 0px 10px">
                        <a class="nav-link" href="https://github.com/emielsteerneman/TDP">
                            <!-- <img src="/static/github.png" alt="Logo" width="24" height="24"> -->
                            Github
                        </a>
                    </li>
                    <li class="nav-item" style="padding: 0px 10px 0px 10px">
                        <a class="nav-link" href="https://discordapp.com/channels/@me/emielsteerneman/">
                            <!-- <img src="/static/discord.svg" alt="Logo" width="24" height="24"> -->
                            Discord
                        </a>
                    </li>
                </ul>
                <div class="d-flex ms-auto me-auto flex-fill">
                <!-- <div> -->
                    <input class="form-control" @keyup.enter="handleSearch" v-model="query" id="searchbox" type="search" placeholder="Search" name="query">
                    <button class="btn btn-outline-primary" @click="handleSearch" type="submit">Search</button>
                </div>
            </div>
        </div>
    </nav>
</template>