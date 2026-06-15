import { useEffect, useId } from 'react'

import './InfoUi.css'

export type InfoModalProps = {
  isOpen: boolean
  title: string
  description: string
  onClose: () => void
}

export default function InfoModal({ isOpen, title, description, onClose }: InfoModalProps) {
  const titleId = useId()

  const blocks = description
    .split('\n\n')
    .map((block) => block.trim())
    .filter((block) => block.length > 0)

  useEffect(() => {
    if (!isOpen) {
      return undefined
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div className="info-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="info-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="info-modal-header">
          <h3 id={titleId}>{title}</h3>
          <button className="info-modal-close-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="info-modal-body">
          {blocks.map((block, index) => {
            const lines = block.split('\n').map((line) => line.trim())
            const hasBullets = lines.some((line) => line.startsWith('- '))

            if (!hasBullets) {
              return <p key={index}>{block}</p>
            }

            const heading = !lines[0].startsWith('- ') ? lines[0] : null
            const bulletLines = lines
              .slice(heading ? 1 : 0)
              .filter((line) => line.startsWith('- '))
              .map((line) => line.slice(2).trim())

            return (
              <div className="info-modal-section" key={index}>
                {heading ? <h4>{heading}</h4> : null}
                <ul>
                  {bulletLines.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
