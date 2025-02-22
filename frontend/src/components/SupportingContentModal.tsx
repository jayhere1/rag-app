import { Modal, Text } from '@mantine/core'
import SupportingContent from './SupportingContent'

interface SupportingContentModalProps {
  opened: boolean
  onClose: () => void
  content: string[] | { text: string[]; images?: string[] }
}

export default function SupportingContentModal({
  opened,
  onClose,
  content
}: SupportingContentModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Supporting Content"
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
        The AI assistant used the following content to generate its response:
      </Text>
      <SupportingContent content={content} />
    </Modal>
  )
}
