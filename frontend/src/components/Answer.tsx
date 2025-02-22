import { Paper, Stack, Group, ActionIcon, Text, Button, Loader } from '@mantine/core'
import { IconCopy, IconBulb, IconClipboard } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import DOMPurify from 'dompurify'
import { ChatResponse, parseAnswerToHtml } from '../utils/answerParser'
import styles from './Answer.module.css'
import SupportingContentModal from './SupportingContentModal'
import ThoughtProcessModal from './ThoughtProcessModal'

interface AnswerProps {
  answer: ChatResponse
  isStreaming: boolean
  onCitationClicked: (citation: string) => void
  onFollowupQuestionClicked?: (question: string) => void
  showFollowupQuestions?: boolean
}

export default function Answer({
  answer,
  isStreaming,
  onCitationClicked,
  onFollowupQuestionClicked,
  showFollowupQuestions
}: AnswerProps) {
  const [copied, setCopied] = useState(false)
  const [thoughtProcessModalOpened, setThoughtProcessModalOpened] = useState(false)
  const [supportingContentModalOpened, setSupportingContentModalOpened] = useState(false)
  
  const followupQuestions = answer.context.followup_questions
  const parsedAnswer = useMemo(
    () => parseAnswerToHtml(answer, isStreaming, onCitationClicked),
    [answer, isStreaming]
  )
  const sanitizedAnswerHtml = DOMPurify.sanitize(parsedAnswer.answerHtml)

  useEffect(() => {
    // Add click event listener to citation links
    const handleCitationClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const citationLink = target.closest('.citation-link')
      if (citationLink) {
        e.preventDefault()
        const citation = citationLink.getAttribute('data-citation')
        if (citation) {
          onCitationClicked(citation)
        }
      }
    }

    document.addEventListener('click', handleCitationClick)
    return () => document.removeEventListener('click', handleCitationClick)
  }, [onCitationClicked])

  const handleCopy = () => {
    const textToCopy = sanitizedAnswerHtml.replace(
      /<a [^>]*><sup>\d+<\/sup><\/a>|<[^>]+>/g,
      ''
    )
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <>
      <Paper
        p="md"
        style={{
          backgroundColor: '#25294A',
          border: '1px solid #2c2e33'
        }}
      >
        <Stack gap="md">
          <Group justify="space-between">
            <Text size="sm" c="white">
              AI Assistant
            </Text>
            <Group>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={handleCopy}
                title={copied ? 'Copied!' : 'Copy response'}
              >
                <IconCopy size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setThoughtProcessModalOpened(true)}
                title="Show thought process"
                disabled={!answer.context.thoughts?.length}
              >
                <IconBulb size={20} />
              </ActionIcon>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setSupportingContentModalOpened(true)}
                title="Show supporting content"
                disabled={!answer.context.data_points?.length}
              >
                <IconClipboard size={20} />
              </ActionIcon>
            </Group>
          </Group>

          <div className={styles.markdownContent}>
            {isStreaming ? (
              <>
                <ReactMarkdown
                  children={sanitizedAnswerHtml}
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                />
                <Loader size="sm" color="blue" />
              </>
            ) : (
              <ReactMarkdown
                children={sanitizedAnswerHtml}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              />
            )}
          </div>

          {parsedAnswer.citations.length > 0 && (
            <Group gap="xs">
              <Text fw={500} size="sm" c="dimmed">
                Citations:
              </Text>
              {parsedAnswer.citations.map((citation, index) => (
                <Button
                  key={index}
                  variant="light"
                  size="xs"
                  onClick={() => onCitationClicked(citation)}
                >
                  {index + 1}. {citation}
                </Button>
              ))}
            </Group>
          )}

          {showFollowupQuestions && followupQuestions && followupQuestions.length > 0 && (
            <Stack gap="xs">
              <Text fw={500} size="sm" c="dimmed">
                Follow-up Questions:
              </Text>
              <Group gap="xs">
                {followupQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="subtle"
                    size="sm"
                    onClick={() => onFollowupQuestionClicked?.(question)}
                  >
                    {question}
                  </Button>
                ))}
              </Group>
            </Stack>
          )}
        </Stack>
      </Paper>

      <ThoughtProcessModal
        opened={thoughtProcessModalOpened}
        onClose={() => setThoughtProcessModalOpened(false)}
        thoughts={answer.context.thoughts || []}
      />

      <SupportingContentModal
        opened={supportingContentModalOpened}
        onClose={() => setSupportingContentModalOpened(false)}
        content={answer.context.data_points || []}
      />
    </>
  )
}
