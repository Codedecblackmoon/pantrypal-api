const express = require('express');
const cors = require('cors');
const pantryRoutes = require('./routes/pantry.routes');
const recipesRoutes = require('./routes/recipes.routes');
const notificationsRoutes = require('./routes/notifications.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/pantry', pantryRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/notifications', notificationsRoutes);

app.use(errorHandler);

module.exports = app;