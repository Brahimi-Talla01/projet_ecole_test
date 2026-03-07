import { getTranslations } from 'next-intl/server';
import { Link } from '@/core/i18n/navigation';
import { LanguageSwitcher } from '@/core/ui/molecules/Dropdown';

export default async function HomePage() {
      const t = await getTranslations('common'); 

      return (
            <div className="min-h-screen flex flex-col bg-linear-to-b from-gray-50 to-gray-100">
                  {/* Barre de Navigation */}
                  <nav className="w-full py-4 px-8 flex justify-end items-center border-b border-gray-100 bg-white/50 backdrop-blur-md">
                        <LanguageSwitcher />
                  </nav>

                  {/* Contenu Principal */}
                  <div className="flex-1 flex flex-col items-center justify-center p-8">
                        <div className="max-w-2xl w-full text-center">
                              <h1 className="text-5xl font-bold text-gray-900 mb-4">
                                    SuperApp
                              </h1>
                              
                              <p className="text-xl text-[#E86E27] mb-8">
                                    {t('welcome')}
                              </p>

                              <div className="flex gap-4 justify-center mb-12">
                                    <Link
                                          href="/login"
                                          className="border-2 border-[#E86E27] text-[#2D6A36] px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                                    >
                                          {t('login')}
                                    </Link>
                                    <Link
                                          href="/register"
                                          className="border-2 border-[#E86E27] text-[#2D6A36] px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                                    >
                                          {t('register')}
                                    </Link>
                              </div>
                        </div>
                  </div>
            </div>
      );
}