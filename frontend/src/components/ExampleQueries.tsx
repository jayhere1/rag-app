import { Paper, Text, SimpleGrid } from '@mantine/core'

interface ExampleQueryProps {
  text: string
  onClick: (query: string) => void
}

function ExampleQuery({ text, onClick }: ExampleQueryProps) {
  return (
    <Paper
      p="md"
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center'
      }}
      onClick={() => onClick(text)}
      onMouseEnter={(e) => {
        const target = e.currentTarget
        target.style.backgroundColor = 'rgba(255,255,255,0.1)'
        target.style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={(e) => {
        const target = e.currentTarget
        target.style.backgroundColor = 'rgba(255,255,255,0.05)'
        target.style.transform = 'translateY(0)'
      }}
    >
      <Text size="lg" c="white" style={{ lineHeight: 1.4 }}>
        {text}
      </Text>
    </Paper>
  )
}

interface ExampleQueriesProps {
  onQueryClick: (query: string) => void
}

const MANUFACTURING_EXAMPLES = [
  "What are the best practices for predictive maintenance in manufacturing?",
  "How can we optimize our production line efficiency?",
  "What are common safety protocols in manufacturing facilities?",
  "How can we reduce waste in our manufacturing process?",
  "What are the latest trends in smart manufacturing?",
  "How can we improve quality control in our production?"
]

export default function ExampleQueries({ onQueryClick }: ExampleQueriesProps) {
  return (
    <div style={{ padding: '20px' }}>
      <Text size="xl" fw={600} c="white" mb="lg">
        Example Questions
      </Text>
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {MANUFACTURING_EXAMPLES.map((query, index) => (
          <ExampleQuery
            key={index}
            text={query}
            onClick={onQueryClick}
          />
        ))}
      </SimpleGrid>
    </div>
  )
}
