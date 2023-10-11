export type BookModel = {
    id: string
    cover: string
    title: string
    authors: string[]
}

export default function Book({ details }: { details: BookModel }) {
    function switchShelf(type: string) {
        console.log(type);
    }
    return (
        <div className="book">
            <div className="book-top">
                <div
                    className="book-cover"
                    style={{
                        width: 128,
                        height: 193,
                        backgroundImage:
                            `url("${details.cover}")`,
                    }}
                ></div>
                <div className="book-shelf-changer">
                    <select>
                        <option value="none" disabled>
                            Move to...
                        </option>
                        <option value="currentlyReading" onSelect={() => switchShelf('currentlyReading')}>
                            Currently Reading
                        </option>
                        <option value="wantToRead" onSelect={() => switchShelf('wantToRead')}>Want to Read</option>
                        <option value="read" onSelect={() => switchShelf('read')}>Read</option>
                        <option value="none" onSelect={() => switchShelf('none')}>None</option>
                    </select>
                </div>
            </div>
            <div className="book-title">{details.title}</div>
            <div className="book-authors">{details.authors}</div>
        </div>
    )
}