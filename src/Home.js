import React from 'react'
import { useDataLayerValue } from "./DataLayer";
import { Link } from 'react-router-dom';

function Home({spotify}) {
    const [state, dispatch] = useDataLayerValue();
    console.log(state)
    return (
        <div>
            Welcome {state.user && state.user.display_name}
        </div>
    )
}


export default Home

