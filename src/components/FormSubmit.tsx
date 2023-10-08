import { Loader2 } from 'lucide-react'

import { Button } from './ui/button'

type FormSubmitProps = {
  isValid: boolean
  isLoading: boolean
  isEditing?: boolean
}

const FormSubmit = ({
  isValid,
  isLoading,
  isEditing = false,
}: FormSubmitProps) => {
  return (
    <Button type="submit" disabled={!isValid || isLoading}>
      {isLoading ? (
        <div className="flex items-center gap-x-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Submitting...
        </div>
      ) : (
        <>{isEditing ? 'Save' : 'Continue'}</>
      )}
    </Button>
  )
}

export default FormSubmit
