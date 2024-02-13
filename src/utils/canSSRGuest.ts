import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies } from "nookies";

//função para páginas que só pode ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>){
    return async(ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        
        //Se o usuário já está logado e tenta acessar essa página, será redirecionado a dashboard
        const cookies = parseCookies(ctx);

        if(cookies['@nextauth.token']){
            return{
                redirect:{
                    destination: "/dashboard",
                    permanent: false,
                }
            }
        }

        return await fn(ctx);
    }   
}