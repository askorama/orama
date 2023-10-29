import Link from 'next/link'
import clx from 'classnames'
import { useDark } from '../../hooks/useDark'
import { BsArrowRightShort } from 'react-icons/bs'

const docs = [
  {
    name: 'Open-Source Docs',
    description: 'Documentation for Orama\'s open-source projects',
    link: '/open-source'
  },
  {
    name: 'Orama Cloud Docs',
    description: 'Documentation and guides for Orama Cloud',
    link: '/cloud'
  }
]

const bgOSS = {
  dark: 'radial-gradient(77.55% 79.46% at 5.73% 0%, #6A6279 0%, rgba(16, 17, 17, 0.00) 100%)',
  light: 'radial-gradient(77.55% 79.46% at 5.73% 0%, #EBE8F0 0%, #FFF 100%)'
}

const bgCloud = {
  dark: 'radial-gradient(77.55% 79.46% at 5.73% 0%, #4C3088 0%, rgba(16, 17, 17, 0.00) 100%)',
  light: 'radial-gradient(77.55% 79.46% at 5.73% 0%, #D0A6F1 0%, rgba(255, 255, 255, 0.00) 100%)'
}

export function DocCards () {
  const isDark = useDark()

  return (
    <div className='relative flex flex-col md:flex-row w-full'>
      {docs.map((doc, index) => (
        <Link href={doc.link} key={index}>
          <div
            className={clx('flex flex-col w-72 md:h-48 h-38 p-6 border dark:border-zinc-800 border-zinc-200 rounded-md transition-all ease-linear hover:shadow-xl hover:border-zinc-600', {
              'md:mr-8': index === 0,
              'md:ml-8 mt-4 md:mt-0': index === 1,
            })}
            style={{
              background: index === 0 ? bgOSS[isDark ? 'dark' : 'light'] : bgCloud[isDark ? 'dark' : 'light']
            }}
          >
            <h2 className='font-bold text-m dark:text-zinc-200 text-zinc-900'>
              {doc.name}
            </h2>
            <p className={clx('text-xs dark:text-zinc-300 text-zinc-900 mt-1')}>
              {doc.description}
            </p>

            <div className='flex justify-center relative w-full'>
              <div className='transform md:translate-y-12 translate-y-4'>
                <BsArrowRightShort className='dark:text-zinc-500 text-zinc-400 w-8 h-8' />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}