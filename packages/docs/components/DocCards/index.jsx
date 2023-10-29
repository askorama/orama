import Link from 'next/link'
import clx from 'classnames'
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

export function DocCards () {
  return (
    <div className='relative flex w-full'>
      {docs.map((doc, index) => (
        <Link href={doc.link} key={index}>
          <div
            className={clx('flex flex-col w-72 h-48 p-6 border border-zinc-800 rounded-md transition-all ease-linear hover:shadow-xl hover:border-zinc-600', {
              'mr-8': index === 0,
              'ml-8': index === 1,
            })}
            style={{
              background: index === 0 ? 'radial-gradient(77.55% 79.46% at 5.73% 0%, #6A6279 0%, rgba(16, 17, 17, 0.00) 100%)' : 'radial-gradient(77.55% 79.46% at 5.73% 0%, #4C3088 0%, rgba(16, 17, 17, 0.00) 100%)',
            }}
          >
            <h2 className='font-bold text-m text-zinc-200'>
              {doc.name}
            </h2>
            <p className='text-xs text-zinc-300 mt-1'>
              {doc.description}
            </p>

            <div className='flex justify-center relative w-full'>
              <div className='transform translate-y-12'>
                <BsArrowRightShort className='text-zinc-500 w-8 h-8' />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}