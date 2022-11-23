import Head from 'next/head'
import { canSSRAuth } from "../../utils/canSSRAuth"
import { Header } from '../../components/Header'



export default function Dashboard() {
    return (
        <>
            <Head>
                <title>Painel - RestOn</title>
            </Head>
            <div>
                <Header />
                <h1>Bem vindo ao dashboard</h1>
            </div>
        </>
    )
}

// funcao para deicar somente usuarios logados acessar a pagina
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
});