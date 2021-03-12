import React from 'react'
import { useDataLayerValue } from "./DataLayer";

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

