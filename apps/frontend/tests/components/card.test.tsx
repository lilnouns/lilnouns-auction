import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@repo/ui/components/card'

describe('Card', () => {
  it('renders a card with content', () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Test Card</CardTitle>
        </CardHeader>
        <CardContent>Card content</CardContent>
      </Card>,
    )

    // Check that the card renders with the expected content
    expect(container.textContent).toContain('Test Card')
    expect(container.textContent).toContain('Card content')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <CardContent>Content</CardContent>
      </Card>,
    )

    // Check that the card has the custom class
    const cardElement = container.firstChild as HTMLElement
    expect(cardElement.className).toContain('custom-class')
  })
})
