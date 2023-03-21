import { OramaLogo } from './OramaLogo.js'

export type FooterTranslations = Partial<{
  selectText: string
  selectKeyAriaLabel: string
  navigateText: string
  navigateUpKeyAriaLabel: string
  navigateDownKeyAriaLabel: string
  closeText: string
  closeKeyAriaLabel: string
  searchByText: string
}>

type FooterProps = Partial<{
  translations: FooterTranslations
}>

interface CommandIconProps {
  children: React.ReactNode
  ariaLabel: string
}

function CommandIcon(props: CommandIconProps): JSX.Element {
  return (
    <svg width="15" height="15" aria-label={props.ariaLabel} role="img">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2">
        {props.children}
      </g>
    </svg>
  )
}

export function Footer({ translations = {} }: FooterProps): JSX.Element {
  const {
    selectText = 'to select',
    selectKeyAriaLabel = 'Enter key',
    navigateText = 'to navigate',
    navigateUpKeyAriaLabel = 'Arrow up',
    navigateDownKeyAriaLabel = 'Arrow down',
    closeText = 'to close',
    closeKeyAriaLabel = 'Escape key',
    searchByText = 'Search by'
  } = translations

  return (
    <footer className="aa-Footer">
      <ul className="aa-FooterCommands">
        <li>
          <kbd>
            <CommandIcon ariaLabel={selectKeyAriaLabel}>
              <path d="M12 3.53088v3c0 1-1 2-2 2H4M7 11.53088l-3-3 3-3" />
            </CommandIcon>
          </kbd>
          <span>{selectText}</span>
        </li>
        <li>
          <kbd>
            <CommandIcon ariaLabel={navigateDownKeyAriaLabel}>
              <path d="M7.5 3.5v8M10.5 8.5l-3 3-3-3" />
            </CommandIcon>
          </kbd>
          <kbd>
            <CommandIcon ariaLabel={navigateUpKeyAriaLabel}>
              <path d="M7.5 11.5v-8M10.5 6.5l-3-3-3 3" />
            </CommandIcon>
          </kbd>
          <span>{navigateText}</span>
        </li>
        <li>
          <kbd>
            <CommandIcon ariaLabel={closeKeyAriaLabel}>
              <path d="M13.6167 8.936c-.1065.3583-.6883.962-1.4875.962-.7993 0-1.653-.9165-1.653-2.1258v-.5678c0-1.2548.7896-2.1016 1.653-2.1016.8634 0 1.3601.4778 1.4875 1.0724M9 6c-.1352-.4735-.7506-.9219-1.46-.8972-.7092.0246-1.344.57-1.344 1.2166s.4198.8812 1.3445.9805C8.465 7.3992 8.968 7.9337 9 8.5c.032.5663-.454 1.398-1.4595 1.398C6.6593 9.898 6 9 5.963 8.4851m-1.4748.5368c-.2635.5941-.8099.876-1.5443.876s-1.7073-.6248-1.7073-2.204v-.4603c0-1.0416.721-2.131 1.7073-2.131.9864 0 1.6425 1.031 1.5443 2.2492h-2.956" />
            </CommandIcon>
          </kbd>
          <span>{closeText}</span>
        </li>
      </ul>
      <a className="aa-FooterSearchCredit" href={'http://oramajs.io'} target="_blank" rel="noopener noreferrer">
        <span>{searchByText}</span>
        <OramaLogo />
      </a>
    </footer>
  )
}
