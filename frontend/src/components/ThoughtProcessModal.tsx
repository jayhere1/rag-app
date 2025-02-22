import { Modal, Text } from '@mantine/core'
import ThoughtProcess from './ThoughtProcess'

interface ThoughtProcessModalProps {
  opened: boolean
  onClose: () => void
  thoughts: string[]
}

export default function ThoughtProcessModal({
  opened,
  onClose,
  thoughts
}: ThoughtProcessModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Thought Process"
      size="lg"
      styles={{
        header: {
          backgroundColor: '#25294A',
          borderBottom: '1px solid #2c2e33'
        },
        title: {
          color: 'white'
        },
        close: {
          color: 'white',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)'
          }
        },
        body: {
          backgroundColor: '#25294A',
          padding: '20px'
        }
      }}
    >
      <Text size="sm" c="dimmed" mb="lg">
        Here's how the AI assistant arrived at its response:
      </Text>
      <ThoughtProcess thoughts={thoughts} />
    </Modal>
  )
}
