const initial = {
  link: false,
  preference: false,
  search: false
}

export default function loading(loading = initial, action) {
  switch (action.type) {
    case 'TOGGLE_LOADING_LINK':
      return Object.assign({}, loading, {
        link: action.isLoading,
        preference: loading.preference,
        search: loading.search
      })
    case 'TOGGLE_LOADING_PREFERENCE':
      return Object.assign({}, loading, {
        link: loading.link,
        preference: action.isLoading,
        search: loading.search
      })
    case 'TOGGLE_LOADING_SEARCH':
      return Object.assign({}, loading, {
        link: loading.link,
        preference: loading.preference,
        search: action.isLoading
      })
    default: 
      return loading
  }
}
