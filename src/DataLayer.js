import React, { createContext, useContext, useReducer } from "react";

//create context
export const DataLayerContext = createContext();


export const DataLayer = ({ initialState, reducer, children }) => (
  
  //The value that our context has is returned from the reducer, which is set up using our reducer function and inital state
  <DataLayerContext.Provider value={useReducer(reducer, initialState)}>
    {/* {Children} is used to render content that is between this component */}
    {children}
  </DataLayerContext.Provider>
);


//make the context avaliable to everyone
export const useDataLayerValue = () => useContext(DataLayerContext);