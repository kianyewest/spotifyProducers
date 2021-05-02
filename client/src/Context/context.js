import React from "react";

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  isUserAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  expiryTime: null,
  tokenValidLength: 0,
  unableToReachBackend: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      const accessToken = action.payload.accessToken;
      const tokenValidLength = action.payload.expiresIn;
      const expiryTime = Date.now() + parseInt(tokenValidLength) * 1000 - 60000; // time in seconds since epoch
      const refreshToken = action.payload.refreshToken;
      localStorage.setItem(
        "USER_LOGIN",
        JSON.stringify({
          accessToken,
          refreshToken,
          expiryTime,
          tokenValidLength
        })
      );

      return {
        ...state,
        isAuthenticated: true,
        isUserAuthenticated: true,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiryTime: expiryTime,
        tokenValidLength: tokenValidLength,
      };
    }

    case "DEFAULT_LOGIN": {
      const accessToken = action.payload.access_token;
      const tokenValidLength = action.payload.expires_in;
      const expiryTime = Date.now() + parseInt(tokenValidLength) * 1000 - 60000; // time in seconds since epoch

      localStorage.setItem(
        "DEFAULT_LOGIN",
        JSON.stringify({ accessToken, expiryTime, tokenValidLength })
      );

      return {
        ...state,
        isAuthenticated: true,
        isUserAuthenticated: false,
        accessToken: accessToken,
        expiryTime: expiryTime,
        tokenValidLength: tokenValidLength,
      };
    }

    case "LOAD_LOGIN": {
      const {
        accessToken,
        refreshToken,
        expiryTime,
        tokenValidLength,
      } = action.payload;
      const userIsAuthenticated =
        typeof refreshToken !== "undefined" && refreshToken !== null;

      return {
        ...state,
        isAuthenticated: true,
        isUserAuthenticated: userIsAuthenticated,
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiryTime: expiryTime,
        tokenValidLength,
        tokenValidLength,
      };
    }

    case "REFRESH": {
      const accessToken = action.payload.access_token;
      const expiryTime =
        Date.now() + parseInt(state.tokenValidLength) * 1000 - 60000; // time in seconds since epoch
      localStorage.setItem(
        "USER_LOGIN",
        JSON.stringify({
          accessToken,
          refreshToken: state.refreshToken,
          expiryTime,
          tokenValidLength:state.tokenValidLength
        })
      );

      return {
        ...state,
        isAuthenticated: true,
        isUserAuthenticated: true,
        accessToken: accessToken,
        expiryTime: expiryTime,
      };
    }
    case "LOGOUT": {
      localStorage.clear();
      return {
        ...state,
        ...initialState,
      };
    }
    case "NETWORK_ERROR": {
      console.log("recorded network error :(");
      return {
        ...state,
        unableToReachBackend: true,
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
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
