import { Download, X } from 'lucide-react'
import { useInstallPrompt } from '@/hooks/useInstallPrompt'

export function InstallBanner() {
  const { canInstall, install, dismiss } = useInstallPrompt()

  if (!canInstall) return null

  return (
    <div className="fixed right-4 bottom-20 left-4 z-50 flex items-center gap-3 rounded-xl border border-indigo-200 bg-white px-4 py-3 shadow-lg sm:right-auto sm:bottom-6 sm:left-6 sm:max-w-sm dark:border-indigo-800 dark:bg-gray-900">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600">
        <Download className="size-4 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          Установить приложение
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">Работает без интернета</p>
      </div>
      <button
        onClick={install}
        className="shrink-0 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-700"
      >
        Установить
      </button>
      <button
        onClick={dismiss}
        className="-mr-1 shrink-0 rounded-lg p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        aria-label="Закрыть"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}
