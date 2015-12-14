export default function links(links = [], action) {
  switch (action.type) {
    case 'ADD_LINK':
      return [action.link, ...links]
    default: 
      return links
  }
}

// [{url: 'http://localhost:3000/34fa4', artist: 'Jack White', title: 'Lazaretto'}]
