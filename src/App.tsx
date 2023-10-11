/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react'
import './App.css'
import { getAll } from './BookAPI'
import Book, { BookModel, BookShelfType } from './components/Book'

function App() {
  const [showSearchPage, setShowSearchpage] = useState(false)
  const [books, setBooks] = useState<BookModel[]>([])
  const [currentlyReading, setCurrentlyReading] = useState<BookModel[]>([])
  const [wantToRead, setWantToRead] = useState<BookModel[]>([])
  const [read, setRead] = useState<BookModel[]>([])

  useEffect(() => {
    let ignore = false
    getAll().then(rs => {
      if (!ignore) {
        console.log(rs);
        setBooks(rs.map((b: any) => {
          return {
            id: b.id,
            cover: b.imageLinks.thumbnail,
            title: b.title,
            authors: b.authors,
          } as BookModel
        }))
      }
    })
    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (books.length >= 7) {
      setCurrentlyReading(books.slice(0, 2))
      setWantToRead(books.slice(2, 4))
      setRead(books.slice(4, 7))
    }
  }, [books])

  function removeFromAllShelves(bookId: string) {
    setCurrentlyReading(currentlyReading.filter(b => bookId !== b.id))
    setWantToRead(wantToRead.filter(b => bookId !== b.id))
    setRead(read.filter(b => bookId !== b.id))
  }

  function moveToShelf(type: BookShelfType, book: BookModel) {
    console.log('moveToShelf: ', type, book);
    if (currentlyReading.some(b => b.id === book.id) && type === 'currentlyReading'
      || wantToRead.some(b => b.id === book.id) && type === 'wantToRead'
      || read.some(b => b.id === book.id) && type === 'read') {
      return
    }
    removeFromAllShelves(book.id)
    switch (type) {
      case 'currentlyReading':
        setCurrentlyReading([...currentlyReading, book])
        break
      case 'wantToRead':
        setWantToRead([...wantToRead, book])
        break
      case 'read':
        setRead([...read, book])
        break
      case 'none':
      default:
        break
    }
  }

  return (
    <>
      <div className="app">
        {showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a
                className="close-search"
                onClick={() => setShowSearchpage(!showSearchPage)}
              >
                Close
              </a>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title, author, or ISBN"
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {currentlyReading.map(b => (
                        <li key={b.id}><Book details={b} moveToShelf={type => moveToShelf(type, b)}></Book></li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {wantToRead.map(b => (
                        <li key={b.id}><Book details={b} moveToShelf={type => moveToShelf(type, b)}></Book></li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {read.map(b => (
                        <li key={b.id}><Book details={b} moveToShelf={type => moveToShelf(type, b)}></Book></li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => setShowSearchpage(!showSearchPage)}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
