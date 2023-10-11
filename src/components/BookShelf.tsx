import Book, { BookModel, BookShelfType } from "./Book";

export default function BookShelf({ title, type, books, moveToShelf }: { title: string, type: BookShelfType, books: BookModel[], moveToShelf: (type: BookShelfType, b: BookModel) => void }) {
    return (
        <div className="bookshelf">
            <h2 className="bookshelf-title">{title}</h2>
            <div className="bookshelf-books">
                <ol className="books-grid">
                    {books.map((b) => (
                        <li key={b.id}>
                            <Book
                                details={b}
                                selectedShelf={type}
                                moveToShelf={(type) => moveToShelf(type, b)}
                            ></Book>
                        </li>
                    ))}
                </ol>
            </div>
        </div>
    );
}
