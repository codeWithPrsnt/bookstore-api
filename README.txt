To setup project:-
1. go to base of project and open a terminal
2. npm i
3. open .env file and update mongodb connection string (i.e.MONGODB_URI)
4. setup db
    i.open mongosh 
    ii. Switch to (or create) the new database
            use bookstore
    iii. Insert a document into a new collection
            db.books.insertOne({
            title: "Sample Book",
            author: "John Doe",
            genre: "Fiction",
            publishedDate: new Date()
            })

5. npm run dev