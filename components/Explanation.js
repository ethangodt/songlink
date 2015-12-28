import React, { Component } from 'react'

class Explanation extends Component {

  render() {
    return (
      <div className="explanationContainer">
        <p>Create shareable songlinks from:</p>
        <ul>
          <li className="unloaded"><span className="fa fa-search"></span>Search</li>
          <li className="unloaded"><span className="fa fa-spotify"></span>Spotify urls</li>
          <li className="unloaded"><span className="fa fa-apple"></span>Apple Music urls</li>
          <li className="unloaded"><span className="fa fa-youtube-play"></span>YouTube urls</li>
        </ul>
      </div>
    )
  }

}

var init = function () {
  var tips = document.querySelectorAll('.explanationContainer .unloaded');
  tips = Array.prototype.slice.call(tips);
  var className = 'unloaded';
  var loadTip = function(tip, count){
    if (tip.classList) {
      tip.classList.remove(className);
    } else {
      tip.className = tip.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }

    if (count < tips.length) {
      count++;
      setTimeout(function () {
        loadTip(tips[count - 1], count);
      }, 600);
    }
  };
  loadTip(tips[0], 1);
};

window.addEventListener('load', init);

export default Explanation
