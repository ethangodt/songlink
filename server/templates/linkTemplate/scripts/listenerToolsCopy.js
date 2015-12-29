var docCookies = {
  getItem: function (sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    if (!sKey) { return false; }
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

var modalSelection = {
  click: function (provider) {
    if (provider !== this.preference) {
      $('.mini.' + this.preference).removeClass('highlighted');
      this.preference = provider;
      $('.mini.' + provider).addClass('highlighted');
    }
  },
  preference: 'none',
  originalUrl: undefined,
  originalPref : undefined
};

var providerClick = function (provider, providerUrl) {
  if (!docCookies.hasItem('providerPreference')) {
    $('.mini.' + provider).addClass('highlighted');
    modalSelection.preference = provider;
    modalSelection.originalUrl = providerUrl;
    modalSelection.originalPref = provider;
    $('.modalEnvironment').css('display', 'block');
    $('body > main').addClass('blur');
    // this setTimeout is because the transition was failing if the
    // modalEnvironment didn't change element to display block
    setTimeout(function() {
      $('.modalContainer').removeClass('unloaded');
    }, 10);
  } else {
    // FYI, this condition can occur when the users preference is 'none', or if the provider they prefer does not stream the song
    if (provider === 'youtube' || provider === 'itunes' || provider === 'deezer') {
      window.open(providerUrl, '_blank');
    } else {
      window.location.href = providerUrl;
    }

  }
};

var preferenceSave = function (provider) {
  docCookies.setItem('providerPreference', provider, 'Fri, 31 Dec 2030 23:59:59 GMT');
  $('.modalEnvironment').css('display', 'none');
  $('body > main').removeClass('blur');

  if (modalSelection.originalPref === 'youtube' || modalSelection.originalPref === 'itunes' || modalSelection.originalPref === 'deezer') {
    window.open(modalSelection.originalUrl, '_blank');
  } else {
    window.location.href = modalSelection.originalUrl;
  }
};



window.addEventListener('load', function () {
  var album = document.querySelector('.albumArt');
  var className = 'unloaded';
  if (album.classList) {
    album.classList.remove(className);
  } else {
    album.className = album.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
});
