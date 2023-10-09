'use client'

import dynamic from 'next/dynamic'
import { Ref, forwardRef, useMemo } from 'react'
import 'react-quill/dist/quill.snow.css'

type EditorProps = {
  onChange: (value: string) => void
  value: string
}

const Editor = forwardRef((props: EditorProps, ref: Ref<HTMLDivElement>) => {
  // Evitar erro de SSR
  const ReactQuill = useMemo(
    () =>
      dynamic(() => import('react-quill'), {
        ssr: false,
      }),
    [],
  )

  return (
    <div className="bg-white" ref={ref}>
      <ReactQuill theme="snow" value={props.value} onChange={props.onChange} />
    </div>
  )
})

Editor.displayName = 'Editor'

export default Editor
