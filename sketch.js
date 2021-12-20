
  function setup() {
    createCanvas(displayWidth, displayHeight);
  }

function draw(track, tempo, features) {
    background('#EDEDED');
    noStroke();
    fill('#1DB954')
    rect(0, 0, width, 90);
    textFont('Open Sans');
    textSize(32); 
    textAlign(LEFT, BASELINE);
    var minutes = Math.floor((track.duration_ms) / 60000);
    if (((track.duration_ms % 60000) / 1000).toFixed(0)<10){
        var seconds = "0"+(((track.duration_ms % 60000) / 1000).toFixed(0));
    }else{
        var seconds = ((track.duration_ms % 60000) / 1000).toFixed(0);
    }

    const acousticnessValue = features.acousticness.toFixed(1)*10;
    acousticnessCount='Acoustics: ';
    if (acousticnessValue>0){
        for (let i = 0; i < acousticnessValue; i++){
            acousticnessCount+='🎸';
        };
    }else{
        console.log('acousticnessValue:'+acousticnessValue)
        acousticnessCount='Acoustics: 🚫'
    };


    const danceabilityValue = features.danceability.toFixed(1)*10;
    danceabilityCount = 'Danceability: ';
    if (danceabilityValue>0){
        for (let i = 0; i < danceabilityValue; i++){
            danceabilityCount+='💃';
        };    
    }else{
        danceabilityCount='Danceability: 🚫'
    };

    const energyValue = features.energy.toFixed(1)*10;
    var energyCount = 'Energy: ';
    if (energyValue>0){
        for (let i = 0; i < energyValue; i++){
            energyCount+='⚡';
        };
    }else{
        energyCount='Energy: 🚫'
    };



    function songURL() {
        window.open(track.external_urls.spotify);
    }

    songLink = createButton('🎧Open in Spotify🎧');
    songLink.position(0, 800);
    songLink.size(width, 100);
    songLink.mouseClicked(songURL);
    songLink.style('background-color', 'pink')
    songLink.style('font-size', '25px');

    
    fill('black')
    textFont('Open Sans');
    textSize(48);
    output = track.name+" by "+track.artists[0].name;
    text(output, 30, 60);

    fill('black')
    textFont('Open Sans');
    textSize(32);
    output = minutes+":"+seconds+" minutes long\n"+danceabilityCount+"\n"+acousticnessCount+"\n"+energyCount;
    text(output, 100, 150);

    var bpm = tempo.track.tempo
    var interval = 60000/bpm;
    console.log(interval)
    console.log(danceabilityValue)
    console.log(acousticnessValue)
    console.log(energyValue)



    
  }

const arrayOfSongs = [];
//MODULE 1: API Module
const APIController = (function() {
    
    const clientId = '7ca2882cea7d49a19229bca6be76cb11';
    const clientSecret = 'afbbb504f0274ff7bf7c7b7d0dbc58db';

    // private methods
    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/x-www-form-urlencoded', 
                'Authorization' : 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });

        const data = await result.json();
        return data.access_token;
        //we then feed the access token into the next function and use it to get genre
    }
    
    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?locale=en_US`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
        //we get a json with the genres from here
        //then feed a genre id into the next function

    }

    const _search = async (token, query) => {

        const result = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
        //we get a json with the genres from here
        //then feed a genre id into the next function

    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 9;
        
        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
        //this function gets playlists in a given genre
    }

    const _getTracks = async (token, tracksEndPoint) => {
        //tracksEndPoint is supplied by the playlists object we got in the last function
        //so you input tracksEndPoint for a particular playlist into this function
        const limit = 9;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.items;
        //so you input tracksEndPoint for a particular playlist
        //and you get json of items in the playlist
        
    }

    const _getTrack = async (token, trackEndPoint) => {
        //from the json of items (tracks) we got in the previous function, we get a trackEndPoint for each track.
        //that gets input here for the track we want 
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
        //this returns a json object for that specific track
    }

    const _audioAnalysis = async (token, trackID) => {
        //from the json of items (tracks) we got in the previous function, we get a trackEndPoint for each track.
        //that gets input here for the track we want 
        const result = await fetch(`https://api.spotify.com/v1/audio-analysis/${trackID}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
        //this returns a json object for that specific track
    }

    const _audioFeatures = async (token, trackID) => {
        //from the json of items (tracks) we got in the previous function, we get a trackEndPoint for each track.
        //that gets input here for the track we want 
        const result = await fetch(`https://api.spotify.com/v1/audio-features/${trackID}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data;
        //this returns a json object for that specific track
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        },
        getAudioAnalysis(token, trackID){
            return _audioAnalysis(token, trackID);
        },
        getAudioFeatures(token, trackID){
            return _audioFeatures(token, trackID);
        },
        search(token, query){
            return _search(token, query);
        }
    }
})();


//MODULE 2: UI Module
const UIController = (function() {

    //object to hold references to html selectors
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        buttonSubmit: '#submit',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        divAudioAnalysis: '#audio-analysis',
        divAudioFeatures: '#audio-features',

        searchBar: '#song-search'
    }

    //public methods that will be called in the next method
    return {

        //method to get input fields
        //input field object will return the actual html field
        //ATTACH EVENT LISTENERS TO THESE
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                songDetail: document.querySelector(DOMElements.divSongDetail),
                audioAnalysis: document.querySelector(DOMElements.divAudioAnalysis),
                audioFeatures: document.querySelector(DOMElements.divAudioFeatures),

                searchBar: document.querySelector(DOMElements.songSearch)


            }
        },

        // need methods to create select list option
        //ADDS OPTION TO 'GENRE SELECT' FIELD
        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
            //**could this not also be: genre.insertAdjacentHTML('beforeend', html);**
            //inserts the <option value="${value}">${text}</option> as the last child in the genre
            //so these are all the options in that dropdown.
            // text is the genre name, value is what is sent to the server

        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },

        // need method to create a track list group item 
        createTrack(id, name) {
            const html = `<li><a href="#"class="list-group-item-light" id="${id}">${name}</a></li>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },


        //public methods that will be called in the next method
        //basically clearing out the inner HTML for each search.
        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
            //so basically when you reset the genre, and call resetPlaylist, the track and details are reset
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
            //sets the token
            //value is the value of the token that we got way in the beginning
        },


        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
                //returns the token saved by storeToken function
            }
        },

        returningValues(){
            //return this.createTrackDetail;
            console.log(this.createTrackDetail().energy);
        }
    }

})();

//MODULE 3: UI Module + API Module
const APPController = (function(UICtrl, APICtrl) {
    //this is an IIFE or an immediately invoked function expression.
    //the function is invoked and then set to the value of AppController
    //because modules 1 and 2 are parameters, we have access to the public methods
    //aka the methods at the end of modules 1 and 2

    // Reference the input field 
    const DOMInputs = UICtrl.inputField();
    //from line 119, so this gives genre, playlist, tracks, submit, songDetail

    // get GENRE OPTIONS on page load
    const loadGenres = async () => {
        //get the token
        const token = await APICtrl.getToken();           
        //store the token onto the page
        UICtrl.storeToken(token);
        //get A LIST OF GENRES
        const genres = await APICtrl.getGenres(token);
        //populate our 'Select Genre' input field with options
        //for each genre in that list, run createGenre so that the name and id option is created
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    //add an event listener to the genre input field.
    //When it is changed, do the stuff inside the event listener.
    DOMInputs.genre.addEventListener('change', async () => {
        //reset the playlist
        UICtrl.resetPlaylist();

        //get the token that's stored on the page
        const token = UICtrl.getStoredToken().token;   

        // genreSelect is the genre the input field
        const genreSelect = UICtrl.inputField().genre;     

        //.options returns all the options in a dropdown
        // get the genreId associated with the selected genre above
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;   

        // ge the playlist based on a genre
        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);  

        // create a playlist list item for every playlist returned
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
        //playlist.forEach(p => console.log(p.name));


    });
 

    // create submit button click event listener
    DOMInputs.submit.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        // clear tracks
        UICtrl.resetTracks();
        //get the token
        const token = UICtrl.getStoredToken().token;        
        // get the playlist field
        const playlistSelect = UICtrl.inputField().playlist;
        // get track endpoint based on the selected playlist
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        // get the list of tracks
        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
        // create a track list item
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
            
    });


    // create song selection click event listener
    DOMInputs.tracks.addEventListener('click', async (e) => {
        // prevent page reset
        e.preventDefault();
        UICtrl.resetTrackDetail();
        // get the token
        const token = UICtrl.getStoredToken().token;
        // get the track endpoint
        const trackEndpoint = e.target.id;
        console.log(trackEndpoint);
        //get the track object
        const trackID = trackEndpoint.substr(-22,);
        const track = await APICtrl.getTrack(token, trackEndpoint);
        const tempo = await APICtrl.getAudioAnalysis(token, trackID);
        const features = await APICtrl.getAudioFeatures(token, trackID);
        const searchTracks = await APICtrl.search(token, trackID);

        const song_tempo = tempo.track.tempo

        const danceability = features.danceability;
        const acousticness = features.acousticness;
        const energy = features.energy;

        const framesPerSecond = song_tempo * 0.016666666666667;        
        feature1 = framesPerSecond;
        console.log(searchTracks)
        draw(track, tempo, features);
        // load the track details
        UICtrl.createTrackDetail(track.name, track.artists[0].name, song_tempo, danceability, acousticness, energy);  
    });

    return{
        init() {
            console.log('Start');
            loadGenres();
        },
    }
})(UIController, APIController);

APPController.init();



