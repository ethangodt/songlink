export default function links(links = [], action) {
  switch (action.type) {
    case 'ADD_LINK':
      return [action.link, ...links]
    default: 
      return links
  }
}
