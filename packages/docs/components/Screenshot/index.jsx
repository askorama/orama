import Image from 'next/image'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

export function Screenshot({ src, alt }) {
  return (
    <Zoom>
      <Image src={src} width={1280} height={720} alt={alt} className='nx-rounded-md nx-my-8 nx-border nx-border-neutral-200' />
    </Zoom>
  )
}