'use client'

import { useToast } from './ui/use-toast'

import { ourFileRouter } from '@/app/api/uploadthing/core'
import { UploadDropzone } from '@/lib/uploadthing'

type FileUploadProps = {
  onChange: (url?: string) => void
  endpoint: keyof typeof ourFileRouter
}

const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const { toast } = useToast()
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        onChange(res?.[0].url)
      }}
      onUploadError={(error: Error) => {
        toast({
          title: 'Error uploading file',
          description: error?.message,
          variant: 'destructive',
          duration: 4000,
        })
      }}
    />
  )
}

export default FileUpload
