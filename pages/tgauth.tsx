import { Button, Center } from "@chakra-ui/react"
import { useRouter } from "next/router"
import Script from "next/script"
//import { TelegramLogo } from "phosphor-react"

type WindowTelegram = {
  Login: {
    auth: (
      options: {
        bot_id: string
        request_access?: string
        lang?: string
      },
      callback: (
        dataOrFalse:
          | {
              auth_date: number
              first_name: string
              hash: string
              id: number
              last_name: string
              username: string
            }
          | false
      ) => void
    ) => void
  }
}

const TGAuth = () => {
  const router = useRouter()


  const auth = () =>
    new Promise<boolean>((resolve, reject) => {
      try {
        const windowTelegram = (
          window as Window & typeof globalThis & { Telegram: WindowTelegram }
        )?.Telegram
        const telegramAuth = windowTelegram.Login?.auth
        if (typeof telegramAuth !== "function") {
          reject("Telegram login widget error.")
        }

        telegramAuth(
          {
            bot_id: "5618179168:AAFwdz9dnHcraocka0D2iE3dRF_FHFUhacc",
            lang: "en",
            request_access: "write",
          },
          (data) => {
            if (data === false) {
              window.opener?.postMessage(
                {
                  type: "TG_AUTH_ERROR",
                  data: {
                    error: "Authentication error",
                    errorDescription:
                      "Something went wrong with Telegram authentication, please try again",
                  },
                },
                router.query.openerOrigin
              )
              reject()
            } else {
              //console.info("tgauth data:",data)
              window.opener?.postMessage(
                {
                  type: "TG_AUTH_SUCCESS",
                  data,
                },
                router.query.openerOrigin
              )
              resolve(true)
            }
          }
        )
      } catch (tgAuthErr) {
        window.opener.postMessage(
          {
            type: "TG_AUTH_ERROR",
            data: {
              error: "Error",
              errorDescription: "Telegram auth widget error.",
            },
          },
          router.query.openerOrigin
        )
        reject()
      }
    })


  return (
    <Center h="100vh">
     <script async src="https://telegram.org/js/telegram-widget.js?21" data-telegram-login="GroupNFTBOT" data-size="large" data-auth-url="http://localhost:5001/aaa"></script>
      <div
        //colorScheme={"telegram"}
        //leftIcon={<TelegramLogo />}
        //borderRadius="full"
        //isLoading={isLoading}
        //loadingText="Authenticate in the Telegram window"
        onClick={auth}
      >
        Log in with Telegram
      </div>
    </Center>
  )
}
export default TGAuth
