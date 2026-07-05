'use client'

import { useEffect, useState } from 'react'

type Tab = { name: string; id: string }

export default function MenuTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '')

  useEffect(() => {
    const sections = tabs
      .map((t) => document.getElementById(t.id))
      .filter((el): el is HTMLElement => el !== null)
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -55% 0px', threshold: 0 }
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [tabs])

  function handleClick(e: React.MouseEvent, id: string) {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top, behavior: 'smooth' })
    }
    setActive(id)
  }

  return (
    <div className="sticky top-16 z-20 -mx-4 sm:-mx-6 bg-white border-b border-gray-100">
      <div className="flex gap-1 overflow-x-auto px-4 sm:px-6">
        {tabs.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            onClick={(e) => handleClick(e, t.id)}
            className={`shrink-0 whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
              active === t.id
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {t.name}
          </a>
        ))}
      </div>
    </div>
  )
}
