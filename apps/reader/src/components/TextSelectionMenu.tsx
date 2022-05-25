import { useCallback, useEffect, useState } from 'react'
import { MdSearch } from 'react-icons/md'
import { VscSymbolVariable } from 'react-icons/vsc'
import { useSetRecoilState } from 'recoil'
import { useSnapshot } from 'valtio'

import { useTextSelection } from '../hooks'
import { ReaderTab } from '../models'
import { actionState } from '../state'

import { IconButton } from './Button'
import { reader } from './Reader'

interface TextSelectionMenuProps {
  tab: ReaderTab
}
export const TextSelectionMenu: React.FC<TextSelectionMenuProps> = ({
  tab,
}) => {
  const setAction = useSetRecoilState(actionState)
  const { rendition } = useSnapshot(tab)

  const view = rendition?.manager?.views._views[0]
  const el = view?.element as HTMLElement
  const { rect, textContent } = useTextSelection(view?.window)

  const [offsetLeft, setOffsetLeft] = useState(0)

  const handler = useCallback(() => {
    if (!el) return
    const containerLeft = el.parentElement!.getBoundingClientRect().left
    const viewLeft = el.getBoundingClientRect().left
    setOffsetLeft(viewLeft - containerLeft)
  }, [el])

  useEffect(() => {
    rendition?.on('relocated', handler)
  }, [handler, rendition])

  if (!rect || !textContent) return null

  return (
    <div
      className="bg-inverse-surface text-inverse-on-surface absolute flex gap-1 p-0.5"
      style={{ top: rect.top - 40, left: rect.left + offsetLeft }}
    >
      <IconButton
        Icon={MdSearch}
        size={20}
        onClick={() => {
          setAction('Search')
          reader.focusedTab?.setKeyword(textContent)
        }}
      />
      <IconButton
        Icon={VscSymbolVariable}
        size={20}
        onClick={() => {
          reader.focusedTab?.addDefinition(textContent)
        }}
      />
    </div>
  )
}