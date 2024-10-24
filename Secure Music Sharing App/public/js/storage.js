//load the local storage as soon as the window opens
window.addEventListener("load", function() {
    loadPlaylistFromStorage()
})

//calls adToPlaylist on all songs found in local storage
function loadPlaylistFromStorage() {
    let storage = localStorage.getItem("playlist")
    if (storage) {
        let playlist = JSON.parse(storage)
        playlist.forEach(song => {
            let row = createSongRowElement(song)
            addToPlaylist(row, song)
        })
    }
}

//formats all the songs in the local storage before adding to playlist (done twice to avoid format errors)
function createSongRowElement(song) {
    let playlistNew = document.createElement("tr")
    
    let buttons = document.createElement("td")
    formatTable(buttons)

    //remove button value and functionality
    let remove = document.createElement("button")
    remove.innerHTML = "➖"
    remove.onclick = function() {removeFromPlaylist(playlistNew)}
    buttons.appendChild(remove)

    //up button value and functionality
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
    songAlbum.appendChild(art)
    formatTable(art)
    playlistNew.appendChild(songAlbum)

    //return the playlist song with the appropriate formatting
    return playlistNew
}

//update the local storage whenever the user add, removes or moves a song
function updateLocalStorage() {
    //stores all playlist information
    let playlist = []
    //where the playlist will go after being loaded from local storage
    let playlistArea = document.getElementById("playlistArea")

    //process all songs found in local storage
    if (playlistArea && playlistArea.children.length > 0) {
        Array.from(playlistArea.children).forEach(row => {
            //create a song object and add that to the playlist array
            let song = {
                trackName: row.cells[1].innerText, 
                artistName: row.cells[2].innerText,
                artworkUrl100: row.cells[3].children[0].src
            }
            playlist.push(song)
        })
    }
    //add the new song to the local storage (array must be of string, otherwise it cannot be read)
    localStorage.setItem("playlist", JSON.stringify(playlist))
}

