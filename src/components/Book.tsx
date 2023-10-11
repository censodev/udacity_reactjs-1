export type BookModel = {
    id: string
    cover: string
    title: string
    authors: string[]
}

export type BookShelfType = 'wantToRead' | 'read' | 'currentlyReading' | 'none'

export default function Book({ details, selectedShelf = 'none', moveToShelf }: { details: BookModel, selectedShelf?: BookShelfType, moveToShelf?: (type: BookShelfType) => void }) {
    return (
        <div className="book">
            <div className="book-top">
                <div
                    className="book-cover"
                    style={{
                        width: 128,
                        height: 193,
                        backgroundImage: `url("${details.cover}")`,
                    }}
                ></div>
                <div className="book-shelf-changer">
                    <select value={selectedShelf} onChange={e => moveToShelf?.(e.target.value as BookShelfType)}>
                        <option value="none" disabled>
                            Move to...
                        </option>
                        <option value="currentlyReading">
                            Currently Reading
                        </option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                    </select>
                </div>
            </div>
            <div className="book-title">{details.title}</div>
            <div className="book-authors">{details.authors}</div>
        </div>
    )
}