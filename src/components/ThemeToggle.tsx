import { useTheme } from "@/hooks/useTheme"

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
    >
      {theme === "dark" ? "🌙 Тёмная" : "☀️ Светлая"}
    </button>
  )
}
