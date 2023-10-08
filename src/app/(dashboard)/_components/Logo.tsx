import Image from 'next/image'

const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-10 w-10">
        <Image src="/logo.svg" alt="Logo" fill priority />
      </div>
      <p className="font-bold text-sky-700">serene.</p>
    </div>
  )
}

export default Logo
