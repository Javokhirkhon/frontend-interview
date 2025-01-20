import { useEffect, useState } from 'react'
import styles from './Applications.module.css'
import { Button } from './ui/Button/Button'
import SingleApplication from './SingleApplication'
import { TApplication } from '../json-server/db'

const Applications = () => {
  const [applications, setApplications] = useState<TApplication[]>([])
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const fetchApplications = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `http://localhost:3001/api/applications?_page=${page}&_limit=5`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch applications')
      }

      const data = await response.json()
      const linkHeader = response.headers.get('Link')

      setApplications((prev) => [...prev, ...data])
      setHasMore(linkHeader && linkHeader.includes('rel="next"'))
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [page])

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1)
    }
  }

  return (
    <div className={styles.Applications}>
      {applications.map((application) => (
        <SingleApplication key={application.id} application={application} />
      ))}

      {isLoading && <p>Loading...</p>}

      {error && <p className={styles.error}>Error: {error}</p>}

      {!isLoading && hasMore && !error && (
        <Button className={styles.loadMoreButton} onClick={loadMore}>
          Load More
        </Button>
      )}

      {!isLoading && !hasMore && <p>No more applications to load.</p>}
    </div>
  )
}

export default Applications
