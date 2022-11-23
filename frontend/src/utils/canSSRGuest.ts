import {
  GetServerSideProps,
  GetServerSidePropsResult,
  GetServerSidePropsContext,
} from "next";
import { parseCookies } from "nookies";

// funcao para paginas que podem ser acessadas por visitantes (nao logado)

export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    // Seo o usuario acessar a pagina, porem se já etm um login salvo redirecionamos
    if (cookies["@nextauth.token"]) {
      return {
        redirect: {
          destination: "/dashboard",
          permanent: false,
        },
      };
    }

    return await fn(ctx);
  };
}
