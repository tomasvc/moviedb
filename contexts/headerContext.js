import React, { useState, useEffect, createContext, useContext } from 'react'

const HeaderContext = createContext({
    open: false,
    setOpen: () => {},
});

const HeaderProvider = ({children}) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        setOpen(false);
    }, []);

    return (
        <HeaderContext.Provider  value={{ open, setOpen }}>
            {children}
        </HeaderContext.Provider>
    )
}

export const useHeaderContext = () => {
    return useContext(HeaderContext)
}

export { HeaderProvider }