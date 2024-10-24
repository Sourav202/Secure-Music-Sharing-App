//create a table for the search results
function createTable() {
    let divNew = document.getElementById("searchResults")
    var tableFormat = document.createElement('table')
    //css styling
    tableFormat.id = 'searchTable'
    tableFormat.style.width = '300px'
    tableFormat.style.borderCollapse = 'collapse'
    tableFormat.style.border = '1px solid #000'
    
    divNew.appendChild(tableFormat)
}

//formatting for all tables
function formatTable(table) {
    //CSS styling
    table.style.border = "1px solid #000"
    table.style.textAlign = "center" 
    table.style.verticalAlign = "middle"
}