import React from 'react'
import { useDataLayerValue } from "./DataLayer";

function Home({spotify}) {
    const [state, dispatch] = useDataLayerValue();
    
    return (
        <div>
            Welcome {state.user && state.user.display_name}
        </div>
    )
}


export default Home

