import React, { createContext, useState, ReactNode } from "react";

type ContextProps = {
  showPostInput: boolean;
  setShowPostInput: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Context = createContext<ContextProps>({
  showPostInput: false,
  setShowPostInput: () => {},
});

type ContextProviderProps = {
  children: ReactNode;
};

export const ContextProvider: React.FC<ContextProviderProps> = ({
  children,
}) => {
  const [showPostInput, setShowPostInput] = useState(false);

  return (
    <Context.Provider value={{ showPostInput, setShowPostInput }}>
      {children}
    </Context.Provider>
  );
};
