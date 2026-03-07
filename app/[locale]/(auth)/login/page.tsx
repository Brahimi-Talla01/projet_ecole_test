import { useTranslations } from "next-intl";

export default function LoginPage() {

      const t = useTranslations('authentication.login');

      return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-linear-to-b from-gray-50 to-gray-100">
                  <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        SuperApp
                  </h1>
                  <h1 className="text-xl text-[#E86E27] mb-8">
                        {t('title')}
                  </h1>

                  <h1>{t('subtitle')}</h1>
            </div>
      )
}
