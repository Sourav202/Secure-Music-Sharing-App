//clear the user input field when the page it loaded
window.addEventListener("load", (event) => {
    document.getElementById("songTitleTextField").value = ""
})
//var keeping to track of request processing
let isRequestInProgress = false

//premade function to get a song from the iTunes API
function getSong() {
    //to prevent duplicate getSongs calls when the enter is pressed/clicked
    if (isRequestInProgress) {
        return
    }
    isRequestInProgress = true

    let songTitle = document.getElementById("songTitleTextField").value.trim()
    if(songTitle === "") {
        isRequestInProgress = false; // Reset the flag if there's no song title

        return alert("Please enter a Song Title")
    }
    //clears the old search results before adding the new results
    let oldSearchTable = document.getElementById('searchResults');
    if (oldSearchTable) {
        while (oldSearchTable.firstChild) {
            oldSearchTable.removeChild(oldSearchTable.firstChild);
        }
    }

   let songsDiv = document.getElementById("songs_div")
   songsDiv.innerHTML = ""

    let xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            //reset flag
            isRequestInProgress = false

            let response = JSON.parse(xhr.responseText)
            songsDiv.innerHTML = `
            <h3>Songs matching: ${songTitle} </h3>`
            //call function to show songs in search results
            showSongs(response.results)
      }
    }
    xhr.open("GET", `/songs?title=${songTitle}`, true)
    xhr.send()
}

//shows all songs in the search results and updates the display
function showSongs(songs) {
    let searchTable = document.getElementById("searchResults")
    //if a search table does not exist it creates a new one
    if (!searchTable && songs.length > 0) {
        createTable()
        searchTable = document.getElementById("searchResults")
    }
    //process all songs found by iTunes API
    if (songs.length > 0) {
        songs.forEach((song) => {
            //new table for search results with all its elements and styling
            let searchNew = document.createElement("tr")
            
            //create and add button value and functionality
            let addButtonCell = document.createElement("td")
            formatTable(addButtonCell)
            let addButton = document.createElement("button")
            addButton.innerHTML = "➕"
            addButton.onclick = function() { addToPlaylist(searchNew, song)}
            addButtonCell.appendChild(addButton)
            searchNew.appendChild(addButtonCell)

            //create and adds the song name to the second column
            let songName = document.createElement("td")
            formatTable(songName)
            songName.innerHTML = song.trackName
            searchNew.appendChild(songName)

            //create and adds the artist name to the third column
            let songArtist = document.createElement("td")
            formatTable(songArtist)
            songArtist.innerHTML = song.artistName
            searchNew.appendChild(songArtist)

            //create and adds the artist album cover to the last column
            let art = document.createElement("img")
            art.src = song.artworkUrl100

            let songAlbum = document.createElement("td")
            songAlbum.src = song.artworkUrl100
            songAlbum.appendChild(art)
            formatTable(art)
            searchNew.appendChild(songAlbum)
    
            //adds the new content as a full new row
            searchTable.appendChild(searchNew)
        })
    }
}