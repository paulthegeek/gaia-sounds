$(function() {
  getPlaylist()
});

function getPlaylist() {
  $.get('/playlist', (playlist) => {
    $('main').html(renderTrackContent(playlist))
  });
}

function renderTrackContent(playlist) {
  let countryHeader = $('<h3></h3>')
                        .attr({id: 'country-header'})
                        .text(`Listen to a sample of the top 3 songs from the ${playlist.name} playlist via Spotify`)
  
  let trackContainer = $('<div></div>')
    .attr({id: 'track-container'})
  
  let audioTracks = $('<div></div>')
    .attr({id: 'audio-tracks'})
  
  for(let track of playlist.tracks) {
    let trackContainer = $('<div></div>')
      .attr({id: track.track.name, class: 'track'})
    
    let trackCover = $('<img>')
      .attr({id: track.track.id, src: track.track.album.images[1].url, alt: `song titled ${track.track.name}`})
    
    let audio = $("<audio controls></audio>").attr({src: track.track.preview_url})
    
    trackContainer[0].innerHTML += trackCover[0].outerHTML  + audio[0].outerHTML
    audioTracks[0].innerHTML += trackContainer[0].outerHTML
  }
  
  return countryHeader[0].outerHTML + trackContainer[0].outerHTML + audioTracks[0].outerHTML
}
