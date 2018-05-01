import React from 'react';
//import logo from './logo.svg';
import './App.css';

import PlayList from '../PlayList/PlayList';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Spotify from '../../util/Spotify';


class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      //{id: 1, name: 'Sweet Song', artist: 'Sweety', album: 'Sweets'},
      //  {id: 2, name: 'Sour Song', artist: 'Squary', album: 'Squered'},
      //  {id: 3, name: 'Salt Song', artist: 'Salty', album: 'Salted'}
      playlistName: 'Your New Coolest Playlist',
      playlistTracks: []
        //{id: 3, name: 'Salt Song', artist: 'Salty', album: 'Salted'},
        //{id: 2, name: 'Sour Song', artist: 'Squary', album: 'Squered'},
        //{id: 1, name: 'Sweet Song', artist: 'Sweety', album: 'Sweets'}

    };
    this.search = this.search.bind(this);

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);


  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    //checking if the track is already on playlist before adding to PlayList
    //solves Git issue #1
    if (tracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    }

    tracks.push(track);
    this.setState({playlistTracks: tracks});

  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'Your new coolest Playlist',
        playlistTracks: []
      });
    });
    console.log(`the Track URIs: ${trackURIs}`);
    console.log(`Playlist is saved`);
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults});
    });
    console.log(term);
  }

  render() {

    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                           onAdd={this.addTrack}
                           />

            <PlayList playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName}
                      onSave={this.savePlaylist}
                      />

          </div>
        </div>
      </div>
    );
  }
}

export default App;
