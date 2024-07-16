import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// הגדרת נתיב לתיקיית הפרויקט
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// הגדרת תיקיות סטטיות
app.use(express.static(path.join(__dirname, 'components')));
app.use('/assets', express.static(path.join(__dirname, 'components', 'assets')));
app.use('/user', express.static(path.join(__dirname, 'components', 'User')));

// הגדרת הנתיב לדף הבית (allVacations.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'User', 'Vacations', 'allVacations.html'));
});

// הגשת קובץ JSON
app.get('/vacations', (req, res) => {
    res.sendFile(path.join(__dirname, 'components', 'User', 'Vacations', 'allVacation.json'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
