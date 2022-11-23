
import { useContext, FormEvent, useState } from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/home.module.scss'

import logoImg from '../../public/RestOn_branco.png'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import { AuthContext } from '../contexts/AuthContext'
import { toast } from 'react-toastify';
import Link from 'next/link'
import { canSSRGuest } from '../utils/canSSRGuest'



export default function Home() {

  // testando contexto
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if (email === '' || password === '') {
      toast.warning('Informe todos os campos');
      return;
    }

    // fazendo loading enquanto faz a requisiçao
    setLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>RestOn - Login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image className={styles.logo} src={logoImg} alt="Logo RestOn" />

        <div className={styles.login}>
          <h1>Faça seu login</h1>

          <form onSubmit={handleLogin}>
            <Input
              placeholder='Digite seu email'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder='Digite sua senha'
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>

          </form>

          <Link className={styles.text} href="/signup">Não possui uma conta? Cadastre-se...</Link>


        </div>
      </div>
    </>

  )
}

// criando estrutura de server - side para rotas que podem sert acessadas por usuarios nao alogados /utils/canSSRGuest

export const getServerSideProps = canSSRGuest(async (ctx) => {
  return {
    props: {}
  }
})
