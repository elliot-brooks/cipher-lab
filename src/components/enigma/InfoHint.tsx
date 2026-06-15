type InfoHintProps = {
  text: string
}

export default function InfoHint({ text }: InfoHintProps) {
  return (
    <button className="info-hint" type="button" aria-label={text} title={text}>
      i
    </button>
  )
}