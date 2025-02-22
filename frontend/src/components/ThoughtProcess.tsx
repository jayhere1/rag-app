import { Paper, Stack, Text } from '@mantine/core'

interface ThoughtProcessProps {
  thoughts: string[]
}

export default function ThoughtProcess({ thoughts }: ThoughtProcessProps) {
  return (
    <Stack gap="md">
      {thoughts.map((thought, index) => (
        <Paper
          key={index}
          p="md"
          style={{
            backgroundColor: '#25294A',
            border: '1px solid #2c2e33'
          }}
        >
          <Stack gap="xs">
            <Text fw={600} size="sm" c="white">
              Step {index + 1}
            </Text>
            <Text size="sm" c="dimmed">
              {thought}
            </Text>
          </Stack>
        </Paper>
      ))}
    </Stack>
  )
}
