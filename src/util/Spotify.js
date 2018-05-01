const clientId = '<add your client id here!>';
//remove Spotify client id before uploading again to Git  
const redirectUri = "http://localhost:3000/";


let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken
    }

    const retrievedAccessToken = window.location.href.match(/access_token=([^&]*)/);
    const retrievedExpiresIn = window.location.href.match(/expires_in=([^&]*)/);
    if ( window.location.href.match(/access_token=([^&]*)/) && window.location.href.match(/expires_in=([^&]*)/) ) {   //step 80
            accessToken = retrievedAccessToken[1];
            const expiresIn = Number(retrievedExpiresIn[1]);
       window.setTimeout(() => accessToken = '', expiresIn * 1000);
       window.history.pushState('Access Token', null, '/');
       return accessToken;
     } else {
       window.location = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
     }


  },
  // step 84-88
   search(term) {

    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${accessToken}`}
      }).then(response => {
        return response.json();
       //throw new Error('Request failed!');
     //, networkError => console.log(networkError.message)
   }).then(jsonResponse => {
      if (!jsonResponse.tracks) {
       return [];
     }
     return jsonResponse.tracks.items.map(track => ({
       id: track.id,
       name: track.name,
       artist: track.artists[0].name,
       album: track.album.name,
       uri: track.uri
       }));
     })
  },
  //step 89-94
  savePlaylist(name, trackURIs) {
   if (!name || !trackURIs.length) {
     return;
   }

   const accessToken = Spotify.getAccessToken();
   const headers = {
     Authorization: `Bearer ${accessToken}`  };
   let userId;

   // step 1: a fetch GET to get users userId from the Spotify Web API
   return fetch('https://api.spotify.com/v1/me', {headers: headers} ).then(response => {
     if (response.ok) {
       return response.json();
     }
     throw new Error('Request failed!');
     }, networkError => console.log(networkError.message)
   ).then(jsonResponse => {
        userId = jsonResponse.id;
   // step 2: a fetch POST to create the new playlist
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: 'POST',
          body: JSON.stringify({name: name}),
          headers: headers
        }).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Request failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            const playlistID = jsonResponse.id;
            // step 3: a fetch post to add tracks to the playlist using the unique track identifiers
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
              method: 'POST',
              body: JSON.stringify({URIs: trackURIs}),
              headers: headers }).then(response => {
              if (response.ok) {
                return response.json();
                }

              //throw new Error('Request failed!');
            }, networkError => console.log(networkError.message)
            ).then(jsonResponse => {
            });
          });

        });

  }

};



export default Spotify;
