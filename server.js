const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

let bills = [];
let nextId = 1;

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'propinas-cuentas-api' });
});

app.post('/api/calculate', (req, res) => {
  const subtotal = Number(req.body.subtotal);
  const tipPercent = Number(req.body.tipPercent ?? 10);
  const people = Math.max(1, Number(req.body.people ?? 1));

  if (!Number.isFinite(subtotal) || subtotal < 0) {
    return res.status(400).json({ error: 'Subtotal inválido' });
  }

  const tipAmount = Number(((subtotal * tipPercent) / 100).toFixed(2));
  const total = Number((subtotal + tipAmount).toFixed(2));
  const perPerson = Number((total / people).toFixed(2));

  res.json({
    subtotal,
    tipPercent,
    people,
    tipAmount,
    total,
    perPerson,
  });
});

app.get('/api/bills', (req, res) => {
  res.json(bills);
});

app.post('/api/bills', (req, res) => {
  const { concept = 'Cuenta', subtotal, tipPercent = 10, people = 1 } = req.body;
  const subNum = Number(subtotal);
  const tipNum = Number(tipPercent);
  const peopleNum = Math.max(1, Number(people));

  if (!Number.isFinite(subNum) || subNum < 0) {
    return res.status(400).json({ error: 'Subtotal inválido' });
  }

  const tipAmount = Number(((subNum * tipNum) / 100).toFixed(2));
  const total = Number((subNum + tipAmount).toFixed(2));
  const perPerson = Number((total / peopleNum).toFixed(2));

  const record = {
    id: nextId++,
    concept,
    subtotal: subNum,
    tipPercent: tipNum,
    people: peopleNum,
    tipAmount,
    total,
    perPerson,
    createdAt: new Date().toISOString(),
  };

  bills.push(record);
  res.status(201).json(record);
});

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});
