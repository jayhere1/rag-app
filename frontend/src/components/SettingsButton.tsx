import { UnstyledButton, Group } from '@mantine/core'
import { IconSettings } from '@tabler/icons-react'

interface SettingsButtonProps {
  onClick: () => void
  disabled?: boolean
}

export default function SettingsButton({ onClick, disabled }: SettingsButtonProps) {
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
        <IconSettings size={20} />
        <span>Developer settings</span>
      </Group>
    </UnstyledButton>
  )
}
