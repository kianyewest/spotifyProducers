export const initialState = {
    user: null,
    expiry:null,
    token: null,
    playlists: [],
    playing: false,
    item: null,
  };
  
  const reducer = (state, action) => {
  
    switch (action.type) {
      case "SET_USER":
        return {
          ...state,
          user: action.user,
        };
      case "SET_TOKEN":
        return {
          ...state,
          token: action.token,
          expiry: action.expiry,
        };
      case "SET_PLAYLISTS":
        return {
          ...state,
          playlists: action.playlists,
        };
      case "SET_DISCOVER_WEEKLY":
        return {
          ...state,
          discover_weekly: action.discover_weekly,
        };
      case "SET_EMPTY":
      return {
        initialState,
      };
      default:
        return state;
    }
  };
  
  export default reducer;