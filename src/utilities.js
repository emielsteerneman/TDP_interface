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

export { to_yearleagueteam }