import { useState } from  "react";

function TestCounter(){
    const [count,setCount]=useState(0);
    return (
        <div>

            <h2>Counter</h2>
            <p>{count}</p>
            <button onClick={()=>{setCount(count+1);}}>Click Me</button>
        </div>
    );
}
export default TestCounter;

