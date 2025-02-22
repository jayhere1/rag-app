import { Paper, Stack, Text, Image } from '@mantine/core'
import DOMPurify from 'dompurify'

interface SupportingContentProps {
  content: string[] | { text: string[]; images?: string[] }
}

interface ParsedContent {
  title: string
  content: string
}

function parseSupportingContent(item: string): ParsedContent {
  const parts = item.split(': ')
  const title = parts[0]
  const content = DOMPurify.sanitize(parts.slice(1).join(': '))

  return {
    title,
    content
  }
}

export default function SupportingContent({ content }: SupportingContentProps) {
  const textItems = Array.isArray(content) ? content : content.text
  const imageItems = !Array.isArray(content) ? content.images : []

  return (
    <Stack gap="md">
      {textItems.map((item, index) => {
        const parsed = parseSupportingContent(item)
        return (
          <Paper
            key={`content-${index}`}
            p="md"
            style={{
              backgroundColor: '#25294A',
              border: '1px solid #2c2e33'
            }}
          >
            <Stack gap="xs">
              <Text fw={600} size="sm" c="white">
                {parsed.title}
              </Text>
              <Text
                size="sm"
                c="dimmed"
                dangerouslySetInnerHTML={{ __html: parsed.content }}
                style={{
                  '& a': {
                    color: '#228be6',
                    textDecoration: 'none'
                  },
                  '& a:hover': {
                    textDecoration: 'underline'
                  }
                }}
              />
            </Stack>
          </Paper>
        )
      })}

      {imageItems?.map((img, index) => (
        <Paper
          key={`image-${index}`}
          p="md"
          style={{
            backgroundColor: '#25294A',
            border: '1px solid #2c2e33'
          }}
        >
          <Image
            src={img}
            alt={`Supporting content image ${index + 1}`}
            style={{
              maxWidth: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </Paper>
      ))}
    </Stack>
  )
}
