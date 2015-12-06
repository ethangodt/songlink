export default function results(results = [], action) {
  switch (action.type) {
    case 'UPDATE_RESULTS':
      return action.results
    case 'CLEAR_RESULTS':
      return []
    default: 
      return results
  }
}
