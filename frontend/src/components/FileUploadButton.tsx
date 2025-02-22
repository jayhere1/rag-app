import { UnstyledButton, Group } from '@mantine/core'
import { IconUpload } from '@tabler/icons-react'

interface FileUploadButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function FileUploadButton({ onClick, disabled }: FileUploadButtonProps) {
  return (
    <UnstyledButton
      style={{ 
        color: disabled ? '#666' : '#2C2E33',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.7 : 1
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <Group gap={4}>
        <IconUpload size={20} />
        <span>Manage file uploads</span>
      </Group>
    </UnstyledButton>
  )
}
