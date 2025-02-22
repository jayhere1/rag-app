import { useState } from 'react'
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text
} from '@mantine/core'
import { useAuth } from '../contexts/AuthContext'
import { notifications } from '@mantine/notifications'

interface LoginModalProps {
  opened: boolean
  onClose: () => void
}

export default function LoginModal({ opened, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(username, password)
      notifications.show({
        title: 'Success',
        message: 'Logged in successfully',
        color: 'green'
      })
      onClose()
      setUsername('')
      setPassword('')
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Invalid username or password',
        color: 'red'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Welcome back!"
      centered
      bg="white"
      size="auto"
      radius="md"
      padding="md"
      transitionProps={{ transition: 'fade', duration: 200 }}
      overlayProps={{
        opacity: 0.55,
        blur: 3
      }}
      portalProps={{
        target: 'body'
      }}
      styles={{
        header: {
          backgroundColor: 'white'
        },
        title: {
          color: 'black',
          fontWeight: 700
        },
        body: {
          width: '400px',
          maxWidth: '90vw'
        }
      }}
    >
      <Text color="dimmed" size="sm" mb={20}>
        Use your credentials to access the RAG application
      </Text>

      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Username"
            placeholder="Your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button
            type="submit"
            loading={isLoading}
            variant="filled"
            bg="white"
            c="black"
            styles={{
              root: {
                border: '1px solid black'
              }
            }}
          >
            Sign in
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
