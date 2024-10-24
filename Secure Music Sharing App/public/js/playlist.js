//adds a song to the playlist (the bottom row) and updates the display
function addToPlaylist(row, song) {
    //gets playlist area and removes chosen song from the search results (to be added to the playlist area)
    let playlistTable = document.getElementById("playlistArea")
    let searchTable = document.getElementById("searchResults")
    if (searchTable && searchTable.contains(row)) {
        // search table exists and contains the song, remove it
        searchTable.removeChild(row);
    }

    //new table for playlist with all its elements and styling
    let playlistNew = document.createElement("tr")
    let buttons = document.createElement("td")
    formatTable(buttons)

    //remove button value and functionality
    let remove = document.createElement("button")
    remove.innerHTML = "➖" 
    remove.onclick = function() {removeFromPlaylist(playlistNew)}
    buttons.appendChild(remove)
    //up buttons value and functionality
    let up = document.createElement("button")
    up.innerHTML = "🔼"
    up.onclick = function() {moveSongInPlaylist(playlistNew, 1)}
    buttons.appendChild(up)
    //down button value and functionality
    let down = document.createElement("button")
    down.innerHTML = "🔽" 
    down.onclick = function() {moveSongInPlaylist(playlistNew, 0)}
    buttons.appendChild(down)
    //adds all the buttons to the first playlist column
    playlistNew.appendChild(buttons)

    //create and adds the song name to the second column
    let songName = document.createElement("td")
    formatTable(songName)
    songName.innerHTML = song.trackName
    playlistNew.appendChild(songName)

    //create and adds the artist name to the third column
    let songArtist = document.createElement("td")
    formatTable(songArtist)
    songArtist.innerHTML = song.artistName
    playlistNew.appendChild(songArtist)

    //create and add the artist album cover to the last column
    let art = document.createElement("img")
    art.src = song.artworkUrl100

    let songAlbum = document.createElement("td")
    songAlbum.src = song.artworkUrl100
    songAlbum.appendChild(art)
    formatTable(art)
    playlistNew.appendChild(songAlbum)

    //create and adds the new content as a full new row
    playlistTable.appendChild(playlistNew)

    updateLocalStorage()
}

//removes a song from the playlist and updates the display
function removeFromPlaylist(song) {
    let playlistTable = document.getElementById("playlistArea")
    playlistTable.removeChild(song)

    updateLocalStorage();
}

//moves a song up or down in the playlist and updates the display
function moveSongInPlaylist(song, direction) {
    let playlistTable = document.getElementById("playlistArea")
    //gets all songs from the playlist div and keeps track of index to find the correct song swap
    let songsDiv = Array.from(playlistTable.children)
    let index = songsDiv.indexOf(song)

    //checks if the user is moving in a valid direction and performs the movement
    if (index > 0 && direction == 1) { 
        playlistTable.insertBefore(song, songsDiv[index - 1])
    } else if (direction == 0 && index < songsDiv.length - 1) { 
        playlistTable.insertBefore(songsDiv[index + 1], song)
    } else {
        return alert('You cannot move the song this way')
    }
    updateLocalStorage();
}