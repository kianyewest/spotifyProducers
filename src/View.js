import React from 'react'
import { useRouteMatch } from 'react-router-dom';
import { useDataLayerValue } from "./DataLayer";

function View(props) {
    console.log("called?")
    const [state, dispatch] = useDataLayerValue();
    console.log("the state: ",state);
    console.log("propsps:",props);
    const match = useRouteMatch();
    console.log("match:",match);
    return (
        <div>
            why wont this whoe?
            {match.params.id}
        </div>
    )
}

export default View
