import React from "react";

export const AuthContext = React.createContext();

const initialState = {
    isAuthenticated: false,
    isUserAuthenticated:false,
    accessToken: null,
    refreshToken: null,
    expiryTime:null,
    unableToReachBackend:false,
};



const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":{
        const accessToken = action.payload.accessToken;
        const expiresIn = action.payload.expiresIn;
        const expiryTime = Date.now() + parseInt(expiresIn)*1000; // time in seconds since epoch
        const refreshToken = action.payload.refreshToken;
        
        localStorage.setItem("USER_LOGIN", JSON.stringify({ accessToken, refreshToken,expiryTime}));

        return {
            ...state,
            isAuthenticated: true,
            isUserAuthenticated:true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiryTime:expiryTime,
          };
        }
    case "LOAD_LOGIN":{
        const { accessToken, refreshToken,expiryTime} = action.payload;
        const userIsAuthenticated = (typeof refreshToken !== 'undefined' && refreshToken !== null);
        return {
            ...state,
            isAuthenticated: true,
            isUserAuthenticated:userIsAuthenticated,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiryTime:expiryTime,
            };
        
    }
    case "DEFAULT_LOGIN":{
        console.log("doing DEFAULT_LOGIN")   
        const accessToken = action.payload.access_token;
        const expires_in = action.payload.expires_in;
        const expiryTime = Date.now() + parseInt(expires_in)*1000; // time in seconds since epoch
        
        localStorage.setItem("DEFAULT_LOGIN", JSON.stringify({accessToken,expiryTime}));
        console.log("DEFAULT LOGIN CALLED: stae val: ",state)
        return {
            ...state,
            isAuthenticated: true,
            isUserAuthenticated:false,
            accessToken: accessToken,
            expiryTime: expiryTime,
        };  
    }
    case "REFRESH":{
        const accessToken = action.payload.access_token;
        const expires_in = action.payload.expires_in;
        const expiryTime = Date.now() + parseInt(expires_in)*1000; // time in seconds since epoch
        const refreshToken = action.payload.refresh_token;
        
        localStorage.setItem("USER_LOGIN", JSON.stringify({ accessToken, refreshToken,expiryTime}));

        return {
            ...state,
            isAuthenticated: true,
            isUserAuthenticated:true,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiryTime:expiryTime,
          };
        
    }
    case "LOGOUT":
        {
      localStorage.clear();
      return {
        ...state,
        ...initialState
      };
    }
    case "NETWORK_ERROR":
        {
          console.log("recorded network error :(")
      return {
        ...state,
        unableToReachBackend:true,
      };
    }
    default:
      return state;
    
  }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState);
   
    return (
        <AuthContext.Provider
        value={{
          state,
          dispatch
        }}
      >
          {children}
        </AuthContext.Provider>
    );
  };