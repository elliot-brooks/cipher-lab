import { faCircleInfo, faEnvelope, faKey, faLock, faLockOpen, faPenNib, faRotate } from '@fortawesome/free-solid-svg-icons'

export const byPrefixAndName = {
  fas: {
    rotate: faRotate,
    'circle-info': faCircleInfo,
  },
} as const

export { faEnvelope, faKey, faLock, faLockOpen, faPenNib }
