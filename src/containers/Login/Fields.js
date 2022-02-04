import { Button, Grid, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { loginAction } from '../../redux/slices/account';
import { addNotificationAction } from '../../redux/slices/notifications';
import AppendPreviousParams from '../../utils/AppendPreviousParams';
import { toEnglishNumber } from '../../utils/translateNumber';

const InputFields = ({ isFetching, login, addNotification, token }) => {
  const [data, setData] = useState({
    password: '',
    username: '',
  });

  const urlParams = new URLSearchParams(window.location.search);
  const eventId = urlParams.get('private_event_enter');
  if (token) {
    if (eventId) {
      return <Redirect to={`/event/${eventId}/`} />;
    } else {
      return <Redirect to="/events/" />;
    }
  }

  const isJustDigits = (number) => {
    var regex = new RegExp(`\\d{${number.length}}`);
    if (regex.test(toEnglishNumber(number))) {
      return true;
    } else {
      return false;
    }
  };

  const putData = (event) => {
    setData({
      ...data,
      [event.target.name]: toEnglishNumber(event.target.value),
    });
  };

  const doLogin = () => {
    const { username, password } = data;
    if (!username || !password) {
      addNotification({
        message: 'لطفاً همه‌ی مواردی که ازت خواسته شده رو پر کن!',
        type: 'error',
      });
      return;
    }

    login(data);
  };

  return (
    <>
      <Grid item>
        <TextField
          autoComplete="on"
          variant="outlined"
          fullWidth
          onChange={(e) => {
            if (isJustDigits(e.target.value)) {
              putData(e);
            }
          }}
          value={data.username}
          name="username"
          label="نام کاربری"
          inputProps={{ className: 'ltr-input' }}
        />
      </Grid>

      <Grid item>
        <TextField
          autoComplete="on"
          variant="outlined"
          fullWidth
          onChange={putData}
          label="گذرواژه"
          name="password"
          inputProps={{ className: 'ltr-input' }}
          type="password"
        />
      </Grid>

      <Grid container item direction="row" justifyContent="center">
        <Button
          onClick={doLogin}
          variant="contained"
          color="primary"
          disabled={isFetching}
          fullWidth>
          بزن بریم
        </Button>
      </Grid>

      <Grid item>
        <Typography align="center" gutterBottom>
          {'اگر گذرواژه‌ات را فراموش کردی، به '}
          <Link to={AppendPreviousParams("/reset_password")}>{'این‌جا'}</Link>
          {' مراجعه کن.'}
        </Typography>
        <Typography align="center">
          {'اگر هم حساب کاربری نداری، '}
          <Link to={AppendPreviousParams("/create_account")}>{'این‌جا'}</Link>
          {' یک حساب جدید برای خودت بساز!'}
        </Typography>
      </Grid>
    </>
  );
};

const mapStateToProps = (state) => ({
  token: state.account.token,
  isFetching: state.account.isFetching,
});

export default connect(mapStateToProps, {
  login: loginAction,
  addNotification: addNotificationAction,
})(InputFields);
