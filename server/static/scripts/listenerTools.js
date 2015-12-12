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
}

var providerClick = function (provider, providerUrl) {
  if (!docCookies.hasItem('providerPreference')) {
    $('.mini.'+provider).addClass('highlighted');
    modalSelection.preference = provider;

    modalSelection.originalUrl = providerUrl;

    $('.mini.special.save').addClass('highlighted2');

    $('.modalEnvironment').css('display','inline');
  } else {
    window.location = providerUrl;
  }
}

var modalSelection = {
  click : function (provider, element) {
    if (provider === this.preference) {
      this.preference = 'none';
      $('.mini.'+provider).removeClass('highlighted');
      $('.mini.special.save').addClass('disabled');
    } else {
      this.preference = provider;
      $('.mini').removeClass('highlighted');
      $('.mini.special.save').removeClass('disabled');
      $('.mini.'+provider).addClass('highlighted');
    }
  },
  preference : 'none',
  originalUrl : undefined
}

var preferenceSave = function (provider) {
  if (provider === 'none') {
    return;
  }
  docCookies.setItem('providerPreference', provider, Infinity);
  $('.modalEnvironment').css('display','none');
  document.location.reload(true);
}

var preferenceSkip = function () {
  docCookies.setItem('providerPreference', 'none', Infinity);
  $('.modalEnvironment').css('display','none');
  if (!modalSelection.originalUrl) {
    document.location.reload(true);
  } else {
    window.location = modalSelection.originalUrl;
    modalSelection.originalUrl = undefined;
  }
}



