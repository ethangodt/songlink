import React, { Component } from 'react'

class Promo extends Component {

  constructor(props, context) {
    super(props, context)
    this.state = {
      albums: [],
      movementRates: [.3, .3, .5, .3, .2, .3]
    }
  }

  componentDidMount() {
    this.setState({
      albums: document.querySelectorAll('.promoContainer > img')
    }, () => {
      window.addEventListener('scroll', () => {
        for (var i = 0; i < this.state.albums.length; i++) {
          var y = -1 * window.scrollY * this.state.movementRates[i];
          this.state.albums[i].style.transform = "translate(0px, " + y + "px)";
        }
      })
    })
  }

  render() {
    return (
      <div className="promoContainer">
        <img className="album1" src="https://i.scdn.co/image/82a76ae7e9345261111aefd9b66b5dc59e1eb690" width="140px"/>
        <img className="album2" src="https://i.scdn.co/image/f4b70346a9ecdac98cd63cd0e07c0aa8381bc90d" width="160px"/>
        <img className="album3" src="https://i.scdn.co/image/5227b0dd98d2a435479a633a59b5028ed06fb4b4" width="170px"/>
        <img className="album4" src="https://i.scdn.co/image/04da6dfc1f5f45fdeba938a0cc71cf372524fd43" width="140px"/>
        <img className="album5" src="https://i.scdn.co/image/5020a71a285a2063573d388167471c84678e3e71" width="120px"/>
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

export default Promo
