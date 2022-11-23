import { createContext, ReactNode, useState } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router'
import { api } from '../services/apiClient'
import { toast } from 'react-toastify';


type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (Credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
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

type SignUpProps = {
    name: string;
    email: string;
    password: string;
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

    // funcao de logar usuario
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

            //colocando alerta
            toast.success('Logado com sucesso');

            // redirecionar o user para a pagina /dashboard
            Router.push('/dashboard');

        } catch (err) {
            toast.error('Error ao acessar');
            console.log('Error ao acessar', err);
        }
    }

    // funcao para cadastrar usuario
    async function signUp({ name, email, password }: SignUpProps) {
        try {
            const response = await api.post('/users', {
                name,
                email,
                password
            })

            toast.success('Conta criada')

            Router.push('/');


        } catch (error) {
            toast.error('Error ao cadastrar');
            console.log("Error ao cadastrar", error);
        }
    }

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}