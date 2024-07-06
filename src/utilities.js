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

function get_query_parameter_from_url(){
    console.log("[get_query_parameter_from_url] window.location.search: ", window.location.search)
    // const urlParams = new URLSearchParams(window.location.search)
    const urlParams = parse_query_params(window.location.hash)
    const query = urlParams.get('query') || ''
    console.log("[get_query_parameter_from_url] query: ", query)
    console.log("[get_query_parameter_from_url]", urlParams.get('query'))
    return query.trim()
}

function toTdpPath(league_name, year, teamname){
    return league_name + '__' + year + '__' + teamname + '__0'
}


export { to_yearleagueteam, get_query_parameter_from_url, toTdpPath }
