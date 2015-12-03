var actions = {

  search: function (text) {
    return {
      type: 'SEARCH',
      text: text
    };
  }

};

module.exports = actions;
