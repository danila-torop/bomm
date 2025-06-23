const express = require('express');
const cors = require('cors'); // Add the cors package
const assyRouter = require('./routes/assy.routes');
const partRouter = require('./routes/part.routes');

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors()); // Enable CORS middleware
app.use(express.json());
app.use('/api', assyRouter);
app.use('/api', partRouter);

app.listen(PORT, () => console.log(`server started on port ${PORT}`));