import { renderToStaticMarkup } from 'react-dom/server'

export interface ChatResponse {
  message: {
    content: string
  }
  context: {
    data_points?: string[]
    thoughts?: string[]
    followup_questions?: string[]
  }
}

interface ParsedAnswer {
  answerHtml: string
  citations: string[]
}

function isCitationValid(contextDataPoints: string[] | undefined, citationCandidate: string): boolean {
  if (!contextDataPoints) return false

  const regex = /.+\.\w{1,}(?:#\S*)?$/
  if (!regex.test(citationCandidate)) {
    return false
  }

  return contextDataPoints.some(dataPoint => dataPoint.startsWith(citationCandidate))
}

export function parseAnswerToHtml(
  answer: ChatResponse,
  isStreaming: boolean,
  onCitationClicked: (citation: string) => void
): ParsedAnswer {
  const citations: string[] = []
  let parsedAnswer = answer.message.content.trim()

  // Omit citations that are still being typed during streaming
  if (isStreaming) {
    let lastIndex = parsedAnswer.length
    for (let i = parsedAnswer.length - 1; i >= 0; i--) {
      if (parsedAnswer[i] === ']') {
        break
      } else if (parsedAnswer[i] === '[') {
        lastIndex = i
        break
      }
    }
    parsedAnswer = parsedAnswer.substring(0, lastIndex)
  }

  const parts = parsedAnswer.split(/\[([^\]]+)\]/g)

  const fragments: string[] = parts.map((part, index) => {
    if (index % 2 === 0) {
      return part
    } else {
      if (!isCitationValid(answer.context.data_points, part)) {
        return `[${part}]`
      }

      const citationIndex = citations.includes(part)
        ? citations.indexOf(part) + 1
        : citations.push(part) && citations.length

      return renderToStaticMarkup(
        `<a class="citation-link" title="${part}" data-citation="${part}">
          <sup>${citationIndex}</sup>
        </a>`
      )
    }
  })

  return {
    answerHtml: fragments.join(''),
    citations
  }
}
