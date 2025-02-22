import { Modal, Stack, NumberInput, TextInput, Checkbox, Button, Text } from '@mantine/core'
import { useState } from 'react'

interface SettingsModalProps {
  opened: boolean
  onClose: () => void
}

interface Settings {
  temperature: number
  maxTokens: number
  promptTemplate: string
  useSemanticRanker: boolean
  useSemanticCaptions: boolean
  retrieveCount: number
  shouldStream: boolean
  suggestFollowupQuestions: boolean
}

export default function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>({
    temperature: 0.7,
    maxTokens: 500,
    promptTemplate: 'You are an AI assistant helping with manufacturing operations.',
    useSemanticRanker: true,
    useSemanticCaptions: true,
    retrieveCount: 3,
    shouldStream: true,
    suggestFollowupQuestions: true
  })

  const handleSave = () => {
    // TODO: Implement settings save functionality
    onClose()
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Developer Settings"
      size="lg"
      styles={{
        header: {
          borderBottom: '1px solid #2c2e33'
        },
        title: {
          color: '#2C2E33'
        },
        close: {
          color: '#2C2E33',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.1)'
          }
        },
        body: {
          padding: '20px'
        }
      }}
    >
      <Stack gap="md">
        <Text size="sm" fw={500} c="#2C2E33">Model Settings</Text>
        
        <NumberInput
          label="Temperature"
          description="Controls randomness in the model's responses (0-1)"
          value={settings.temperature}
          onChange={(value) => setSettings(prev => ({ ...prev, temperature: Number(value || 0) }))}
          min={0}
          max={1}
          step={0.1}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <NumberInput
          label="Max Tokens"
          description="Maximum length of the model's response"
          value={settings.maxTokens}
          onChange={(value) => setSettings(prev => ({ ...prev, maxTokens: Number(value || 0) }))}
          min={100}
          max={2000}
          step={100}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <TextInput
          label="Prompt Template"
          description="System message that defines the AI's behavior"
          value={settings.promptTemplate}
          onChange={(e) => setSettings(prev => ({ ...prev, promptTemplate: e.target.value }))}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <Text size="sm" fw={500} c="#2C2E33" mt="md">Retrieval Settings</Text>

        <Checkbox
          label="Use Semantic Ranker"
          description="Improve search relevance using semantic ranking"
          checked={settings.useSemanticRanker}
          onChange={(e) => setSettings(prev => ({ ...prev, useSemanticRanker: e.currentTarget.checked }))}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <Checkbox
          label="Use Semantic Captions"
          description="Generate semantic captions for better context"
          checked={settings.useSemanticCaptions}
          onChange={(e) => setSettings(prev => ({ ...prev, useSemanticCaptions: e.currentTarget.checked }))}
          disabled={!settings.useSemanticRanker}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <NumberInput
          label="Retrieve Count"
          description="Number of documents to retrieve per query"
          value={settings.retrieveCount}
          onChange={(value) => setSettings(prev => ({ ...prev, retrieveCount: Number(value || 1) }))}
          min={1}
          max={10}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <Text size="sm" fw={500} c="#2C2E33" mt="md">Chat Settings</Text>

        <Checkbox
          label="Enable Streaming"
          description="Show responses as they are generated"
          checked={settings.shouldStream}
          onChange={(e) => setSettings(prev => ({ ...prev, shouldStream: e.currentTarget.checked }))}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <Checkbox
          label="Suggest Follow-up Questions"
          description="AI suggests relevant follow-up questions"
          checked={settings.suggestFollowupQuestions}
          onChange={(e) => setSettings(prev => ({ ...prev, suggestFollowupQuestions: e.currentTarget.checked }))}
          styles={{
            label: { color: '#2C2E33' },
            description: { color: '#2C2E33' }
          }}
        />

        <Button
          onClick={handleSave}
          fullWidth
          mt="md"
          style={{
            backgroundColor: '#228be6',
            '&:hover': {
              backgroundColor: '#1c7ed6'
            }
          }}
        >
          Save Settings
        </Button>
      </Stack>
    </Modal>
  )
}
