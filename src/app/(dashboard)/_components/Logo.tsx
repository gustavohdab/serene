import Image from 'next/image'

const Logo = () => {
  return (
    <div className="flex gap-2">
      <Image src="/logo.svg" alt="Logo" width={40} height={40} priority />
      <p className="font-bold text-sky-700">serene.</p>
    </div>
  )
}

export default Logo
