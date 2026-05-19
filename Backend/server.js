import app from "./src/app.js"
import { createTable } from "./src/db/Schema.js"

createTable().then(() => {
    console.log("All Tables Created Successfully")
    const PORT = process.env.PORT || 3000
    app.listen(PORT, () => {
        console.log(`Server are running on ${PORT}`)
    })
}).catch((error) => {
    console.log("Error In Creating Tables ", error)
})


