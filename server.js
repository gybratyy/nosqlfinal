const mongoose = require('mongoose');


const app = require('./app');

const DB = "mongodb+srv://gybraty:portfoliopassword@portfolio.wurtkio.mongodb.net/";

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('DB connection successful!'));

// Start server
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
