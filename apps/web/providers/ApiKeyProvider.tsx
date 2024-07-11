import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from 'react';


export const ApiKeyContext = createContext<{
  apiKey?: string;
  setApiKey: Dispatch<SetStateAction<string>>;
}>({
  apiKey: undefined,
  setApiKey: () => {
    // Do nothing
  },
});

export const ApiKeyContextProvider = ({
  children,
}: {
  children?: ReactNode;
}) => {
  const [apiKey, setApiKey] = useState<string>('');

  return (
    <ApiKeyContext.Provider
      value={{
        apiKey,
        setApiKey,
      }}
    >
      {children}
    </ApiKeyContext.Provider>
  );
};
