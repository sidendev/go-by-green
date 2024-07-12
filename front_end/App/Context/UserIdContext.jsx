import { createContext, useState } from "react";


export const UserIdContext = createContext();

export const UserIdProvider = (({ children }) => {
    const [userId, setUserId] = useState(null)

    return (
        <UserIdContext.Provider value={{ userId, setUserId }}>
            {children}
        </UserIdContext.Provider>
    )

})