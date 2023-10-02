const express = require('express');
const app = express();
const port = 3000;

const doctors = [
  {
    id: 1,
    name: 'Gayatri Pimparakr',
    specialization: 'MBBS',
    schedule: {
      day: 'Sunday',
      time: 'Evening',
      maxPatients: 5,
      location: 'nashik',
    },
  },
  {
    id: 2,
    name: 'Kiran Gaikwad',
    specialization: 'BAMS',
    schedule: {
      day: 'Sunday',
      time: 'Evening',
      maxPatients: 3,
      location: 'mumbai',
    },
  },
];

const appointments = [];

app.use(express.json());

app.get('/doctors', (req, res) => {
  res.json(doctors);
});

app.get('/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (!doctor) {
    res.status(404).json({ error: 'Doctor not found' });
  } else {
    res.json(doctor);
  }
});

app.post('/appointments', (req, res) => {
  const { doctorId, patientName, dayForcheckup, location,timeforcheckup } = req.body;
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (!doctor) {
    res.status(404).json({ error: 'Doctor not found' });
    return;
  }

  if (dayForcheckup === doctor.schedule.day) {
    res.status(400).json({ error: 'Doctors do not practice on this day' });
    return;
  }
  if (location !== doctor.schedule.location) {
    res.status(400).json({ error: 'Doctors are not available at this location' });
    return;
  }

  if (timeforcheckup !== doctor.schedule.time) {
    res.status(400).json({ error: 'Doctors are available in evening only' });
    return;
  }

  if (appointments.filter((appt) => appt.doctorId === doctorId).length >= doctor.schedule.maxPatients) {
    res.status(400).json({ error: 'Doctor is fully booked' });
    return;
  }

  const appointment = {
    doctorId,
    patientName,
    location,
    dayForcheckup,
    timeforcheckup
  };

  appointments.push(appointment);

  res.status(201).json(appointment);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
