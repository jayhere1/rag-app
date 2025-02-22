import { useState } from 'react'
import {
  Container,
  Title,
  Button,
  Card,
  Group,
  Stack,
  Text,
  ActionIcon,
  Box
} from '@mantine/core'
import { IconTrash } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { indexes } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import IndexModal from '../components/IndexModal'

export default function IndexesPage () {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const navigate = useNavigate()
  const { user } = useAuth()

  const { data: indexList = [], isLoading, refetch } = useQuery({
    queryKey: ['indexes'],
    queryFn: indexes.list
  })

  const handleIndexClick = (indexName: string) => {
    navigate(`/indexes/${indexName}/documents`)
  }

  const handleDelete = async (e: React.MouseEvent, indexName: string) => {
    e.stopPropagation() // Prevent navigation when clicking delete
    try {
      await indexes.delete(indexName)
      refetch() // Refresh the list after deletion
    } catch (error) {
      console.error('Failed to delete index:', error)
    }
  }

  return (
    <Container size='lg'>
      <Group justify="space-between" style={{ 
        borderBottom: '1px solid #e9ecef',
        marginBottom: '2rem',
        paddingBottom: '1rem'
      }}>
        <Title order={2}>Document Indexes</Title>
        <Button onClick={() => setIsCreateModalOpen(true)}>New Index</Button>
      </Group>

      <Stack gap='md'>
        {indexList.map((indexName: string) => (
          <Card
            key={indexName}
            shadow='sm'
            p='lg'
            radius='md'
            withBorder
            style={{ cursor: 'pointer' }}
            onClick={() => handleIndexClick(indexName)}
          >
            <Group justify="space-between">
              <Text size='lg' fw={500}>
                {indexName}
              </Text>
              {user?.roles.includes('admin') && (
                <ActionIcon 
                  color="red" 
                  variant="subtle"
                  onClick={(e) => handleDelete(e, indexName)}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              )}
            </Group>
          </Card>
        ))}
      </Stack>

      <IndexModal
        opened={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false)
          refetch()
        }}
      />
    </Container>
  )
}
