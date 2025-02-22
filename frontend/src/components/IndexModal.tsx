import { useState } from 'react'
import {
  Modal,
  TextInput,
  Button,
  Stack,
} from '@mantine/core'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { indexes } from '../lib/api'
import { notifications } from '@mantine/notifications'

interface IndexModalProps {
  opened: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function IndexModal({ opened, onClose, onSuccess }: IndexModalProps) {
  const [newIndexName, setNewIndexName] = useState('')
  const [newIndexDescription, setNewIndexDescription] = useState('')
  const queryClient = useQueryClient()

  const createIndexMutation = useMutation({
    mutationFn: (variables: { name: string; description: string }) =>
      indexes.create(variables.name, variables.description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['indexes'] })
      onClose()
      setNewIndexName('')
      setNewIndexDescription('')
      notifications.show({
        title: 'Success',
        message: 'Index created successfully',
        color: 'green'
      })
      onSuccess?.()
    },
    onError: error => {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to create index',
        color: 'red'
      })
    }
  })

  const handleCreateIndex = (e: React.FormEvent) => {
    e.preventDefault()
    createIndexMutation.mutate({
      name: newIndexName,
      description: newIndexDescription
    })
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Create New Index"
      centered
    >
      <form onSubmit={handleCreateIndex}>
        <Stack>
          <TextInput
            label="Index Name"
            placeholder="Enter index name"
            value={newIndexName}
            onChange={e => setNewIndexName(e.target.value)}
            required
          />
          <TextInput
            label="Description"
            placeholder="Enter index description"
            value={newIndexDescription}
            onChange={e => setNewIndexDescription(e.target.value)}
          />
          <Button
            type="submit"
            loading={createIndexMutation.isPending}
            fullWidth
          >
            Create Index
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
