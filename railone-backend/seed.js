require('dotenv').config();
const mongoose = require('mongoose');
const Train = require('./models/Train');
const connectDB = require('./config/db');

connectDB();

const trains = [
  {
    trainNumber: '12951',
    name: 'Mumbai Rajdhani',
    source: 'Mumbai Central',
    destination: 'New Delhi',
    schedule: [
      { station: 'Mumbai Central', arrivalTime: '17:00', departureTime: '17:00', day: 1 },
      { station: 'Surat', arrivalTime: '19:43', departureTime: '19:48', day: 1 },
      { station: 'New Delhi', arrivalTime: '08:32', departureTime: '08:32', day: 2 }
    ],
    classes: ['1A', '2A', '3A'],
    totalSeats: { '1A': 20, '2A': 50, '3A': 150 },
    availableSeats: { '1A': 20, '2A': 50, '3A': 150 }
  },
  {
    trainNumber: '12259',
    name: 'Sealdah Duronto',
    source: 'Sealdah',
    destination: 'Bikaner',
    schedule: [
      { station: 'Sealdah', arrivalTime: '17:00', departureTime: '17:00', day: 1 },
      { station: 'Bikaner', arrivalTime: '19:15', departureTime: '19:15', day: 2 }
    ],
    classes: ['1A', '2A', '3A', 'SL'],
    totalSeats: { '1A': 15, '2A': 40, '3A': 100, 'SL': 200 },
    availableSeats: { '1A': 15, '2A': 40, '3A': 100, 'SL': 200 }
  },
  {
    trainNumber: '12627',
    name: 'Karnataka Express',
    source: 'KSR Bengaluru',
    destination: 'New Delhi',
    schedule: [
      { station: 'KSR Bengaluru', arrivalTime: '19:20', departureTime: '19:20', day: 1 },
      { station: 'Bhopal', arrivalTime: '18:15', departureTime: '18:25', day: 2 },
      { station: 'New Delhi', arrivalTime: '09:00', departureTime: '09:00', day: 3 }
    ],
    classes: ['1A', '2A', '3A', 'SL'],
    totalSeats: { '1A': 10, '2A': 30, '3A': 120, 'SL': 250 },
    availableSeats: { '1A': 10, '2A': 30, '3A': 120, 'SL': 250 }
  },
  {
    trainNumber: '12805',
    name: 'Janmabhoomi Express',
    source: 'Visakhapatnam',
    destination: 'Lingampalli',
    schedule: [
      { station: 'Visakhapatnam', arrivalTime: '06:20', departureTime: '06:20', day: 1 },
      { station: 'Vijayawada', arrivalTime: '11:55', departureTime: '12:00', day: 1 },
      { station: 'Lingampalli', arrivalTime: '19:40', departureTime: '19:40', day: 1 }
    ],
    classes: ['2A', '3A', 'SL'],
    totalSeats: { '2A': 20, '3A': 80, 'SL': 300 },
    availableSeats: { '2A': 20, '3A': 80, 'SL': 300 }
  },
  {
    trainNumber: '22691',
    name: 'Rajdhani Express',
    source: 'KSR Bengaluru',
    destination: 'Hazrat Nizamuddin',
    schedule: [
      { station: 'KSR Bengaluru', arrivalTime: '20:00', departureTime: '20:00', day: 1 },
      { station: 'Secunderabad', arrivalTime: '07:35', departureTime: '07:50', day: 2 },
      { station: 'Hazrat Nizamuddin', arrivalTime: '05:30', departureTime: '05:30', day: 3 }
    ],
    classes: ['1A', '2A', '3A'],
    totalSeats: { '1A': 18, '2A': 46, '3A': 130 },
    availableSeats: { '1A': 18, '2A': 46, '3A': 130 }
  }
];

const seedDB = async () => {
  try {
    await Train.deleteMany();
    await Train.insertMany(trains);
    console.log('Database seeded with Indian trains!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
