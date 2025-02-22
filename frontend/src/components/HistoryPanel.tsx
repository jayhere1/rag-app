import { Drawer, Text, Stack, Loader, Button } from '@mantine/core'
import { useEffect, useMemo, useState } from 'react'
import { IconTrash } from '@tabler/icons-react'

interface HistoryData {
  id: string
  title: string
  timestamp: number
}

interface HistoryPanelProps {
  opened: boolean
  onClose: () => void
  onChatSelected: (id: string) => void
}

function groupHistory(history: HistoryData[]) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const lastWeek = new Date(today)
  lastWeek.setDate(lastWeek.getDate() - 7)
  const lastMonth = new Date(today)
  lastMonth.setDate(lastMonth.getDate() - 30)

  return history.reduce(
    (groups, item) => {
      const itemDate = new Date(item.timestamp)
      let group

      if (itemDate >= today) {
        group = 'Today'
      } else if (itemDate >= yesterday) {
        group = 'Yesterday'
      } else if (itemDate >= lastWeek) {
        group = 'Last 7 Days'
      } else if (itemDate >= lastMonth) {
        group = 'Last 30 Days'
      } else {
        group = itemDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
      }

      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(item)
      return groups
    },
    {} as Record<string, HistoryData[]>
  )
}

interface HistoryItemProps {
  item: HistoryData
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

function HistoryItem({ item, onSelect, onDelete }: HistoryItemProps) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <Button
      variant="subtle"
      color="gray"
      fullWidth
      styles={{
        root: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '8px 12px',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)'
          }
        },
        inner: {
          justifyContent: 'space-between'
        }
      }}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onClick={() => onSelect(item.id)}
    >
      <Text size="sm" style={{ color: '#2C2E33' }}>
        {item.title}
      </Text>
      {showDelete && (
        <IconTrash
          size={16}
          style={{ color: '#666', cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation()
            onDelete(item.id)
          }}
        />
      )}
    </Button>
  )
}

export default function HistoryPanel({ opened, onClose, onChatSelected }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Mock loading more history items
  const loadMore = async () => {
    setIsLoading(true)
    // TODO: Implement actual history loading
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setHasMore(false)
  }

  const handleDelete = async (id: string) => {
    // TODO: Implement actual delete
    setHistory(prev => prev.filter(item => item.id !== id))
  }

  const groupedHistory = useMemo(() => groupHistory(history), [history])

  useEffect(() => {
    if (opened) {
      loadMore()
    }
  }, [opened])

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Chat History"
      position="left"
      size="sm"
      styles={{
        root: {},
        header: {
          borderBottom: '1px solid #e9ecef'
        },
        title: {
          color: '#2C2E33'
        },
        close: {
          color: '#2C2E33',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.05)'
          }
        },
        body: {
          padding: '16px'
        }
      }}
    >
      <Stack gap="md">
        {Object.entries(groupedHistory).map(([group, items]) => (
          <div key={group}>
            <Text
              size="sm"
              fw={500}
              style={{ color: '#666', marginBottom: '8px' }}
            >
              {group}
            </Text>
            <Stack gap="xs">
              {items.map(item => (
                <HistoryItem
                  key={item.id}
                  item={item}
                  onSelect={onChatSelected}
                  onDelete={handleDelete}
                />
              ))}
            </Stack>
          </div>
        ))}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loader color="gray" />
          </div>
        )}
        {!isLoading && history.length === 0 && (
          <Text style={{ color: '#2C2E33', textAlign: 'center' }}>
            No chat history
          </Text>
        )}
        {hasMore && !isLoading && (
          <Button
            variant="subtle"
            color="gray"
            onClick={loadMore}
            style={{ marginTop: '20px' }}
          >
            Load more
          </Button>
        )}
      </Stack>
    </Drawer>
  )
}
