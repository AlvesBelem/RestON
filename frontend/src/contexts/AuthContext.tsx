import { createContext, ReactNode, useState } from 'react';


type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (Credentials: SignInProps) => Promise<void>;
}

type UserProps = {
    id: string;
    name: string;
    email: string;
}

type SignInProps = {
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {

    // recrbendo id, name, email no contexto
    const [user, setUser] = useState<UserProps>()

    // verificando se está logado ou não os !! converte variavel em boolean
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps) {
        console.log("Dados para logar", email)
        console.log("Senha", password)
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}