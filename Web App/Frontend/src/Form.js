import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),

    '& .MuiFormControl-root': {
      margin: theme.spacing(1),
      width: '300px',
      height: '50px'
    },
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '300px',
      height: '50px'
    },
    '& .MuiButtonBase-root': {
      margin: theme.spacing(2),
    },
  },
}));

const Form = ({ handleClose }) => {
  const classes = useStyles();

  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [ap_hi, setApHi] = useState('');
  const [ap_low, setApLow] = useState('');
  const [cholesterol, setCholesterol] = useState('');
  const [gluc, setGluc] = useState('');
  const [smoke, setSmoke] = useState('');
  const [alco, setAlco] = useState('');
  const [active, setActive] = useState('');

  const handleSubmit = e => {
    e.preventDefault()

    // Conversions
    var convertedAge = age * 365 // years -> days
    var convertedHeight = height * 30.48 // ft -> cm
    var convertedWeight = weight * 2.2 // lb -> kg

    const params = { convertedAge, gender, convertedHeight, convertedWeight, ap_hi, ap_low, cholesterol, gluc, smoke, alco, active }

    axios
      .post('http://localhost:8080/predict', params)
      .then((res) => {
        const data = res.data.data
        const msg = `Assigned Cluster: ${data.cluster}\nCluster Description: ${data.cluster_description}\nPrediction: ${data.prediction}\nInterpretation: ${data.interpretation}`
        alert(msg)
      })
      .catch((error) => alert(`Error: ${error.message}`))
  };

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <h2>Cardiovascular Disease Predictor</h2>
      <TextField
        type="Number"
        label="Age"
        variant="filled"
        required
        value={age}
        onChange={e => setAge(e.target.value)}
      />

      <FormControl variant="filled">
        <InputLabel id="gender-label">Gender</InputLabel>
        <Select
          labelId="gender-label"
          required
          value={gender}
          label="Gender"
          onChange={e => setGender(e.target.value)}
        >
          <MenuItem value={1}>Female</MenuItem>
          <MenuItem value={2}>Male</MenuItem>
        </Select>
      </FormControl>

      <TextField
        type="Number"
        label="Height (ft)"
        variant="filled"
        required
        value={height}
        onChange={e => setHeight(e.target.value)}
      />

      <TextField
        type="Number"
        label="Weight (lb)"
        variant="filled"
        required
        value={weight}
        onChange={e => setWeight(e.target.value)}
      />

      <TextField
        type="Number"
        label="Systolic Blood Pressure"
        variant="filled"
        required
        value={ap_hi}
        onChange={e => setApHi(e.target.value)}
      />

      <TextField
        type="Number"
        label="Diastolic Blood Pressure"
        variant="filled"
        required
        value={ap_low}
        onChange={e => setApLow(e.target.value)}
      />

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="cholesterol-label">Cholesterol</InputLabel>
        <Select
          labelId="cholesterol-label"
          required
          value={cholesterol}
          label="Cholesterol"
          onChange={e => setCholesterol(e.target.value)}
        >
          <MenuItem value={1}>Normal</MenuItem>
          <MenuItem value={2}>Above Normal</MenuItem>
          <MenuItem value={3}>Well Above Normal</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="glucose-label">Glucose</InputLabel>
        <Select
          labelId="glucose-label"
          required
          value={gluc}
          label="Glucose"
          onChange={e => setGluc(e.target.value)}
        >
          <MenuItem value={1}>Normal</MenuItem>
          <MenuItem value={2}>Above Normal</MenuItem>
          <MenuItem value={3}>Well Above Normal</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="smoke-label">Smoke</InputLabel>
        <Select
          labelId="smoke-label"
          required
          value={smoke}
          label="Smoke"
          onChange={e => setSmoke(e.target.value)}
        >
          <MenuItem value={0}>Do Not Smoke</MenuItem>
          <MenuItem value={1}>Smoke</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="alcohol-label">Alcohol</InputLabel>
        <Select
          labelId="alcohol-label"
          required
          value={alco}
          label="Alcohol"
          onChange={e => setAlco(e.target.value)}
        >
          <MenuItem value={0}>Do Not Drink</MenuItem>
          <MenuItem value={1}>Drink</MenuItem>
        </Select>
      </FormControl>

      <FormControl variant="filled" sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="active-label">Active</InputLabel>
        <Select
          labelId="active-label"
          required
          value={active}
          label="Active"
          onChange={e => setActive(e.target.value)}
        >
          <MenuItem value={0}>Not Active</MenuItem>
          <MenuItem value={1}>Active</MenuItem>
        </Select>
      </FormControl>

      <div>
        <Button type="submit" variant="contained" color="primary">
          Predict
        </Button>
      </div>
    </form>
  );
};

export default Form;
