import { UnstyledButton, Group } from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'

interface ClearChatButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function ClearChatButton({ onClick, disabled }: ClearChatButtonProps) {
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
        <IconTrash size={20} />
        <span>Clear chat</span>
      </Group>
    </UnstyledButton>
  )
}
