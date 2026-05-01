import { VENILABS_LOGO_MARK_URL } from '../constants/brandAssets'

/** Brand mark for the top bar; sized via `.logo-mark` / `.topbar-brand-mark .logo-mark`. */
export function VenilabsLogoMark({ className }) {
  return (
    <img
      className={className}
      src={VENILABS_LOGO_MARK_URL}
      alt=""
      width={768}
      height={768}
      decoding="async"
      draggable={false}
    />
  )
}
