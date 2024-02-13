import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from "@/services/errors/AuthTokenError";

/*Pegar o cookie para ver se tem usuário logado ou não e se não tiver um cookie, então o usuário não 
está logado, não podendo acessar certas páginas. Então eu destruo o cookie e
redireciono o usuário para o login*/

//função para página que só users logados podem acessar
export function canSSRAuth<P>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext):Promise<GetServerSidePropsResult<P>> => {
        //pegando cookie
        const cookies = parseCookies(ctx);
        //pegando o token
        const token = cookies["@nextauth.token"]

        //se não tiver um token, redireciono para a tela de login
        if(!token){
            return{
                redirect:{
                    destination: "/",
                    permanent: false,
                }
            }
        }
        //Se tiver um token, mas por acaso deu algum erro eu destruo o cookie e redireciono para o login
        try{
            return await fn(ctx);
        }catch(err){
            if(err instanceof AuthTokenError){
                destroyCookie(ctx, '@nextauth.token');
                return {
                    redirect:{
                        destination: "/",
                        permanent: false,
                    }
                }
            }
        }
    }
}