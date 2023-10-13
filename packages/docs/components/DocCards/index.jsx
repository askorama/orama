import Link from 'next/link'
import clx from 'classnames'
import { BsArrowRightShort } from 'react-icons/bs'

const docs = [
  {
    name: 'Open-Source Docs',
    link: '/open-source'
  },
  {
    name: 'Orama Cloud Docs',
    link: '/cloud'
  }
]

export function DocCards () {
  return (
    <div className='relative flex w-full items-center justify-center'>
      {docs.map((doc, index) => (
        <Link href={doc.link} key={index}>
          <div
            className={clx('flex justify-center items-center w-52 h-52 rounded-md font-bold transition-all ease-linear border border-zinc-950 hover:border-zinc-500', {
              'mr-8': index === 0,
              'ml-8': index === 1
            })}
            style={{
              background: index === 0 ? 'radial-gradient(79.66% 119.74% at 0% 0%, #3E3551 0%, #131313 100%)' : 'radial-gradient(81.75% 141.42% at 0% 0%, #462670 0%, rgba(15, 15, 15, 0.00) 100%)',
            }}
          >
            {doc.name}

            <div className='absolute bottom-10'>
              <BsArrowRightShort className='text-zinc-100 w-8 h-4' />
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}