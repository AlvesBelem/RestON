import { canSSRAuth } from "../../utils/canSSRAuth"



export default function Dashboard() {
    return (
        <div>
            <h1>Bem vindo ao dashboard</h1>
        </div>
    )
}

// funcao para deicar somente usuarios logados acessar a pagina
export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {}
    }
});