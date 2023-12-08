import { Dispatch, ReactNode, SetStateAction, createContext, useState } from "react";
import { UserApp } from "../utils/types/user";

export type UsersContextType = {
    currentUserContext: UserApp | undefined;
    setCurrentUserContext: Dispatch <SetStateAction<UserApp | undefined>>;
};

const UsersContext = createContext<UsersContextType | undefined>(undefined);

const UserProvider = ({ children }: { children: ReactNode }) => {
    const [currentUserContext, setCurrentUserContext] = useState<UserApp | undefined>(undefined);
    return (
        <UsersContext.Provider
            value={{ currentUserContext, setCurrentUserContext }}>
            {children}
        </UsersContext.Provider>
    );
};
 export {UsersContext, UserProvider};