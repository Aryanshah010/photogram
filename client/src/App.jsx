import React, { useState } from 'react'

function App() {
  var [a,b]=useState(0);
  return (
    <div className="w-full h-screen bg-zinc-900 text-white p-5">
      <h1>{a}</h1>
      <button onClick={()=>b(a+1)} className='px-3 py-1 bg-red-500 rounded-md text-xs' >Click me</button>
    </div>
  )
}

export default App;