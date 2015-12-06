export default function preference(preference = 'none', action) {
  switch (action.type) {
    case 'UPDATE_PREFERENCE':
      return action.preference
    default: 
      return preference
  }
}
