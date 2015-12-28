import React, { Component } from 'react'

class Promo extends Component {

  render() {
    return (
      <div className="promoContainer">
        <img className="album1" src="https://i.scdn.co/image/82a76ae7e9345261111aefd9b66b5dc59e1eb690" width="140px"/>
        <img className="album2" src="https://i.scdn.co/image/f4b70346a9ecdac98cd63cd0e07c0aa8381bc90d" width="160px"/>
        <img className="album3" src="https://i.scdn.co/image/5227b0dd98d2a435479a633a59b5028ed06fb4b4" width="170px"/>
        <img className="album4" src="https://i.scdn.co/image/04da6dfc1f5f45fdeba938a0cc71cf372524fd43" width="140px"/>
        <img className="album5" src="https://i.scdn.co/image/19d8730694d33cb588d78ab1bf5043ac5b8d8aec" width="120px"/>
        <img className="album6" src="https://i.scdn.co/image/f71517e8919892273de8d8677e42cdcf1b976aa7" width="140px"/>
        <div className="wrapper">
          <div className="blurb">
            <h3>Share with anyone.</h3>
            <p>Use songlinks to share your favorite songs with friends regardless of what service they’re subscribed to.</p>
          </div>
          <img id="songPageScreenshot" src="assets/songPageScreenshot.png" alt="" width="550px"/>
        </div>
      </div>
    )
  }

}

// parallax album logic
var albums;
var movementRates;

// the page must load before the DOM elements can be selected
window.addEventListener('load', function () {
  albums = document.querySelectorAll('.promoContainer > img');
  movementRates = [.3, .3, .5, .3, .2, .3];
});

window.addEventListener('scroll', function () {
  for (var i = 0; i < albums.length; i++) {
    var y = -1 * window.scrollY * movementRates[i];
    albums[i].style.transform = "translate(0px, " + y + "px)";
  }
});

export default Promo
