import { useState, useEffect } from 'react'
import {
  TextInput,
  Text,
  Box,
  Loader,
  Paper,
  ActionIcon,
  Group,
  UnstyledButton,
} from '@mantine/core'
import './QueryPage.css'
import { useMutation } from '@tanstack/react-query'
import { documents, indexes } from '../lib/api'
import { notifications } from '@mantine/notifications'
import { 
  IconSend, 
  IconMicrophone,
  IconHistory 
} from '@tabler/icons-react'
import LoginModal from '../components/LoginModal'
import HistoryPanel from '../components/HistoryPanel'
import ClearChatButton from '../components/ClearChatButton'
import FileUploadButton from '../components/FileUploadButton'
import FileUploadModal from '../components/FileUploadModal'
import SettingsButton from '../components/SettingsButton'
import SettingsModal from '../components/SettingsModal'

interface ChatMessage {
  type: 'user' | 'assistant'
  content: string
}

export default function QueryPage() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [fileUploadOpen, setFileUploadOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState<string | null>(null)

  // Fetch indexes when component mounts
  useEffect(() => {
    const fetchIndexes = async () => {
      try {
        const indexList = await indexes.list()
        if (indexList.length > 0) {
          setCurrentIndex(indexList[0])
        }
      } catch (error) {
        console.error('Failed to fetch indexes:', error)
      }
    }
    fetchIndexes()
  }, [])

  const queryMutation = useMutation({
    mutationFn: () => {
      if (!currentIndex) {
        throw new Error('No index available. Please create an index first.')
      }
      return documents.query({
        query,
        index_name: currentIndex
      })
    },
    onSuccess: data => {
      setMessages(prev => [
        ...prev,
        { type: 'user', content: query },
        { type: 'assistant', content: data.answer }
      ])
      setQuery('')
    },
    onError: error => {
      notifications.show({
        title: 'Error',
        message:
          error instanceof Error ? error.message : 'Failed to execute query',
        color: 'red'
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      queryMutation.mutate()
    }
  }

  const handleClearChat = () => {
    setMessages([])
  }

  return (
    <Box className="chat-container">
      <Box className="chat-toolbar">
        <Group>
          <UnstyledButton 
            onClick={() => setHistoryOpen(true)}
            style={{ color: '#909296', cursor: 'pointer' }}
          >
            <Group gap={4}>
              <IconHistory size={20} />
              <span>Open chat history</span>
            </Group>
          </UnstyledButton>
          <ClearChatButton onClick={handleClearChat} />
          <FileUploadButton onClick={() => setFileUploadOpen(true)} />
          <SettingsButton onClick={() => setSettingsOpen(true)} />
        </Group>
      </Box>

      <Box className="chat-messages">
        {queryMutation.isPending && (
          <Box style={{ textAlign: 'center' }}>
            <Loader size='xl' />
            <Text mt='md'>Analyzing your request...</Text>
          </Box>
        )}

        {messages.map((message, index) => (
          <Paper 
            key={index}
            shadow="sm" 
            p="md"
            className={`message ${message.type}`}
          >
            <Text>{message.content}</Text>
          </Paper>
        ))}
      </Box>

      <Box className="chat-input">
        <form onSubmit={handleSubmit}>
          <TextInput
            placeholder="Manufacturing GPT - Ask questions about manufacturing"
            value={query}
            onChange={e => setQuery(e.target.value)}
            size="md"
            radius="xl"
            styles={{
              input: {
                height: '50px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #e9ecef',
                '&:focus': {
                  borderColor: '#228be6'
                }
              }
            }}
            rightSection={
              <Box style={{ display: 'flex', gap: '8px' }}>
                <ActionIcon 
                  size={32} 
                  radius="xl" 
                  variant="subtle" 
                  color="blue"
                >
                  <IconMicrophone size={20} />
                </ActionIcon>
                <ActionIcon 
                  size={32} 
                  radius="xl" 
                  variant="filled" 
                  color="blue"
                  type="submit"
                  loading={queryMutation.isPending}
                  disabled={!query.trim()}
                >
                  <IconSend size={20} />
                </ActionIcon>
              </Box>
            }
            rightSectionWidth={90}
          />
        </form>
      </Box>

      <LoginModal
        opened={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
      <FileUploadModal 
        opened={fileUploadOpen}
        onClose={() => setFileUploadOpen(false)}
      />
      <SettingsModal
        opened={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <HistoryPanel 
        opened={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onChatSelected={(id) => {
          // TODO: Implement chat selection
          setHistoryOpen(false)
        }}
      />
    </Box>
  )
}
