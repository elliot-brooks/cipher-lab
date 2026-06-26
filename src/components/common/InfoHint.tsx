import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import './InfoUi.css'

export type InfoHintProps = {
  title: string
  description: string
  onOpen: (title: string, description: string) => void
}

export default function InfoHint({ title, description, onOpen }: InfoHintProps) {
  return (
    <button className="info-hint" type="button" onClick={() => onOpen(title, description)}>
      <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
    </button>
  )
}
