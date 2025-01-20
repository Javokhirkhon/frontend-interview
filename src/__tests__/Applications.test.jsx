import { render, screen, waitFor } from '@testing-library/react'
import Applications from '../Applications'

global.fetch = vi.fn()

const mockApplications = [
  {
    id: 1,
    company: 'Kulas, Renner and Dietrich',
    first_name: 'Sherman',
    last_name: 'Gerlach',
    email: 'Carroll47@yahoo.com',
    loan_amount: 85268,
    date_created: '2021-05-24T15:18:01.406Z',
    expiry_date: '2023-11-12T06:17:54.254Z',
  },
]

describe('Applications Component', () => {
  beforeEach(() => {
    fetch.mockReset() // Reset fetch mocks before each test
  })

  it('displays a loading message while data is being fetched', () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApplications),
    })

    render(<Applications />)
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
  })

  it('displays applications after data is fetched', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockApplications),
    })

    render(<Applications />)

    // Wait for the applications to load
    await waitFor(() => {
      expect(
        screen.getByText(/Kulas, Renner and Dietrich/i)
      ).toBeInTheDocument()
    })
  })

  it('handles fetch errors gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<Applications />)

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument()
    })

    // Verify that no applications are displayed
    expect(
      screen.queryByText(/Kulas, Renner and Dietrich/i)
    ).not.toBeInTheDocument()
  })
})
