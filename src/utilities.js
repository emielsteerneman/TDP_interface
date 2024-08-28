// const API_URL = "http://localhost:5000"
const API_URL = "https://functionapp-test-dotenv-310.azurewebsites.net"
const UNDER_CONSTRUCTION = false
const SEARCH_DISABLED = true

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

function parse_query_params(hash){
    const queryIndex = hash.indexOf('?');
    if (queryIndex !== -1) {
        return new URLSearchParams(hash.slice(queryIndex));
    }
    return new URLSearchParams();
};

function get_param_from_url(param){
    const urlParams = parse_query_params(window.location.hash)
    const value = urlParams.get(param) || ''
    return value.trim()
}

function get_query_parameter_from_url(){
    return get_param_from_url('query')
}

function to_tdp_path(league_name, year, teamname){
    return league_name + '__' + year + '__' + teamname + '__0'
}


export { API_URL, UNDER_CONSTRUCTION, SEARCH_DISABLED, to_yearleagueteam, get_param_from_url, get_query_parameter_from_url, to_tdp_path }
