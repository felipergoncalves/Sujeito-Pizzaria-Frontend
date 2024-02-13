import { FormEvent, useContext, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/home.module.scss'
import Image from 'next/image'
import logoImg from "../../public/logo.svg"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { AuthContext } from '@/contexts/AuthContext'
import { toast } from 'react-toastify'
import { canSSRGuest } from '@/utils/canSSRGuest'

export default function Home() {
  
  const { signIn } = useContext(AuthContext)

  const[email, setEmail] = useState('')
  const[password, setPassword] = useState('')
  const[loading, setLoading] = useState(false)

  async function handleLogin(event: FormEvent){
    event.preventDefault()

    if(email === '' || password === ''){
      toast.warning("Preencha todos os campos!")
      return;
    }

    setLoading(true);

    let data = {
      email,
      password
    }

    await signIn(data)

    setLoading(false)
  }
  return (
    <>
      <Head>
        <title>Sujeito Pizza - Faça seu login</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} alt='Logo Sujeito Pizzaria'/>
        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder='Digite seu e-mail'
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder='Digite sua senha'
              type='password'
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

          <span className={styles.text}>
            Não possui uma conta?
            <Link href="/signup" legacyBehavior>
              <a className="">Cadastre-se</a>
            </Link>
          </span>
        </div>
      </div>
    </>
  )
}

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   console.log("Testando server side props")
  
//   return{
//     props: {}
//   }
// }

export const getServerSideProps = canSSRGuest(async(ctx) =>{
  return{
    props: {}
  }
})