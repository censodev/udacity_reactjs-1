import { useEffect, useState } from 'react'
import './App.css'
import { search as searchBook } from './BookAPI'
import Book, { BookModel, BookShelfType } from './components/Book'
import useDebounce from './hooks/useDebounce'
import useLocalStorage from './hooks/useLocalStorage'
import BookShelf from './components/BookShelf'

export default function App() {
  const debounce = useDebounce()
  const [showSearchPage, setShowSearchpage] = useState(false)
  const [currentlyReading, setCurrentlyReading] = useLocalStorage<BookModel[]>('currentlyReading', [])
  const [wantToRead, setWantToRead] = useLocalStorage<BookModel[]>('wantToRead', [])
  const [read, setRead] = useLocalStorage<BookModel[]>('read', [])
  const [bookTextSearch, setBookTextSearch] = useState<string>('')
  const [searchedBooks, setSearchedBooks] = useState<BookModel[]>([])

  useEffect(() => {
    if (!showSearchPage) {
      setBookTextSearch('')
      setSearchedBooks([])
      return
    }
    if (bookTextSearch) {
      searchBook(bookTextSearch, 10).then(rs => {
        setSearchedBooks(rs?.error ? [] : rs.map(map2BookModel))
      })
    } else {
      setSearchedBooks([])
    }
  }, [bookTextSearch, showSearchPage])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function map2BookModel(b: any): BookModel {
    return {
      id: b.id,
      cover: b?.imageLinks?.thumbnail,
      title: b.title,
      authors: b.authors,
    } as BookModel
  }

  function removeFromAllShelves(bookId: string) {
    setCurrentlyReading(currentlyReading.filter(b => bookId !== b.id))
    setWantToRead(wantToRead.filter(b => bookId !== b.id))
    setRead(read.filter(b => bookId !== b.id))
  }

  function getShelfContainsBook(bookId: string): BookShelfType {
    return currentlyReading.some(b => b.id === bookId)
      ? 'currentlyReading'
      : wantToRead.some(b => b.id === bookId)
        ? 'wantToRead'
        : read.some(b => b.id === bookId)
          ? 'read'
          : 'none'
  }

  function moveToShelf(type: BookShelfType, book: BookModel) {
    if (type !== 'none' && type === getShelfContainsBook(book.id)) {
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
                  onChange={e => debounce(() => setBookTextSearch(e.target.value))}
                />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {searchedBooks.map(b => (
                  <li key={b.id}><Book details={b} selectedShelf={getShelfContainsBook(b.id)} moveToShelf={type => moveToShelf(type, b)}></Book></li>
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <BookShelf
                  title='Currently Reading'
                  type='currentlyReading'
                  books={currentlyReading}
                  moveToShelf={moveToShelf}
                ></BookShelf>
                <BookShelf
                  title='Want to Read'
                  type='wantToRead'
                  books={wantToRead}
                  moveToShelf={moveToShelf}
                ></BookShelf>
                <BookShelf
                  title='Read'
                  type='read'
                  books={read}
                  moveToShelf={moveToShelf}
                ></BookShelf>
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
