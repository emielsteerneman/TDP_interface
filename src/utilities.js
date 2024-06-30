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

function get_query_parameter_from_url(){
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query')
    return query
}

export { to_yearleagueteam, get_query_parameter_from_url }
