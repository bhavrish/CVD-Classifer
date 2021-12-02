import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import axios from 'axios'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),

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
    const params = { age, gender, height, weight, ap_hi, ap_low, cholesterol, gluc, smoke, alco, active }

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
        label="Age"
        variant="filled"
        required
        value={age}
        onChange={e => setAge(e.target.value)}
      />
      <TextField
        label="Gender"
        variant="filled"
        required
        value={gender}
        onChange={e => setGender(e.target.value)}
      />
      <TextField
        label="Height"
        variant="filled"
        required
        value={height}
        onChange={e => setHeight(e.target.value)}
      />
      <TextField
        label="Weight"
        variant="filled"
        required
        value={weight}
        onChange={e => setWeight(e.target.value)}
      />
      <TextField
        label="Ap_Hi"
        variant="filled"
        required
        value={ap_hi}
        onChange={e => setApHi(e.target.value)}
      />
      <TextField
        label="Ap_Low"
        variant="filled"
        required
        value={ap_low}
        onChange={e => setApLow(e.target.value)}
      />
      <TextField
        label="Cholesterol"
        variant="filled"
        required
        value={cholesterol}
        onChange={e => setCholesterol(e.target.value)}
      />
      <TextField
        label="Glucose"
        variant="filled"
        required
        value={gluc}
        onChange={e => setGluc(e.target.value)}
      />
      <TextField
        label="Smoke"
        variant="filled"
        required
        value={smoke}
        onChange={e => setSmoke(e.target.value)}
      />
      <TextField
        label="Alcohol"
        variant="filled"
        required
        value={alco}
        onChange={e => setAlco(e.target.value)}
      />
      <TextField
        label="Active"
        variant="filled"
        required
        value={active}
        onChange={e => setActive(e.target.value)}
      />
      <div>
        <Button type="submit" variant="contained" color="primary">
          Predict
        </Button>
      </div>
    </form>
  );
};

export default Form;
