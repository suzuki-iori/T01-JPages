import React, { useState } from 'react'

export default function useSetSidebar() {

    const [checkbool,setCheckbool] = useState(true);

    const toggleSidebar = () => {
      setCheckbool (prevState => !prevState)
    }
  return {checkbool,toggleSidebar}
}
