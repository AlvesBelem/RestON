import { createContext, ReactNode, useState } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { api } from '../services/apiClient'


type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (Credentials: SignInProps) => Promise<void>;
    signOut: () => void;
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

// funcao para deslogar usuario
export function signOut() {
    try {
        destroyCookie(undefined, '@nextauth.token');
        Router.push('/');
    } catch (error) {
        console.log('Erro ao deslogar');
    }
}


export function AuthProvider({ children }: AuthProviderProps) {

    // recrbendo id, name, email no contexto
    const [user, setUser] = useState<UserProps>()

    // verificando se está logado ou não os !! converte variavel em boolean
    const isAuthenticated = !!user;

    async function signIn({ email, password }: SignInProps) {
        try {
            // fazendo login
            const response = await api.post('/session', {
                email,
                password
            });

            // console.log(response.data);

            const { id, name, token } = response.data;

            // montando cookies com o token do usuario logado
            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, // expira em 1 mes
                path: "/" // quias caminhos terao acesso ao cookies no caso a barra seriam todos
            });

            // passando as informaçoes do usuario logado
            setUser({
                id,
                name,
                email,
            })

            // passar para proximas requisiçoes o token
            api.defaults.headers['Authorization'] = `Bearer ${token}`

            // redirecionar o user para a pagina /dashboard
            Router.push('/dashboard');

        } catch (err) {
            console.log('Error ao acessar', err);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}