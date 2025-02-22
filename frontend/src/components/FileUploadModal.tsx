import { Modal, Text, Group, Stack, FileInput, Button, Loader } from '@mantine/core'
import { IconUpload, IconTrash } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

interface FileUploadModalProps {
  opened: boolean
  onClose: () => void
}

interface UploadedFile {
  filename: string
  status: 'idle' | 'deleting' | 'deleted' | 'error'
}

export default function FileUploadModal({ opened, onClose }: FileUploadModalProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string>()
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (opened) {
      loadUploadedFiles()
    }
  }, [opened])

  const loadUploadedFiles = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement API call to get uploaded files
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock API call
      setUploadedFiles([
        { filename: 'example1.pdf', status: 'idle' },
        { filename: 'example2.docx', status: 'idle' }
      ])
    } catch (error) {
      console.error('Failed to load files:', error)
    }
    setIsLoading(false)
  }

  const handleUpload = async (file: File | null) => {
    if (!file) return
    
    setIsUploading(true)
    setUploadError(undefined)
    
    try {
      // TODO: Implement actual file upload
      await new Promise(resolve => setTimeout(resolve, 1500)) // Mock upload delay
      setUploadedFiles(prev => [...prev, { filename: file.name, status: 'idle' }])
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadError('Failed to upload file. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    setUploadedFiles(prev =>
      prev.map(file =>
        file.filename === filename ? { ...file, status: 'deleting' } : file
      )
    )

    try {
      // TODO: Implement actual file deletion
      await new Promise(resolve => setTimeout(resolve, 1000)) // Mock deletion delay
      setUploadedFiles(prev => prev.filter(file => file.filename !== filename))
    } catch (error) {
      console.error('Deletion failed:', error)
      setUploadedFiles(prev =>
        prev.map(file =>
          file.filename === filename ? { ...file, status: 'error' } : file
        )
      )
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Manage File Uploads"
      size="md"
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
        <FileInput
          placeholder="Choose file"
          accept=".txt,.md,.json,.png,.jpg,.jpeg,.pdf,.docx,.xlsx,.pptx"
          onChange={handleUpload}
          leftSection={<IconUpload size={20} />}
          disabled={isUploading}
          style={{ maxWidth: '100%' }}
        />

        {isUploading && (
          <Group justify="center" p="sm">
            <Loader color="blue" size="sm" />
            <Text size="sm" c="#2C2E33">Uploading file...</Text>
          </Group>
        )}

        {uploadError && (
          <Text c="red" size="sm">
            {uploadError}
          </Text>
        )}

        <Text fw={500} size="sm" c="#2C2E33" mt="md">
          Uploaded Files
        </Text>

        {isLoading ? (
          <Group justify="center" p="sm">
            <Loader color="blue" size="sm" />
            <Text size="sm" c="#2C2E33">Loading files...</Text>
          </Group>
        ) : uploadedFiles.length === 0 ? (
          <Text size="sm" c="#2C2E33" ta="center">
            No files uploaded yet
          </Text>
        ) : (
          <Stack gap="xs">
            {uploadedFiles.map(file => (
              <Group key={file.filename} justify="space-between" p="xs" style={{ backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                <Text size="sm" c="#2C2E33" style={{ wordBreak: 'break-all' }}>
                  {file.filename}
                </Text>
                <Button
                  variant="subtle"
                  color="red"
                  size="xs"
                  leftSection={<IconTrash size={16} />}
                  onClick={() => handleDelete(file.filename)}
                  loading={file.status === 'deleting'}
                  disabled={file.status === 'deleting'}
                >
                  {file.status === 'deleting' ? 'Deleting...' : 
                   file.status === 'error' ? 'Retry Delete' : 'Delete'}
                </Button>
              </Group>
            ))}
          </Stack>
        )}
      </Stack>
    </Modal>
  )
}
